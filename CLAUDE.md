# CLAUDE.md

All conventions for this repo live in [AGENTS.md](AGENTS.md) — read it first.

Quick facts:
- Static HTML, no build. Preview: `python scripts/serve.py` → http://127.0.0.1:8765/
- Single source of truth for tracks/nodes: `registry.js` (strict JSON inside).
- New page: copy `templates/model-page.html`; register the node; add rows to `tracks/<track>/SOURCES.md`.
- Before committing: `python scripts/check.py` must report 0 errors.
- Content language: Chinese; every number needs a source; mark paper-vs-code discrepancies.
