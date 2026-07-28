# Vendored claude-seo skills — provenance

- **Upstream:** https://github.com/AgriciDaniel/claude-seo (MIT)
- **Pinned:** tag `v2.2.4`, commit `6b63c8bb7b2e8e4480060604555e3af629b54c2c` (released 2026-07-20)
- **Vendored:** 2026-07-28 by Zoe, after security review (no network calls, no exec, no credential requests, no agent fan-out in these files) and Codex adoption review (`HE-Pursuit/three-brain-out/2026-07-28-claude-seo-adoption/`).
- **Subset:** 8 of 25 skills — `seo-technical`, `seo-page`, `seo-content`, `seo-schema`, `seo-geo`, `seo-backlinks`, `seo-sitemap`, `seo-drift` — plus `hooks/validate-schema.py` vendored to `seo-schema/scripts/` for explicit runs (we do NOT install the plugin hook).
- **Deliberately omitted:** the master `seo` orchestrator, all 18 agents (fan-out cost), and the other 17 skills (ecommerce/hreflang/local/maps/programmatic/etc. — not applicable to an 18-URL SaaS brochure site), and all paid extensions (DataForSEO, Firecrawl).
- **Update policy:** quarterly, manually — diff the new tag against `v2.2.4` for these files, re-run the security scan, re-pin. Never track `main`; never use the upstream installer (it writes user-level `~/.claude`, which would inject SEO context into every unrelated project).
