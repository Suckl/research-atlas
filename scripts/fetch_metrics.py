"""Refresh citation metrics for every arXiv paper in registry.js (stdlib only).

Run:  python scripts/fetch_metrics.py
Writes papers/metrics.js:  window.ATLAS_METRICS = { fetched, source, papers: { "<arxiv id>": {...} } }
  citations    — Semantic Scholar citationCount
  influential  — Semantic Scholar influentialCitationCount ("highly influential citations")
  s2           — Semantic Scholar paper id (for links)
Unauthenticated Semantic Scholar is rate-limited; the script backs off and retries. Set S2_API_KEY to use a key.
The numbers are a snapshot: the library page shows the fetch date next to them.
"""
from __future__ import annotations

import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.semanticscholar.org/graph/v1/paper/batch?fields=citationCount,influentialCitationCount,externalIds"


def registry() -> dict:
    text = (ROOT / "registry.js").read_text(encoding="utf-8")
    return json.loads(re.search(r"window\.ATLAS_REGISTRY\s*=\s*(\{.*\})\s*;\s*$", text, re.S).group(1))


MATCH = "https://api.semanticscholar.org/graph/v1/paper/search/match?fields=title,citationCount,influentialCitationCount&query="


def post(ids: list[str]) -> list:
    return request(API, json.dumps({"ids": [f"ARXIV:{i}" for i in ids]}).encode())


def title_match(title: str) -> dict | None:
    """Best title match. Used when the ARXIV: lookup lands on an empty duplicate record (seen for DeepSeek-V3)."""
    try:
        rec = (request(MATCH + urllib.parse.quote(title)).get("data") or [None])[0]
    except urllib.error.HTTPError as e:
        if e.code in (400, 404):   # 400: S2 rejects some titles (e.g. very short or symbol-heavy ones)
            return None
        raise
    norm = lambda s: re.sub(r"\W+", "", s).lower()
    return rec if rec and norm(rec.get("title", "")) == norm(title) else None


def request(url: str, body: bytes | None = None):
    headers = {"Content-Type": "application/json"}
    if os.environ.get("S2_API_KEY"):
        headers["x-api-key"] = os.environ["S2_API_KEY"]
    for attempt in range(8):
        try:
            req = urllib.request.Request(url, data=body, headers=headers, method="POST" if body else "GET")
            return json.loads(urllib.request.urlopen(req, timeout=120).read())
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            wait = 5 * 2 ** attempt
            print(f"rate-limited, retrying in {wait}s", file=sys.stderr)
            time.sleep(wait)
    raise SystemExit("Semantic Scholar kept rate-limiting; try again later or set S2_API_KEY")


def existing() -> dict:
    p = ROOT / "papers" / "metrics.js"
    if not p.exists():
        return {}
    text = p.read_text(encoding="utf-8")
    return json.loads(text[text.index("{"):text.rindex("}") + 1])


def main() -> None:
    reg = registry()
    ids = sorted({n["arxiv"] for n in reg["nodes"] if n.get("arxiv")})
    out = {}
    # --missing: only query papers absent from the current snapshot and merge them in (small requests get through
    # Semantic Scholar's unauthenticated rate limit far more often than a full refresh)
    old = existing() if "--missing" in sys.argv else {}
    if old:
        out = dict(old.get("papers", {}))
        ids = [i for i in ids if i not in out]
        print(f"--missing: {len(ids)} papers to fetch")
    for i in range(0, len(ids), 400):
        chunk = ids[i:i + 400]
        for aid, rec in zip(chunk, post(chunk)):
            if rec:
                out[aid] = {"citations": rec.get("citationCount"), "influential": rec.get("influentialCitationCount"),
                            "s2": rec.get("paperId")}
    # a paper older than ~6 months with 0 citations usually means the arXiv id maps to an empty duplicate record:
    # retry by exact title and keep the better-cited record
    cutoff = (datetime.date.today() - datetime.timedelta(days=180)).strftime("%Y-%m")
    for n in reg["nodes"]:
        aid, m = n.get("arxiv"), out.get(n.get("arxiv"))
        if not aid or (m and m["citations"]) or (n.get("date") or "9999") > cutoff or not n.get("full_title"):
            continue
        if old and aid not in ids:   # --missing: leave papers already in the snapshot alone
            continue
        title = re.split(r"[（(；;]", n["full_title"])[0].strip()
        rec = title_match(title)
        time.sleep(1.5)
        if rec and (rec.get("citationCount") or 0) > ((m or {}).get("citations") or 0):
            out[aid] = {"citations": rec.get("citationCount"), "influential": rec.get("influentialCitationCount"),
                        "s2": rec.get("paperId")}
            print(f"{aid}: used title match '{title}' ({rec.get('citationCount')} citations)")
    # a --missing merge keeps the snapshot's date: most of the numbers still come from that fetch
    data = {"fetched": (old.get("fetched") if old else None) or datetime.date.today().isoformat(),
            "source": "Semantic Scholar", "papers": out}
    js = "/* Generated by scripts/fetch_metrics.py — citation snapshot; do not edit by hand. */\nwindow.ATLAS_METRICS = " \
         + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
    (ROOT / "papers").mkdir(exist_ok=True)
    (ROOT / "papers" / "metrics.js").write_text(js, encoding="utf-8", newline="\n")
    if old:
        print(f"--missing: {sum(1 for i in ids if i in out)} / {len(ids)} fetched; {len(out)} papers in papers/metrics.js")
    else:
        print(f"{len(out)} / {len(ids)} papers with metrics → papers/metrics.js")


if __name__ == "__main__":
    for s in (sys.stdout, sys.stderr):
        try:
            s.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    main()
