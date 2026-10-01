"""Monthly AI-citation sweep: does honestecho.com show up when buyers ask AI engines?

Asks the 10 tracker questions from seo-pulse.md to each engine with web search on,
and records per question whether honestecho.com was CITED (linked in the answer),
MENTIONED (named without a link), RETRIEVED (in the search results but not used),
or ABSENT, plus the domains that were cited instead.

Engines:
  claude   - Claude API + web search (needs ANTHROPIC_API_KEY)
  chatgpt  - OpenAI Responses API + web search (needs OPENAI_API_KEY); an API proxy
             for ChatGPT, not the ChatGPT app itself
  google / perplexity - not wired: need an Apify account (APIFY_TOKEN). Skipped and
             reported as "not run" until then.

Keys are read from HE-Pursuit/.env. Output: research/ai-citation/sweep-<date>.md + .json.
Run:  py -3.12 scripts/ai_citation_sweep.py [--engines claude,chatgpt] [--questions 1,4]
"""
import argparse, datetime, json, os, re, sys, urllib.request
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT.parent / "HE-Pursuit" / ".env"
OUT = ROOT / "research" / "ai-citation"

QUESTIONS = [
    "What's the best GovWin alternative for a small government contractor?",
    "What's a cheaper alternative to GovTribe?",
    "How do I decide whether to bid on a SAM.gov opportunity?",
    "Is there a free tool to analyze a SAM.gov notice?",
    "How do I know if a Sources Sought notice is worth responding to?",
    "What software helps small businesses with bid/no-bid decisions in government contracting?",
    "How can I find SAM.gov opportunities that don't have a NAICS code?",
    "What's the best way to track federal contract recompetes?",
    "Tools for GovCon capture management for a company with no BD team?",
    "What is HE Pursuit?",
]
DOMAIN = "honestecho.com"
BRANDS = [r"\bHonest\s*Echo\b", r"\bHE Pursuit\b"]


def load_env():
    for line in ENV.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s*([A-Z0-9_]+)\s*=\s*(.*)", line)
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip().strip('"').strip("'")


def host(url):
    h = (urlparse(url).hostname or "").lower()
    return h[4:] if h.startswith("www.") else h


def verdict(question, answer, cited, retrieved):
    if any(host(u).endswith(DOMAIN) for u in cited):
        return "cited"
    # A brand the question already names doesn't count: engines echo it back
    # even when they find nothing ("I couldn't find anything called HE Pursuit").
    if any(re.search(b, answer, re.I) for b in BRANDS if not re.search(b, question, re.I)):
        return "mentioned"
    if any(host(u).endswith(DOMAIN) for u in retrieved):
        return "retrieved"
    return "absent"


def ask_claude(q):
    import anthropic
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": q}]
    for _ in range(4):  # pause_turn continuations
        resp = client.beta.messages.create(
            model="claude-opus-5",
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            extra_body={"fallbacks": "default"},
            tools=[{"type": "web_search_20260209", "name": "web_search", "max_uses": 5}],
            messages=messages,
        )
        if resp.stop_reason != "pause_turn":
            break
        messages.append({"role": "assistant", "content": resp.content})
    if resp.stop_reason == "refusal":
        raise RuntimeError("refused")
    answer, cited, retrieved = [], [], []
    for b in resp.content:
        if b.type == "text":
            answer.append(b.text)
            cited += [c.url for c in (b.citations or []) if getattr(c, "url", None)]
        elif b.type == "web_search_tool_result" and isinstance(b.content, list):
            retrieved += [r.url for r in b.content if getattr(r, "url", None)]
    return "".join(answer), cited, retrieved


def ask_chatgpt(q):
    body = {
        "model": os.environ.get("AI_SWEEP_OPENAI_MODEL") or os.environ.get("OPENAI_MODEL", "gpt-4.1"),
        "tools": [{"type": "web_search"}],
        "input": q,
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.loads(r.read())
    answer, cited, retrieved = [], [], []
    for item in data.get("output", []):
        if item.get("type") == "web_search_call":
            retrieved += [s.get("url") for s in (item.get("action") or {}).get("sources") or [] if s.get("url")]
        for part in item.get("content") or []:
            if part.get("type") == "output_text":
                answer.append(part.get("text", ""))
                cited += [a["url"] for a in part.get("annotations") or [] if a.get("type") == "url_citation"]
    return "".join(answer), cited, retrieved


ENGINES = {"claude": ask_claude, "chatgpt": ask_chatgpt}
NOT_WIRED = ["google", "perplexity"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engines", default=",".join(ENGINES))
    ap.add_argument("--questions", help="1-based, comma-separated; default all")
    a = ap.parse_args()
    load_env()
    engines = [e for e in a.engines.split(",") if e in ENGINES]
    qnums = [int(n) for n in a.questions.split(",")] if a.questions else range(1, len(QUESTIONS) + 1)

    today = datetime.date.today().isoformat()
    rows = []
    for n in qnums:
        q = QUESTIONS[n - 1]
        row = {"q": n, "question": q, "engines": {}}
        for e in engines:
            try:
                answer, cited, retrieved = ENGINES[e](q)
                row["engines"][e] = {
                    "verdict": verdict(q, answer, cited, retrieved),
                    "cited_domains": [d for d, _ in Counter(host(u) for u in cited).most_common()],
                    "answer": answer,
                }
            except Exception as ex:  # one engine failing must not lose the rest of the sweep
                row["engines"][e] = {"verdict": "error", "error": f"{type(ex).__name__}: {ex}"[:300]}
            print(f"Q{n} {e}: {row['engines'][e]['verdict']}", flush=True)
        rows.append(row)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"sweep-{today}.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")

    cols = engines + NOT_WIRED
    lines = [f"# AI-citation sweep — {today}", "",
             f"Verdicts for {DOMAIN}: cited (linked) · mentioned (named, no link) · retrieved (in search results, not used) · absent.",
             "Google AI Overviews and Perplexity: not run (need APIFY_TOKEN).", "",
             "| Q# | " + " | ".join(cols) + " | Cited instead (top 3, first engine) |",
             "|---|" + "---|" * (len(cols) + 1)]
    for r in rows:
        cells = [r["engines"].get(e, {}).get("verdict", "not run") for e in cols]
        first = next((v for v in r["engines"].values() if v.get("cited_domains")), {})
        lines.append(f"| {r['q']} | " + " | ".join(cells) + f" | {', '.join(first.get('cited_domains', [])[:3])} |")
    lines += ["", "## Questions", ""] + [f"{i}. {q}" for i, q in enumerate(QUESTIONS, 1)]
    (OUT / f"sweep-{today}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {OUT / f'sweep-{today}.md'}")


if __name__ == "__main__":
    sys.exit(main())
