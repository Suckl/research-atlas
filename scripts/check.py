"""Repo consistency checks (stdlib only). Run: python scripts/check.py

Checks
  1. registry.js assigns strict JSON to window.ATLAS_REGISTRY; required keys present; ids unique.
  2. Every node.page / track.page exists; reading_order / milestones / edges reference known ids.
  3. Every HTML page: data-node matches a registry node (if set); local href/src targets exist
     (including #fragments on the same page); pages using svg.dg contain the atlas-defs block;
     every data-part has a data-note and vice-versa; every data-widget has its script loaded.
Exit code 1 on any error. Warnings do not fail.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Windows consoles default to a legacy code page; page paths/ids contain CJK text.
for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


# --------------------------------------------------------------------------- registry
def load_registry() -> dict:
    text = (ROOT / "registry.js").read_text(encoding="utf-8")
    m = re.search(r"window\.ATLAS_REGISTRY\s*=\s*(\{.*\})\s*;\s*$", text, re.S)
    if not m:
        err("registry.js: could not find `window.ATLAS_REGISTRY = {...};`")
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        err(f"registry.js is not strict JSON: {e}")
        return {}


def check_registry(reg: dict) -> tuple[set[str], set[str]]:
    for key in ("site", "tracks", "nodes", "edges"):
        if key not in reg:
            err(f"registry.js: missing top-level key '{key}'")
    tracks = reg.get("tracks", [])
    nodes = reg.get("nodes", [])
    track_ids = [t.get("id") for t in tracks]
    node_ids = [n.get("id") for n in nodes]
    for name, ids in (("track", track_ids), ("node", node_ids)):
        for i, c in Counter(ids).items():
            if c > 1:
                err(f"registry.js: duplicate {name} id '{i}'")
    tset, nset = set(track_ids), set(node_ids)

    for t in tracks:
        for k in ("id", "title", "short", "page", "reading_order", "compare_fields"):
            if k not in t:
                err(f"track '{t.get('id')}': missing '{k}'")
        for n in [x for x in reg.get("nodes", []) if x.get("track") == t.get("id") and x.get("reading")]:
            if not (ROOT / n["reading"]).exists():
                err(f"node '{n['id']}': reading page not found: {n['reading']}")
        if not (ROOT / t.get("page", "")).exists():
            err(f"track '{t.get('id')}': page not found: {t.get('page')}")
        if t.get("overview") and not (ROOT / t["overview"]).exists():
            err(f"track '{t.get('id')}': overview page not found: {t['overview']}")
        for nid in t.get("reading_order", []):
            if nid not in nset:
                err(f"track '{t['id']}': reading_order references unknown node '{nid}'")
        lane_ids = {l.get("id") for l in t.get("lanes", [])}
        prev = ""
        for m in t.get("milestones", []):
            where = f"track '{t['id']}': milestone {m.get('date')} '{str(m.get('label', ''))[:30]}'"
            if not re.fullmatch(r"\d{4}-\d{2}", str(m.get("date", ""))):
                err(f"{where}: date must be YYYY-MM")
            if m.get("date", "") < prev:
                warn(f"{where}: milestones not in chronological order")
            prev = max(prev, m.get("date", ""))
            if m.get("node"):
                if m["node"] not in nset:
                    err(f"{where}: references unknown node '{m['node']}'")
                elif next(n for n in nodes if n.get("id") == m["node"]).get("track") != t["id"]:
                    err(f"{where}: node '{m['node']}' belongs to another track")
            elif m.get("url"):
                if not str(m["url"]).startswith("https://"):
                    err(f"{where}: external url must be https://")
            else:
                err(f"{where}: needs either 'node' or 'url'")
            if m.get("anchor") and not m.get("node"):
                err(f"{where}: 'anchor' only makes sense together with 'node'")
        for n in nodes:
            if n.get("track") == t["id"] and lane_ids and n.get("lane") not in lane_ids:
                err(f"node '{n['id']}': lane '{n.get('lane')}' not in track lanes {sorted(lane_ids)}")
        keys = {f["key"] for f in t.get("compare_fields", [])}
        for n in nodes:
            if n.get("track") == t["id"] and n.get("facts"):
                extra = set(n["facts"]) - keys
                if extra:
                    warn(f"node '{n['id']}': facts keys not in compare_fields: {sorted(extra)}")

    for n in nodes:
        for k in ("id", "track", "kind", "title", "date", "page", "tldr"):
            if k not in n:
                err(f"node '{n.get('id')}': missing '{k}'")
        if n.get("track") not in tset:
            err(f"node '{n.get('id')}': unknown track '{n.get('track')}'")
        for k in n.get("also", []):
            if k not in tset:
                err(f"node '{n.get('id')}': unknown track '{k}' in also")
        if n.get("kind") not in ("model", "concept", "bridge", "paper"):
            err(f"node '{n.get('id')}': kind must be model|concept|bridge|paper")
        if not re.fullmatch(r"\d{4}-\d{2}", str(n.get("date", ""))):
            err(f"node '{n.get('id')}': date must be YYYY-MM")
        page = n.get("page", "").split("#")[0]
        if not (ROOT / page).exists():
            err(f"node '{n.get('id')}': page not found: {page}")
    for e in reg.get("edges", []):
        for k in ("from", "to"):
            if e.get(k) not in nset:
                err(f"edge {e}: unknown node '{e.get(k)}'")
    return tset, nset


# --------------------------------------------------------------------------- html
class PageScan(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.scripts: list[str] = []
        self.parts: list[str] = []
        self.notes: list[str] = []
        self.steps: set[str] = set()
        self.step_notes: set[str] = set()
        self.widgets: list[str] = []
        self.body: dict[str, str] = {}
        self.has_dg = False
        self.has_defs = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = {k: (v or "") for k, v in attrs}
        if "id" in a:
            self.ids.add(a["id"])
        if tag in ("a", "link") and a.get("href"):
            self.links.append(a["href"])
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        if tag == "body":
            self.body = a
        if "data-part" in a:
            self.parts.append(a["data-part"])
        if "data-note" in a:
            self.notes.append(a["data-note"])
        if "data-step" in a:
            self.steps.update(a["data-step"].split())
        if "data-step-note" in a:
            self.step_notes.add(a["data-step-note"])
        if "data-widget" in a:
            self.widgets.append(a["data-widget"])
        cls = a.get("class", "").split()
        if tag == "svg" and "dg" in cls:
            self.has_dg = True
        if tag == "svg" and "atlas-defs" in cls:
            self.has_defs = True


WIDGET_FILES = {
    "mask-2d": "mask2d.js",
    "mask-3d": "mask3d.js",
    "attn-mask": "attnmask.js",
    "cem": "cem.js",
    "sigreg": "sigreg.js",
    "roofline": "roofline.js",
    "paged-kv": "pagedkv.js",
    "specdec": "specdec.js",
    "collectives": "collectives.js",
    "fewstep-2d": "fewstep2d.js",
    "memory-toy": "memorytoy.js",
    "dllm-decode": "dllmdecode.js",
}


def check_questions(reg: dict, node_ids: set[str]) -> None:
    """track.questions[].nodes[] must point at known nodes, and each anchor must exist on the page."""
    by_id = {n["id"]: n for n in reg.get("nodes", []) if "id" in n}
    for t in reg.get("tracks", []):
        for q in t.get("questions", []):
            for k in ("id", "text", "nodes"):
                if k not in q:
                    err(f"track '{t.get('id')}': question {q} missing '{k}'")
            for ref in q.get("nodes", []):
                nid = ref.get("node")
                if nid not in node_ids:
                    err(f"track '{t.get('id')}' {q.get('id')}: unknown node '{nid}'")
                    continue
                page = ROOT / by_id[nid]["page"].split("#")[0]
                if not page.exists():
                    continue
                scan = PageScan()
                scan.feed(page.read_text(encoding="utf-8"))
                anchor = ref.get("anchor")
                if anchor and anchor not in scan.ids:
                    err(f"track '{t.get('id')}' {q.get('id')}: page {page.relative_to(ROOT).as_posix()} has no id '{anchor}'")


def check_anchors(reg: dict) -> None:
    """node.page '#fragment's and milestone 'anchor's must exist on the target page."""
    by_id = {n["id"]: n for n in reg.get("nodes", []) if "id" in n}
    cache: dict[Path, set[str]] = {}

    def ids_of(page: Path) -> set[str]:
        if page not in cache:
            scan = PageScan()
            scan.feed(page.read_text(encoding="utf-8"))
            cache[page] = scan.ids
        return cache[page]

    wanted = [(n["page"].split("#")[0], n["page"].split("#")[1], f"node '{n['id']}'")
              for n in by_id.values() if "#" in n.get("page", "")]
    for t in reg.get("tracks", []):
        for m in t.get("milestones", []):
            if m.get("anchor") and m.get("node") in by_id:
                wanted.append((by_id[m["node"]]["page"].split("#")[0], m["anchor"], f"milestone {m.get('date')} ({m['node']})"))
    for page_rel, frag, who in wanted:
        page = ROOT / page_rel
        if page.exists() and frag not in ids_of(page):
            err(f"{who}: page {page_rel} has no id '{frag}'")


def check_page(path: Path, node_ids: set[str]) -> None:
    rel = path.relative_to(ROOT).as_posix()
    p = PageScan()
    p.feed(path.read_text(encoding="utf-8"))

    node = p.body.get("data-node")
    if node and node not in node_ids:
        err(f"{rel}: data-node '{node}' not in registry")
    if p.has_dg and not p.has_defs:
        err(f"{rel}: uses svg.dg but has no <svg class=\"atlas-defs\"> block")

    for part in set(p.parts):
        if part not in p.notes:
            err(f"{rel}: data-part '{part}' has no matching data-note")
    for note in p.notes:
        if note not in p.parts:
            warn(f"{rel}: data-note '{note}' has no matching data-part")
    for s in p.steps:
        if s not in p.step_notes:
            err(f"{rel}: data-step '{s}' has no data-step-note")
    for s in p.step_notes:
        if s not in p.steps:
            warn(f"{rel}: data-step-note '{s}' has no element with that data-step")

    for w in set(p.widgets):
        f = WIDGET_FILES.get(w)
        if not f:
            err(f"{rel}: unknown widget '{w}' (register it in scripts/check.py WIDGET_FILES)")
        elif not any(s.endswith("widgets/" + f) for s in p.scripts):
            err(f"{rel}: widget '{w}' used but assets/js/widgets/{f} is not loaded")

    for href in p.links + p.scripts:
        if re.match(r"^(https?:|mailto:|data:)", href):
            continue
        target, _, frag = href.partition("#")
        if not target:
            if frag and frag not in p.ids:
                err(f"{rel}: broken fragment #{frag}")
            continue
        tpath = (path.parent / target).resolve()
        if not tpath.exists():
            err(f"{rel}: broken link {href}")
            continue
        if frag and tpath.suffix == ".html":
            other = PageScan()
            other.feed(tpath.read_text(encoding="utf-8"))
            if frag not in other.ids:
                err(f"{rel}: {href} — no id '{frag}' in target")


def main() -> int:
    reg = load_registry()
    _, node_ids = check_registry(reg) if reg else (set(), set())
    pages = [p for p in ROOT.rglob("*.html") if "templates" not in p.parts and ".git" not in p.parts]
    for page in sorted(pages):
        check_page(page, node_ids)
    if reg:
        check_questions(reg, node_ids)
        check_anchors(reg)
    # nodes without a page scan (page listed but no data-node pointing back)
    declared = {n["page"].split("#")[0] for n in reg.get("nodes", [])}
    linked_back = set()
    for page in pages:
        p = PageScan()
        p.feed(page.read_text(encoding="utf-8"))
        if p.body.get("data-node"):
            linked_back.add(page.relative_to(ROOT).as_posix())
    for d in declared:
        if d not in linked_back:
            warn(f"{d}: registered as a node page but has no <body data-node>")

    for w in warnings:
        print("WARN ", w)
    for e in errors:
        print("ERROR", e)
    print(f"\n{len(pages)} pages, {len(node_ids)} nodes — {len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
