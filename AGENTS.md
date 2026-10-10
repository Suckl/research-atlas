# AGENTS.md — how to work in this repo

This is a **static, no-build research atlas**: HTML pages that dissect research methods
(architecture, tensor shapes, objectives, design choices) along evolutionary "tracks".
Everything is plain HTML + CSS + vanilla JS. Open any page directly (`file://`) or run
`python scripts/serve.py` (no-cache server on http://127.0.0.1:8765).

Audience: a researcher who wants to understand *why* each method is built the way it is.
Language of the content is **Chinese (zh-CN)**; code, identifiers and paper titles stay English.

## Layout

```
index.html                      site root — lists tracks (rendered from registry.js)
registry.js                     THE single source of truth: tracks, nodes, edges, facts
assets/css/atlas.css            design tokens (light/dark), layout, diagram (.dg) styles
assets/js/atlas.js              runtime: header/hero/TOC/pager, [data-render] blocks,
                                clickable architecture figures + walkthrough, KaTeX, widgets
assets/js/widgets/*.js          interactive demos; each registers window.AtlasWidgets["<name>"]
templates/model-page.html       copy this to start a new model/concept page
tracks/<track>/index.html       track overview (lineage, timeline, compare table)
tracks/<track>/NN-<slug>.html   one page per node
tracks/<track>/SOURCES.md       where every number on that track's pages comes from
scripts/check.py                validation (registry JSON, links, ids, defs) — run before commit
scripts/serve.py                local preview server
```

## Adding a node (paper / concept) to an existing track

1. **Register it** in `registry.js` → `nodes[]`. Required: `id`, `track`, `kind`
   (`model` | `concept` | `bridge`), `lane`, `title`, `date` (`YYYY-MM`), `page`, `tldr`.
   Add `facts{}` (keys = that track's `compare_fields[].key`) for model nodes so the
   compare table picks it up. Put the node into the track's `reading_order` and add
   `milestones[]` / `edges[]` entries as appropriate.
2. **Create the page** by copying `templates/model-page.html` to
   `tracks/<track>/NN-<slug>.html`. Set `<body data-node="<id>">` and keep the section
   skeleton (see "Page anatomy"). The header, hero, TOC and prev/next are rendered from the
   registry — do not hand-write them.
3. **Draw the architecture** as inline SVG inside `<figure class="arch">` (see "Diagrams").
4. **Record sources** in `tracks/<track>/SOURCES.md` (one row per fact: value → paper
   section / table / code file).
5. Run `python scripts/check.py`. Fix everything it reports.

## Adding a track

1. Append to `registry.js` → `tracks[]` (`id`, `title`, `short`, `page`, `summary`,
   `reading_order`, `lanes`, `milestones`, `compare_fields`).
2. Copy `tracks/jepa/index.html` → `tracks/<track>/index.html`, change `data-track` and
   the hand-written prose; the `[data-render]` blocks are generic.
3. Add nodes as above. Create `tracks/<track>/SOURCES.md`.

## registry.js schema

The file assigns a **strict-JSON** object to `window.ATLAS_REGISTRY` (double quotes, no
trailing commas, no comments inside the object). `scripts/check.py` parses it with a JSON
parser, so keep it that way.

```
site:   { title, subtitle, lang }
tracks: [{ id, title, short, status, page, summary,
           reading_order: [node ids in reading order],
           lanes: [{ id, label }],            // rows of the lineage diagram
           milestones: [{ date, label, node? }],
           compare_fields: [{ key, label }] }]  // rows of the compare table
nodes:  [{ id, track, kind, lane, title, full_title?, authors?, org?, date, venue?, arxiv?,
           links?: [{ label, url }], page, tldr, tags?, facts?: { <compare key>: text } }]
edges:  [{ from, to, label }]                  // lineage arrows (node ids)
```

`page` paths are relative to the repo root. A page may include a `#fragment`.

## Page anatomy (what templates/model-page.html gives you)

```
<body data-root="../../" data-page-kind="model" data-track="<track>" data-node="<id>">
<header id="site-header">            ← filled by atlas.js
<svg class="atlas-defs">…</svg>      ← arrow markers + hatch pattern used by every diagram; keep verbatim
<div class="layout"><nav class="toc"> <main class="content">
  <div data-hero>                    ← title/authors/links/TL;DR from registry
  <h2 id="motivation">   1. 动机
  <h2 id="architecture"> 2. 全局架构  → <figure class="arch" id="fig-arch">
  <h2 id="components">   3. 组件拆解  (h3 per component; widgets go here)
  <h2 id="shapes">       4. 张量形状追踪 (table.shapes)
  <h2 id="objective">    5. 训练目标与防坍塌 (KaTeX)
  <h2 id="pseudocode">   6. 伪代码 (<pre><code class="lang-py">)
  <h2 id="hyperparams">  7. 关键超参
  <h2 id="results">      8. 关键结果
  <h2 id="evolution">    9. 承上启下 (.diff was/now)
  <h2 id="references">   参考
  <div data-pager>                   ← prev/next from reading_order
```

Keep the section ids: the TOC is generated from `h2[id]`/`h3[id]`, and cross-page links
rely on them (`01-i-jepa.html#c-masking`, etc.).

### Conventions for prose

- Every quantitative claim must be traceable: cite inline with `<span class="src">论文 Tab. 6</span>`
  and add a row to `SOURCES.md`. When paper and official code disagree, say so in a
  `<div class="callout code-note">` ("论文 vs 官方代码") and prefer the code for reproduction.
- Mark anything you could not verify with `<span class="unverified">…</span>`; never present
  an estimate as a paper number.
- Use the same symbols across pages: `x` context/history, `y` target, `z` conditioning
  variable, `s_x/s_y` representations, `Enc_θ`, `Pred_φ`, `D` distance/energy, `λ` reg weight.
- Math: `\( … \)` inline, `$$ … $$` display (KaTeX auto-render). Inside `<pre>`/`<code>` math
  is not rendered.

### Diagrams (`svg.dg`)

- Inline SVG, `viewBox` ~960 wide, `class="dg"`. Only CSS variables for colour — never raw hex
  for semantic parts (light/dark themes). Scene-illustration colours (a sky, a ball) may be hex.
- Semantic roles → CSS classes on the group or box:
  `enc` online/trainable encoder · `tgt` EMA/frozen encoder · `pred` predictor ·
  `loss` loss/energy · `act` actions/proprioception · `reg` regulariser · `data` inputs/indices.
  Token squares: `<rect class="tk enc|tgt|pred|act|mask|off">`. Edges: `<path class="edge [enc|tgt|pred|act|loss|reg|sg|ema|grad|idx]">`
  (`sg` dashed = stop-gradient, `ema` dotted purple, `grad` = gradient path, `idx` = index/mask routing).
- Interactive architecture figure: `<figure class="arch">` containing
  `.arch-canvas > svg.dg` + `.arch-foot > .arch-panel + .controls` + hidden `.arch-notes`.
  - Clickable component: `<g data-part="<id>">` ↔ `<div data-note="<id>">` in `.arch-notes`.
  - Walkthrough: put `data-step="k"` (space-separated list allowed) on any SVG element and a
    `<div data-step-note="k">` per step. Steps number the forward/backward computation order.
  - Do **not** put inline `opacity` on stepped elements (the walkthrough controls opacity).
- Each page carries the `<svg class="atlas-defs">` block (markers `ah`, `ah-enc`, … and
  `#hatch`). Copy it verbatim from the template; `check.py` verifies it exists on pages that
  use `.dg`.

### Widgets

`<div data-widget="<name>" data-…></div>` + `<script defer src="../../assets/js/widgets/<file>.js">`.
Available: `mask-2d` (I-JEPA block masking), `mask-3d` (V-JEPA tubelet masking),
`attn-mask` (block-causal vs causal+AdaLN), `cem` (CEM + MPC toy planner),
`sigreg` (SIGReg / Epps–Pulley in 2-D with gradient descent).
New widget = new file registering `window.AtlasWidgets["<name>"] = (el, Atlas) => {…}`;
helpers on `Atlas`: `h` (DOM), `s` (SVG), `rng(seed)`, `gauss(rand)`, `esc`, `typeset`.
Widgets must be deterministic for a given seed and must not fetch anything.

## Checks

```
python scripts/check.py          # registry is strict JSON; every node.page exists; ids unique;
                                 # every data-part has a data-note; local links resolve;
                                 # pages that use .dg contain atlas-defs; widgets referenced are loaded
```

There is no test suite beyond this and a manual look in a browser (`python scripts/serve.py`).
When you change `atlas.js` or `atlas.css`, open at least one model page and one track index.

## Things not to do

- Don't add a build step, bundler, framework or package.json. Pages must work from `file://`.
- Don't load third-party scripts other than KaTeX from jsDelivr (already pinned to 0.16.11).
- Don't hand-write the header/hero/TOC/pager; they come from the registry.
- Don't duplicate facts between `registry.js` `facts{}` and page prose in a way that can drift —
  the compare table is the registry; the page is the explanation. If a number changes, change
  both and the SOURCES row.
