/* Research Atlas — shared runtime (no build step, no framework).
 *
 * Load order on every page (all `defer`, order matters):
 *   registry.js → katex(+auto-render) → assets/js/atlas.js → assets/js/widgets/*.js
 *
 * What this file does on DOMContentLoaded:
 *   - fills <header id="site-header">, [data-hero], nav.toc, [data-pager] from registry
 *   - renders track-level blocks: [data-render="track-cards|node-cards|timeline|lineage|compare"]
 *   - wires figure.arch: clickable [data-part] + step-by-step walkthrough ([data-step])
 *   - highlights <pre><code class="lang-py">, renders KaTeX, mounts [data-widget] elements
 * Page contract: <body data-root="../../" data-page-kind="model" data-track="jepa" data-node="i-jepa">
 * See AGENTS.md for the full contract.
 */
(function () {
  "use strict";
  const R = window.ATLAS_REGISTRY || { tracks: [], nodes: [], edges: [], site: {} };
  const SVGNS = "http://www.w3.org/2000/svg";

  const Atlas = (window.Atlas = window.Atlas || {});
  Atlas.registry = R;
  Atlas.node = (id) => R.nodes.find((n) => n.id === id);
  Atlas.track = (id) => R.tracks.find((t) => t.id === id);

  /* ---------- tiny DOM helpers (also used by widgets) ---------- */
  Atlas.h = function (tag, attrs, children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of [].concat(children || [])) {
      if (c == null) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  };
  Atlas.s = function (tag, attrs, parent) {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null) continue;
      if (k === "text") el.textContent = v;
      else el.setAttribute(k, v);
    }
    if (parent) parent.appendChild(el);
    return el;
  };
  Atlas.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* seeded RNG (mulberry32) so widgets can be reproducible */
  Atlas.rng = function (seed) {
    let a = seed >>> 0 || 1;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  Atlas.gauss = function (rand) {
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const body = () => document.body;
  const root = () => (body().dataset.root || "");
  const href = (p) => (/^https?:/.test(p) ? p : root() + p);

  /* ---------- theme ---------- */
  function getTheme() { try { return localStorage.getItem("atlas-theme") || "auto"; } catch (e) { return "auto"; } }
  function setTheme(t) {
    if (t === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    try { localStorage.setItem("atlas-theme", t); } catch (e) { /* ignore */ }
  }
  const THEME_LABEL = { auto: "◐ 自动", light: "☀ 浅色", dark: "☾ 深色" };

  /* ---------- header ---------- */
  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    host.className = "site-header";
    const node = Atlas.node(body().dataset.node);
    const track = Atlas.track(body().dataset.track);
    const crumbs = [];
    if (track) crumbs.push(`<a href="${href(track.page)}">${Atlas.esc(track.short || track.title)}</a>`);
    if (node) crumbs.push(`<span>${Atlas.esc(node.title)}</span>`);
    const crumbHTML = crumbs.length ? crumbs.map((c) => `<span class="sep">/</span>${c}`).join("") : "";
    host.innerHTML = `<div class="bar">
      <a class="brand" href="${href("index.html")}"><span class="dot"></span>${Atlas.esc(R.site.title || "Atlas")}</a>
      <nav class="crumbs" aria-label="breadcrumb">${crumbHTML}</nav>
      <span class="spacer"></span>
      <a class="nav-link${body().dataset.pageKind === "library" ? " on" : ""}" href="${href("papers/index.html")}">论文书架</a>
      <button class="icon-btn" id="theme-btn" type="button" title="切换主题"></button>
    </div>`;
    const btn = host.querySelector("#theme-btn");
    const order = ["auto", "light", "dark"];
    btn.textContent = THEME_LABEL[getTheme()];
    btn.addEventListener("click", () => {
      const next = order[(order.indexOf(getTheme()) + 1) % order.length];
      setTheme(next);
      btn.textContent = THEME_LABEL[next];
    });
  }

  /* ---------- hero (model / concept pages) ---------- */
  function renderHero() {
    document.querySelectorAll("[data-hero]").forEach((host) => {
      const n = Atlas.node(host.dataset.hero || body().dataset.node);
      if (!n) { host.textContent = "⚠ registry 中找不到该节点：" + (host.dataset.hero || body().dataset.node); return; }
      const t = Atlas.track(n.track);
      const kindLabel = KIND_LABEL[n.kind] || n.kind;
      const authors = (n.authors || []).join(", ");
      // review questions this page answers (from track.questions), linked to local anchors — including questions
      // attached to the other nodes that live on this same page (e.g. "06-llada.html#smdm")
      const file = (x) => (x && x.page ? x.page.split("#")[0] : "");
      const onPage = (id) => id === n.id || file(Atlas.node(id)) === file(n);
      const covers = ((t && t.questions) || [])
        .map((q) => ({ q, ref: (q.nodes || []).find((r) => onPage(r.node)) }))
        .filter((x) => x.ref)
        .map(({ q, ref }) => `<a href="#${Atlas.esc(ref.anchor || "questions")}" title="${Atlas.esc(q.text)}">${Atlas.esc(q.id)}</a>`)
        .join("");
      const links = (n.links || []).map((l) => `<a class="pill" href="${Atlas.esc(l.url)}" target="_blank" rel="noopener">${Atlas.esc(l.label)} ↗</a>`).join("");
      const tags = (n.tags || []).map((x) => `<span class="tag">${Atlas.esc(x)}</span>`).join("");
      host.classList.add("hero");
      host.innerHTML = `
        <div class="kicker">${Atlas.esc(t ? t.short : "")} · ${kindLabel} · ${Atlas.esc(n.date || "")}</div>
        <h1>${Atlas.esc(n.title)}</h1>
        ${n.full_title ? `<p class="full-title">${Atlas.esc(n.full_title)}</p>` : ""}
        <div class="meta">
          ${authors ? `<span>${Atlas.esc(authors)}</span>` : ""}
          ${n.org ? `<span>${Atlas.esc(n.org)}</span>` : ""}
          ${n.venue ? `<span>${Atlas.esc(n.venue)}</span>` : ""}
        </div>
        ${links ? `<div class="links">${links}</div>` : ""}
        ${tags ? `<div class="tags">${tags}</div>` : ""}
        ${covers ? `<div class="covers" aria-label="本页简答题"><span class="tag">本页简答题</span>${covers}</div>` : ""}
        ${n.tldr ? `<div class="tldr" id="tldr"><span class="label">TL;DR</span><p>${Atlas.esc(n.tldr)}</p></div>` : ""}`;
    });
  }
  const KIND_LABEL = { model: "模型", concept: "概念", bridge: "前置", paper: "论文" };

  /* ---------- table of contents + scrollspy ---------- */
  function renderTOC() {
    const toc = document.querySelector("nav.toc");
    if (!toc) return;
    const heads = [...document.querySelectorAll("main h2[id], main h3[id]")].filter((h) => !h.closest(".arch, .widget"));
    if (!heads.length) { toc.remove(); document.querySelector(".layout")?.classList.add("no-toc"); return; }
    const ol = Atlas.h("ol");
    heads.forEach((hd) => {
      const a = Atlas.h("a", { href: "#" + hd.id, text: hd.dataset.toc || [...hd.childNodes].map((c) => c.textContent.trim()).filter(Boolean).join(" ") });
      ol.append(Atlas.h("li", { class: "lvl-" + hd.tagName[1] }, a));
    });
    toc.replaceChildren(Atlas.h("div", { class: "toc-title", text: "本页目录" }), ol);
    const links = [...toc.querySelectorAll("a")];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-70px 0px -70% 0px" });
    heads.forEach((hd) => obs.observe(hd));
  }

  /* ---------- prev / next ---------- */
  function renderPager() {
    document.querySelectorAll("[data-pager]").forEach((host) => {
      const t = Atlas.track(body().dataset.track);
      const id = body().dataset.node;
      if (!t) return;
      const order = t.reading_order || [];
      const i = order.indexOf(id);
      // nodes that live on this same page (e.g. "02-x.html#reflow") are skipped; a neighbouring page is
      // represented by its primary node (the one whose page has no #fragment)
      const file = (n) => (n ? n.page.split("#")[0] : "");
      const here = file(Atlas.node(id));
      const primary = (n) => R.nodes.find((m) => m.page === file(n)) || n;
      let pi = i - 1, ni = i + 1;
      while (pi >= 0 && file(Atlas.node(order[pi])) === here) pi--;
      while (i >= 0 && ni < order.length && file(Atlas.node(order[ni])) === here) ni++;
      const prev = i > 0 && pi >= 0 ? primary(Atlas.node(order[pi])) : null;
      const next = i >= 0 && ni < order.length ? primary(Atlas.node(order[ni])) : null;
      host.className = "pager";
      host.innerHTML =
        (prev ? `<a class="prev" href="${href(prev.page)}"><span class="dir">← 上一篇</span>${Atlas.esc(prev.title)}</a>` : `<a class="prev" href="${href(t.page)}"><span class="dir">← 返回路线</span>${Atlas.esc(t.short)} 总览</a>`) +
        (next ? `<a class="next" href="${href(next.page)}"><span class="dir">下一篇 →</span>${Atlas.esc(next.title)}</a>` : `<a class="next" href="${href(t.page)}"><span class="dir">回到总览 →</span>${Atlas.esc(t.short)} 总览</a>`);
    });
  }

  /* ---------- track-level renderers ---------- */
  function nodeCard(n) {
    const kindLabel = KIND_LABEL[n.kind] || n.kind;
    return `<a class="card kind-${n.kind}" href="${href(n.page)}">
      <div class="card-kicker">${Atlas.esc(n.date || "")} · ${kindLabel}${n.venue ? " · " + Atlas.esc(n.venue) : ""}</div>
      <h3>${Atlas.esc(n.title)}</h3><p>${Atlas.esc(n.tldr || "")}</p></a>`;
  }
  const RENDER = {
    "track-cards"(host) {
      host.classList.add("cards");
      host.innerHTML = R.tracks.map((t) => {
        const n = R.nodes.filter((x) => x.track === t.id);
        return `<a class="card big kind-model" href="${href(t.page)}">
          <div class="card-kicker">研究路线 · ${n.length} 个节点 · ${Atlas.esc(t.status || "")}</div>
          <h3>${Atlas.esc(t.title)}</h3><p>${Atlas.esc(t.summary || "")}</p></a>`;
      }).join("");
    },
    "node-cards"(host) {
      const t = Atlas.track(host.dataset.track || body().dataset.track);
      if (!t) return;
      host.classList.add("cards");
      const ids = t.reading_order.concat(R.nodes.filter((n) => n.track === t.id && !t.reading_order.includes(n.id)).map((n) => n.id));
      host.innerHTML = ids.map((id) => Atlas.node(id)).filter(Boolean).map(nodeCard).join("");
    },
    timeline(host) {
      const t = Atlas.track(host.dataset.track || body().dataset.track);
      if (!t) return;
      // Milestones either point at a node page (optionally at an #anchor) or, for papers
      // without their own page, at an external url (rendered with ↗ and a hollow dot).
      const ul = Atlas.h("ol", { class: "timeline" });
      let year = "";
      (t.milestones || []).forEach((m) => {
        const y = String(m.date).slice(0, 4);
        if (y !== year) { year = y; ul.append(Atlas.h("li", { class: "year", html: `<span class="date">${Atlas.esc(y)}</span><span class="what"></span>` })); }
        const n = m.node ? Atlas.node(m.node) : null;
        let label = Atlas.esc(m.label), kind = "concept";
        if (n) {
          const url = href(n.page.split("#")[0]) + (m.anchor ? "#" + m.anchor : (n.page.includes("#") ? "#" + n.page.split("#")[1] : ""));
          label = `<a href="${Atlas.esc(url)}">${label}</a>`;
          kind = n.kind;
        } else if (m.url) {
          label = `<a class="ext" href="${Atlas.esc(m.url)}" target="_blank" rel="noopener">${label}</a>`;
          kind = "ext";
        }
        const venue = m.venue ? ` <span class="venue">${Atlas.esc(m.venue)}</span>` : "";
        ul.append(Atlas.h("li", { class: "kind-" + kind, html: `<span class="date">${Atlas.esc(m.date)}</span><span class="what">${label}${venue}</span>` }));
      });
      const legend = Atlas.h("p", { class: "timeline-legend", html: `<span class="tl-dot own"></span>本站有拆解页（点击进入）　<span class="tl-dot ext"></span>外部论文链接 ↗（未单独成页）` });
      host.replaceChildren(legend, ul);
    },
    lineage(host) {
      const t = Atlas.track(host.dataset.track || body().dataset.track);
      if (!t) return;
      // Vertical layout: one column per lane, time flows downwards in year bands. The svg is drawn at
      // the host's real width (no scaling), so text stays legible and the page scrolls vertically.
      const nodes = R.nodes.filter((n) => n.track === t.id);
      const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
      const edges = (R.edges || []).filter((e) => byId[e.from] && byId[e.to]);
      const lanes = t.lanes && t.lanes.length ? t.lanes : [{ id: "main", label: "" }];
      const laneOf = (n) => Math.max(0, lanes.findIndex((l) => l.id === n.lane));
      const order = t.reading_order || [];
      const rank = (n) => (order.includes(n.id) ? order.indexOf(n.id) : 999);
      // time bands: a year by default; tracks whose nodes cluster in a short period can set
      // "lineage_band": "half" | "quarter" for finer rows (labels "2025 H2" / "2025 Q3")
      const bandMode = t.lineage_band || "year";
      const yearOf = (n) => {
        const y = String(n.date).slice(0, 4), m = +String(n.date).slice(5, 7) || 1;
        return bandMode === "quarter" ? `${y} Q${Math.ceil(m / 3)}` : bandMode === "half" ? `${y} H${m > 6 ? 2 : 1}` : y;
      };
      const byModality = nodes.some((n) => n.modality);
      const up = {}, down = {};
      edges.forEach((e) => { (up[e.to] = up[e.to] || []).push(e.from); (down[e.from] = down[e.from] || []).push(e.to); });

      // 1) order: chronological, but a node never precedes its parents (Kahn, ties by date then reading order)
      const indeg = Object.fromEntries(nodes.map((n) => [n.id, (up[n.id] || []).length]));
      const ready = nodes.filter((n) => !indeg[n.id]), seq = [];
      const cmp = (a, b) => String(a.date).localeCompare(String(b.date)) || rank(a) - rank(b);
      while (ready.length) {
        ready.sort(cmp);
        const n = ready.shift(); seq.push(n);
        (down[n.id] || []).forEach((c) => { if (--indeg[c] === 0) ready.push(byId[c]); });
      }
      nodes.forEach((n) => { if (!seq.includes(n)) seq.push(n); });
      // 2) rows: within a year band a node takes the next free row of its lane, below same-year parents
      const row = {}, next = {};
      seq.forEach((n) => {
        const y = yearOf(n), k = y + "|" + laneOf(n);
        let r = next[k] || 0;
        (up[n.id] || []).forEach((p) => { if (yearOf(byId[p]) === y && row[p] !== undefined) r = Math.max(r, row[p] + 1); });
        row[n.id] = r; next[k] = r + 1;
      });
      const years = [...new Set(nodes.map(yearOf))].sort();
      const rowsOf = {}, base = {};
      let acc = 0;
      years.forEach((y) => { rowsOf[y] = 1 + Math.max(0, ...nodes.filter((n) => yearOf(n) === y).map((n) => row[n.id])); base[y] = acc; acc += rowsOf[y]; });

      // 3) geometry
      host.classList.add("lineage-wrap");
      const avail = Math.floor((host.clientWidth || 900) - 22);
      const W = Math.max((bandMode === "year" ? 56 : 70) + lanes.length * 128, avail);
      host.classList.toggle("scroll", W > avail);
      host.dataset.w = String(avail);
      const gutter = bandMode === "year" ? 52 : 66, colW = (W - gutter - 4) / lanes.length;
      const bw = Math.min(200, colW - 22), bh = 52, gapV = 28, pitch = bh + gapV, top = 4;
      const H = top + acc * pitch + 4;
      const P = {};
      nodes.forEach((n) => {
        P[n.id] = { x: gutter + laneOf(n) * colW + (colW - bw) / 2, y: top + (base[yearOf(n)] + row[n.id]) * pitch + gapV / 2 };
      });

      const mk = "lin-ah-" + t.id;
      const svg = Atlas.s("svg", { class: "dg lineage", viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": t.title + " 演化图" });
      const defs = Atlas.s("defs", {}, svg);
      [["", "var(--text-3)"], ["-x", "var(--c-act)"], ["-on", "var(--text)"]].forEach(([s, c]) => {
        const m = Atlas.s("marker", { id: mk + s, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
        Atlas.s("path", { d: "M0,0 L10,5 L0,10 z", style: "fill:" + c }, m);
      });
      // year bands + lane separators
      years.forEach((y, i) => {
        const y0 = top + base[y] * pitch;
        Atlas.s("rect", { class: "band" + (i % 2 ? " alt" : ""), x: 0, y: y0, width: W, height: rowsOf[y] * pitch, rx: 6 }, svg);
        Atlas.s("text", { class: "year-label", x: 8, y: y0 + gapV / 2 + 14, text: y }, svg);
      });
      lanes.forEach((_, li) => { if (li) Atlas.s("line", { class: "lane-sep", x1: gutter + li * colW, x2: gutter + li * colW, y1: top, y2: H - 4 }, svg); });

      // edges (under nodes), labels (over nodes)
      const gE = Atlas.s("g", {}, svg), gN = Atlas.s("g", {}, svg), gL = Atlas.s("g", {}, svg);
      const inLane = (li, y0, y1) => nodes.some((m) => laneOf(m) === li && P[m.id].y > y0 && P[m.id].y < y1);
      // Same-lane edges that skip over nodes become brackets in the column margins. Overlapping brackets
      // get separate tracks (shorter spans inside), alternating right / left margin.
      const trk = {}, used = {};
      edges.filter((e) => laneOf(byId[e.from]) === laneOf(byId[e.to]) && inLane(laneOf(byId[e.from]), P[e.from].y, P[e.to].y))
        .sort((e1, e2) => (P[e1.to].y - P[e1.from].y) - (P[e2.to].y - P[e2.from].y))
        .forEach((e) => {
          const li = laneOf(byId[e.from]), y0 = P[e.from].y, y1 = P[e.to].y, u = (used[li] = used[li] || []);
          let k = 0; while (u.some(([a, b, kk]) => kk === k && a <= y1 && y0 <= b)) k++;
          u.push([y0, y1, k]); trk[e.from + ">" + e.to] = k;
        });
      edges.forEach((e) => {
        const a = byId[e.from], b = byId[e.to], pa = P[a.id], pb = P[b.id], la = laneOf(a), lb = laneOf(b);
        const cross = byModality && a.modality === "image" && b.modality === "video";
        const k = trk[e.from + ">" + e.to];
        let d, mx, my, anchor = "middle";
        if (la === lb && k === undefined) {
          const x = pa.x + bw / 2;
          d = `M${x},${pa.y + bh} V${pb.y - 1}`; mx = x; my = (pa.y + bh + pb.y) / 2;
        } else if (la === lb) {
          const side = k % 2 ? -1 : 1, off = 7 + 4 * Math.floor(k / 2), r = 4;
          const x1 = side > 0 ? pa.x + bw : pa.x, xo = x1 + side * off, y1 = pa.y + bh / 2, y2 = pb.y + bh / 2;
          d = `M${x1},${y1} H${xo - side * r} Q${xo},${y1} ${xo},${y1 + r} V${y2 - r} Q${xo},${y2} ${xo - side * r},${y2} H${x1 + side}`;
          mx = xo - side * 5; my = (y1 + y2) / 2; anchor = side > 0 ? "end" : "start";
        } else {
          // leave from the bottom / enter from the top unless a node of the same lane is in the way,
          // in which case leave / enter through the side that faces the other lane
          // (other lanes in between may hold boxes too: try a few curve shapes, keep the first that misses them)
          const dir = lb > la ? 1 : -1, blockA = inLane(la, pa.y, pb.y), blockB = inLane(lb, pa.y, pb.y);
          const ends = (sideA, sideB) => [
            sideA ? (dir > 0 ? pa.x + bw : pa.x) : pa.x + bw / 2, sideA ? pa.y + bh / 2 : pa.y + bh,
            sideB ? (dir > 0 ? pb.x - 1 : pb.x + bw + 1) : pb.x + bw / 2, sideB ? pb.y + bh / 2 : pb.y - 1];
          const bez = (c) => { const pts = []; for (let s = 0; s <= 1.0001; s += 0.02) { const u = 1 - s, w = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s]; pts.push([0, 1].map((j) => w.reduce((v, wi, i) => v + wi * c[i][j], 0))); } return pts; };
          const line = (p, q) => Array.from({ length: 21 }, (_, i) => [p[0] + (q[0] - p[0]) * i / 20, p[1] + (q[1] - p[1]) * i / 20]);
          const curve = (sideA, sideB, f) => {
            const [x1, y1, x2, y2] = ends(sideA, sideB), kk = Math.max(18, Math.min(64 * f, (y2 - y1) * f / 2));
            const c = [[x1, y1], sideA ? [x1 + dir * 36, y1] : [x1, y1 + kk], sideB ? [x2 - dir * 36, y2] : [x2, y2 - kk], [x2, y2]];
            return { d: `M${c[0]} C${c[1]} ${c[2]} ${c[3]}`, pts: bez(c), m: [(x1 + x2) / 2, (y1 + y2) / 2] };
          };
          // elbows: drop down the source column then run sideways into the target, or the reverse
          const elbow = (down) => {
            const [x1, y1, x2, y2] = down ? ends(false, true) : ends(true, false), r = 6;
            if (down) return { d: `M${x1},${y1} V${y2 - r} Q${x1},${y2} ${x1 + dir * r},${y2} H${x2}`, pts: line([x1, y1], [x1, y2]).concat(line([x1, y2], [x2, y2])), m: [(x1 + x2) / 2, y2] };
            return { d: `M${x1},${y1} H${x2 - dir * r} Q${x2},${y1} ${x2},${y1 + r} V${y2}`, pts: line([x1, y1], [x2, y1]).concat(line([x2, y1], [x2, y2])), m: [(x1 + x2) / 2, y1] };
          };
          // last resort, always box-free: drop into the gap below the source row, run along it to the lane
          // separator next to the target, go down the separator and enter the target from the side
          const gutter = () => {
            const x1 = pa.x + bw / 2, y1 = pa.y + bh, yg = pa.y + bh + gapV / 2, half = (colW - bw) / 2;
            const xm = dir > 0 ? pb.x - half : pb.x + bw + half, y2 = pb.y + bh / 2, x2 = dir > 0 ? pb.x - 1 : pb.x + bw + 1;
            return { d: `M${x1},${y1} V${yg} H${xm} V${y2} H${x2}`, pts: [], m: [xm, (yg + y2) / 2] };
          };
          const hits = (pts) => pts.slice(2, -2).some(([x, y]) => nodes.some((m) => m !== a && m !== b && x > P[m.id].x - 2 && x < P[m.id].x + bw + 2 && y > P[m.id].y - 2 && y < P[m.id].y + bh + 2));
          const tries = [() => curve(blockA, blockB, 1), () => curve(blockA, true, 1), () => curve(true, blockB, 1), () => curve(true, true, 1),
            () => curve(blockA, blockB, 3), () => (blockA ? null : elbow(true)), () => (blockB ? null : elbow(false)), gutter];
          const c = tries.map((f) => f()).find((cv) => cv && !hits(cv.pts));
          d = c.d; [mx, my] = c.m;
        }
        const ref = { "data-from": e.from, "data-to": e.to };
        const base = e.kind === "baseline";   // "main baseline comparison", not inheritance
        const path = Atlas.s("path", Object.assign({ class: "lin-edge" + (cross ? " x-modal" : "") + (base ? " baseline" : ""), d, "marker-end": `url(#${mk}${cross ? "-x" : ""})` }, ref), gE);
        Atlas.s("title", { text: `${a.title} → ${b.title}：${base ? "（主要对照）" : ""}${e.label}` }, path);
        Atlas.s("text", Object.assign({ class: "edge-label", x: mx, y: my, "text-anchor": anchor, text: e.label }, ref), gL);
      });
      // nodes
      const est = (s, fs) => [...s].reduce((w, c) => w + (/[⺀-￯]/.test(c) ? fs : c === " " ? fs * 0.3 : fs * 0.58), 0);
      const wrap = (s, max, fs) => {
        if (est(s, fs) <= max) return [s];
        // break after a colon if possible, else at the last fitting space that does not split "a / b",
        // else greedy by character (CJK)
        const split = (i, j) => [s.slice(0, i).trimEnd(), s.slice(j).trim()];
        const fits = ([a, b]) => a && b && est(a, fs) <= max;
        const ok = ([a, b]) => !/[/·]$/.test(a) && !/^[/·]/.test(b);
        const short = ([, b]) => est(b, fs) <= max * 1.15;
        const colon = [...s.matchAll(/[：:]/g)].map((m) => split(m.index + 1, m.index + 1)).filter(fits).reverse();
        const space = [...s.matchAll(/ /g)].map((m) => split(m.index, m.index + 1)).filter(fits).reverse();
        const pick = colon.find(short) || space.find((c) => ok(c) && short(c)) || space.find(ok);
        if (pick) return pick;
        const tok = s.match(/[A-Za-z0-9.+\-]+|./gu) || [s];
        let i = 0, w = 0;
        while (i < tok.length && w + est(tok[i], fs) <= max) w += est(tok[i++], fs);
        i = Math.max(1, i);   // a single over-long word still goes on line 1 (it is squeezed below)
        return [tok.slice(0, i).join("").trimEnd(), tok.slice(i).join("").trim()].filter(Boolean);
      };
      nodes.forEach((n) => {
        const p = P[n.id];
        const a = Atlas.s("a", { href: href(n.page), class: "lin-node", "data-id": n.id }, gN);
        const mod = byModality && n.kind !== "concept" ? " mod-" + (n.modality || "image") : "";
        const g = Atlas.s("g", { class: "node kind-" + n.kind + mod }, a);
        Atlas.s("rect", { x: p.x, y: p.y, width: bw, height: bh, rx: 9 }, g);
        const lines = wrap(n.title, bw - 14, 12.5);
        lines.forEach((ln, i) => Atlas.s("text", { class: "t-c t-b ttl", x: p.x + bw / 2, y: p.y + (lines.length > 1 ? 13 + i * 14.5 : 19), text: ln }, g));
        const meta = n.date + (byModality && n.modality === "video" ? " · 视频" : "") + (n.kind === "concept" ? " · 概念" : "");
        Atlas.s("text", { class: "t-c meta", x: p.x + bw / 2, y: p.y + (lines.length > 1 ? 43 : 37), text: meta }, g);
        Atlas.s("title", { text: n.tldr || n.title }, g);
      });

      // lane header (sticky HTML row aligned with the columns) + toolbar
      const head = Atlas.h("div", { class: "lineage-head", style: `grid-template-columns:${gutter}px repeat(${lanes.length}, ${colW}px);width:${W}px` });
      head.append(Atlas.h("span", { class: "lh-year", text: "年份" }));
      lanes.forEach((l) => head.append(Atlas.h("span", { text: l.label })));
      const swatches = byModality
        ? `<span><i class="lsw image"></i>图像</span><span><i class="lsw video"></i>视频</span><span><i class="lsw concept"></i>概念</span><span><i class="lln x"></i>图像 → 视频</span>`
        : [...new Set(nodes.map((n) => n.kind))].map((k) => `<span><i class="lsw ${k}"></i>${KIND_LABEL[k] || k}</span>`).join("");
      const edgeKinds = edges.some((e) => e.kind === "baseline") ? `<span><i class="lln"></i>继承</span><span><i class="lln b"></i>主要对照</span>` : "";
      const bar = Atlas.h("div", { class: "lineage-bar", html: `<span class="lb-legend">${swatches}${edgeKinds}</span><label><input type="checkbox"> 显示全部关系标签</label><span class="lb-hint">悬停节点：高亮它的上游与下游（点击进入拆解页）</span>` });
      bar.querySelector("input").addEventListener("change", (ev) => svg.classList.toggle("show-labels", ev.target.checked));
      host.replaceChildren(bar, head, svg);

      // squeeze title lines that still overflow their box
      svg.querySelectorAll(".node text.ttl").forEach((tx) => {
        const len = tx.getComputedTextLength ? tx.getComputedTextLength() : 0;
        if (len > bw - 10) { tx.setAttribute("textLength", bw - 10); tx.setAttribute("lengthAdjust", "spacingAndGlyphs"); }
      });

      // hover / focus: highlight ancestors + descendants and the edges between them
      const walk = (id, adj) => { const seen = new Set(), st = [id]; while (st.length) (adj[st.pop()] || []).forEach((y) => { if (!seen.has(y)) { seen.add(y); st.push(y); } }); return seen; };
      const focus = (id) => {
        const anc = walk(id, up), des = walk(id, down);
        const inA = (x) => x === id || anc.has(x), inD = (x) => x === id || des.has(x);
        svg.classList.add("focus");
        gN.querySelectorAll(".lin-node").forEach((el) => el.classList.toggle("on", inA(el.dataset.id) || inD(el.dataset.id)));
        svg.querySelectorAll("[data-from]").forEach((el) => {
          const f = el.dataset.from, to = el.dataset.to;
          const on = (inA(f) && inA(to)) || (inD(f) && inD(to));
          el.classList.toggle("on", on);
          if (el.tagName === "path") el.setAttribute("marker-end", `url(#${mk}${on ? "-on" : el.classList.contains("x-modal") ? "-x" : ""})`);
        });
      };
      const blur = () => {
        svg.classList.remove("focus");
        svg.querySelectorAll(".on").forEach((el) => el.classList.remove("on"));
        gE.querySelectorAll("path").forEach((el) => el.setAttribute("marker-end", `url(#${mk}${el.classList.contains("x-modal") ? "-x" : ""})`));
      };
      gN.querySelectorAll(".lin-node").forEach((el) => {
        el.addEventListener("mouseenter", () => focus(el.dataset.id));
        el.addEventListener("focus", () => focus(el.dataset.id));
        el.addEventListener("mouseleave", blur);
        el.addEventListener("blur", blur);
      });

      // re-layout when the available width changes noticeably
      if (!host._linResize) {
        let tm = 0;
        host._linResize = () => { clearTimeout(tm); tm = setTimeout(() => { if (Math.abs((host.clientWidth - 22) - +host.dataset.w) > 24) RENDER.lineage(host); }, 150); };
        window.addEventListener("resize", host._linResize);
      }
    },
    questions(host) {
      const t = Atlas.track(host.dataset.track || body().dataset.track);
      if (!t) return;
      const qs = t.questions || [];
      if (!qs.length) { host.textContent = "（该路线没有简答题）"; return; }
      const rows = qs.map((q) => {
        const where = (q.nodes || []).map((ref) => {
          const n = Atlas.node(ref.node);
          if (!n) return "";
          const url = href(n.page.split("#")[0]) + (ref.anchor ? "#" + ref.anchor : "");
          return `<a class="q-node" href="${Atlas.esc(url)}">${Atlas.esc(n.title)}</a>`;
        }).join("");
        return `<tr><td>${Atlas.esc(q.id)}</td><td>${Atlas.esc(q.text)}</td><td>${where}</td></tr>`;
      }).join("");
      host.classList.add("table-wrap");
      host.innerHTML = `<table class="qindex"><thead><tr><th>#</th><th>简答题</th><th>讲解位置</th></tr></thead><tbody>${rows}</tbody></table>`;
    },
    compare(host) {
      const t = Atlas.track(host.dataset.track || body().dataset.track);
      if (!t) return;
      const cols = t.reading_order.map(Atlas.node).filter((n) => n && n.facts);
      const fields = t.compare_fields || [];
      if (host.dataset.orient === "rows") {
        // one row per node, one column per field — readable when a track has many nodes
        let rows = `<table class="compare rows"><thead><tr><th>节点</th>${fields.map((f) => `<th>${Atlas.esc(f.label)}</th>`).join("")}</tr></thead><tbody>`;
        cols.forEach((n) => {
          rows += `<tr><td><a href="${href(n.page)}">${Atlas.esc(n.title)}</a><br><small>${Atlas.esc(n.date)}</small></td>${fields.map((f) => `<td>${Atlas.esc((n.facts || {})[f.key] || "—")}</td>`).join("")}</tr>`;
        });
        host.classList.add("table-wrap");
        host.innerHTML = rows + "</tbody></table>";
        return;
      }
      let html = `<table class="compare"><thead><tr><th>维度</th>${cols.map((n) => `<th><a href="${href(n.page)}">${Atlas.esc(n.title)}</a><br><small>${Atlas.esc(n.date)}</small></th>`).join("")}</tr></thead><tbody>`;
      fields.forEach((f) => {
        html += `<tr${f.key === "anti_collapse" || f.key === "condition" ? ' class="hl"' : ""}><td>${Atlas.esc(f.label)}</td>${cols.map((n) => `<td>${Atlas.esc((n.facts || {})[f.key] || "—")}</td>`).join("")}</tr>`;
      });
      host.classList.add("table-wrap");
      host.innerHTML = html + "</tbody></table>";
    },
  };
  function renderBlocks() {
    document.querySelectorAll("[data-render]").forEach((host) => {
      const fn = RENDER[host.dataset.render];
      if (fn) fn(host); else host.textContent = "⚠ 未知 data-render：" + host.dataset.render;
    });
  }

  /* ---------- architecture figures: parts + walkthrough ---------- */
  function wireArch(fig) {
    const svg = fig.querySelector("svg.dg");
    const panel = fig.querySelector(".arch-panel");
    if (!svg || !panel) return;
    const notes = {};
    fig.querySelectorAll(".arch-notes [data-note]").forEach((n) => (notes[n.dataset.note] = n.innerHTML));
    const steps = [...fig.querySelectorAll(".arch-notes [data-step-note]")]
      .map((n) => ({ k: +n.dataset.stepNote, html: n.innerHTML }))
      .sort((a, b) => a.k - b.k);
    const defaultHTML = panel.innerHTML || `<p class="hint">点击图中任意组件查看说明${steps.length ? "，或点「逐步讲解」按计算顺序走一遍" : ""}。</p>`;
    panel.innerHTML = defaultHTML;
    let active = null;

    const parts = [...svg.querySelectorAll("[data-part]")];
    parts.forEach((p) => {
      p.classList.add("part");
      p.setAttribute("tabindex", "0");
      p.setAttribute("role", "button");
      const act = (ev) => {
        ev.stopPropagation();
        if (walking) stopWalk();
        const id = p.dataset.part;
        if (active === id) return clear();
        active = id;
        svg.classList.add("has-active");
        parts.forEach((q) => q.classList.toggle("active", q.dataset.part === id));
        panel.innerHTML = notes[id] || `<p class="hint">（缺少 data-note="${Atlas.esc(id)}" 的说明）</p>`;
        typeset(panel);
      };
      p.addEventListener("click", act);
      p.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); act(ev); } });
    });
    function clear() {
      active = null;
      svg.classList.remove("has-active");
      parts.forEach((q) => q.classList.remove("active"));
      panel.innerHTML = defaultHTML;
    }
    svg.addEventListener("click", () => { if (active) clear(); });

    /* walkthrough */
    let walking = false, cur = 0;
    const stepped = [...svg.querySelectorAll("[data-step]")];
    const controls = fig.querySelector(".controls");
    if (!steps.length || !controls) return;
    const bStart = Atlas.h("button", { class: "btn primary", type: "button", text: "▶ 逐步讲解" });
    const bPrev = Atlas.h("button", { class: "btn", type: "button", text: "← 上一步", disabled: true });
    const bNext = Atlas.h("button", { class: "btn", type: "button", text: "下一步 →", disabled: true });
    const bExit = Atlas.h("button", { class: "btn", type: "button", text: "显示全部", disabled: true });
    const label = Atlas.h("span", { class: "step-label" });
    controls.append(bStart, bPrev, bNext, bExit, label);
    function show(k) {
      cur = k;
      stepped.forEach((el) => {
        const ks = el.dataset.step.split(/\s+/).map(Number);
        const first = Math.min(...ks);
        el.classList.toggle("future", first > k);
        el.classList.toggle("now", ks.includes(k));
      });
      const s = steps.find((x) => x.k === k);
      panel.innerHTML = s ? s.html : "";
      typeset(panel);
      label.textContent = `步骤 ${steps.findIndex((x) => x.k === k) + 1} / ${steps.length}`;
      const i = steps.findIndex((x) => x.k === k);
      bPrev.disabled = i <= 0;
      bNext.disabled = i >= steps.length - 1;
    }
    function startWalk() {
      clear();
      walking = true;
      svg.classList.add("walking");
      bExit.disabled = false;
      bStart.textContent = "↺ 从头开始";
      show(steps[0].k);
    }
    function stopWalk() {
      walking = false;
      svg.classList.remove("walking");
      stepped.forEach((el) => el.classList.remove("future", "now"));
      bPrev.disabled = bNext.disabled = bExit.disabled = true;
      bStart.textContent = "▶ 逐步讲解";
      label.textContent = "";
      panel.innerHTML = defaultHTML;
    }
    bStart.addEventListener("click", startWalk);
    bExit.addEventListener("click", stopWalk);
    bPrev.addEventListener("click", () => { const i = steps.findIndex((x) => x.k === cur); if (i > 0) show(steps[i - 1].k); });
    bNext.addEventListener("click", () => { const i = steps.findIndex((x) => x.k === cur); if (i < steps.length - 1) show(steps[i + 1].k); });
  }

  /* ---------- python-ish syntax highlighting ---------- */
  const PY_KW = /^(def|return|for|in|if|else|elif|with|import|from|as|class|while|and|or|not|None|True|False|lambda|yield|pass|break|continue|is|assert)$/;
  function highlight(code) {
    const src = code.textContent;
    const re = /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/g;
    let out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += Atlas.esc(src.slice(last, m.index));
      const [tok, com, str, num, fn, word] = m;
      if (com) out += `<span class="tok-c">${Atlas.esc(com)}</span>`;
      else if (str) out += `<span class="tok-s">${Atlas.esc(str)}</span>`;
      else if (num) out += `<span class="tok-n">${num}</span>`;
      else if (fn) out += PY_KW.test(fn) ? `<span class="tok-k">${fn}</span>` : `<span class="tok-f">${fn}</span>`;
      else if (word) out += PY_KW.test(word) ? `<span class="tok-k">${word}</span>` : word;
      else out += Atlas.esc(tok);
      last = re.lastIndex;
    }
    code.innerHTML = out + Atlas.esc(src.slice(last));
  }

  /* ---------- math ---------- */
  function typeset(el) {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    });
  }
  Atlas.typeset = typeset;

  /* ---------- widgets ---------- */
  function mountWidgets() {
    const W = window.AtlasWidgets || {};
    document.querySelectorAll("[data-widget]").forEach((el) => {
      const fn = W[el.dataset.widget];
      if (!fn) { el.textContent = "⚠ 未加载 widget：" + el.dataset.widget + "（检查 <script> 是否引入）"; return; }
      try { fn(el, Atlas); } catch (err) { el.textContent = "⚠ widget 出错：" + err.message; console.error(err); }
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    renderHeader();
    renderHero();
    renderBlocks();
    renderPager();
    document.querySelectorAll("pre code.lang-py").forEach(highlight);
    document.querySelectorAll("figure.arch").forEach(wireArch);
    mountWidgets();
    typeset(document.body);
    renderTOC();
    const jump = () => { if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); } };
    jump();
    window.addEventListener("load", jump, { once: true });   // again after fonts/KaTeX settle the layout
  }
  // Deferred scripts run while readyState === "interactive" but BEFORE DOMContentLoaded,
  // so always wait for DCL — that guarantees widget scripts (loaded after us) have registered.
  let booted = false;
  const once = () => { if (!booted) { booted = true; boot(); } };
  document.addEventListener("DOMContentLoaded", once);
  window.addEventListener("load", once);
  if (document.readyState === "complete") once();
})();
