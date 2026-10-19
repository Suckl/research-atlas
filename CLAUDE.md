# CLAUDE.md

All conventions for this repo live in [AGENTS.md](AGENTS.md) — read it first.

Quick facts:
- Static HTML, no build. Preview: `python scripts/serve.py` → http://127.0.0.1:8765/
- The site root is the paper library; each paper gets a reading page `papers/<slug>.html` (逐节精读) copied from
  `templates/reading-page.html`, following AGENTS.md "论文精读页（固定做法）". No full translations.
- Old method tracks live under `legacy/` (`legacy/tracks/<track>/…`), still registered in `registry.js`.
- Single source of truth for papers / tracks: `registry.js` (strict JSON inside); a node's `reading` field points to
  its reading page. Citation counts: `python scripts/fetch_metrics.py`.
- Before committing: `python scripts/check.py` must report 0 errors.
- Content language: Chinese; every number traceable to the paper; write in our own words, explain prerequisites,
  full cause-and-effect sentences, figures (original only if licensed, otherwise our own diagrams).
