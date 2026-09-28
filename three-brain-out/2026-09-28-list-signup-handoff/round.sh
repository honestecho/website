#!/usr/bin/env bash
# bash round.sh <N> — build, stage a private copy for the preview server (:4173,
# launch config he-website-zoe-preview), capture the list page, score with Codex.
set -euo pipefail
N="$1"
HERE="$(cd "$(dirname "$0")" && pwd)"
SITE="$HERE/../.."
cd "$SITE"
npm run build > "$HERE/build-$N.log" 2>&1
rm -rf scratch/dist-zoe && cp -r dist scratch/dist-zoe
node "C:/Users/aaron/.claude/skills/designloop/scripts/capture-page.mjs" \
  --url "http://localhost:4173/government-contracts-for-bid/construction/" \
  --out "$HERE" --round "$N" --select "#list-handoff,#list-shell" --hide "nav" --mobile
python - "$HERE" "$N" <<'PY'
import json, sys
d, n = sys.argv[1], sys.argv[2]
cap = json.load(open(f'{d}/capture-{n}.json', encoding='utf-8'))
open(f'{d}/context-{n}.txt', 'w', encoding='utf-8').write(cap['innerText'])
for k in ('desktop', 'mobile'):
    print(k, 'errors:', cap[k]['errors'][:3], 'xOverflow:', cap[k]['xOverflow'])
PY
bash "C:/Users/aaron/.claude/skills/designloop/scripts/score.sh" "$HERE" "$N"
