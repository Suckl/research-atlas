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
      // review questions this page answers (from track.questions), linked to local anchors
      const covers = ((t && t.questions) || [])
        .map((q) => ({ q, ref: (q.nodes || []).find((r) => r.node === n.id) }))
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
      const prev = i > 0 ? Atlas.node(order[i - 1]) : null;
      const next = i >= 0 && i < order.length - 1 ? Atlas.node(order[i + 1]) : null;
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
      const nodes = R.nodes.filter((n) => n.track === t.id);
      const dates = [...new Set(nodes.map((n) => n.date))].sort();
      const lanes = t.lanes || [{ id: "main", label: "" }];
      const colW = 168, minLaneH = 92, left = 128, top = 18, bw = 142, bh = 54, gap = 10;
      // Nodes sharing a (month, lane) cell are stacked; each lane grows to fit its tallest stack.
      const laneOf = (n) => Math.max(0, lanes.findIndex((l) => l.id === n.lane));
      const cells = {};
      nodes.forEach((n) => { const k = dates.indexOf(n.date) + "|" + laneOf(n); (cells[k] = cells[k] || []).push(n); });
      const laneH = lanes.map((_, li) => {
        const most = Math.max(1, ...Object.entries(cells).filter(([k]) => +k.split("|")[1] === li).map(([, v]) => v.length));
        return Math.max(minLaneH, most * (bh + gap) + 28);
      });
      const laneTop = laneH.map((_, i) => top + laneH.slice(0, i).reduce((a, b) => a + b, 0));
      const W = left + dates.length * colW + 10, H = top + laneH.reduce((a, b) => a + b, 0) + 6;
      const pos = {};
      Object.entries(cells).forEach(([k, group]) => {
        const [ci, li] = k.split("|").map(Number);
        const stackH = group.length * (bh + gap) - gap;
        group.forEach((n, j) => { pos[n.id] = { x: left + ci * colW, y: laneTop[li] + (laneH[li] - stackH) / 2 + j * (bh + gap) }; });
      });
      const svg = Atlas.s("svg", { class: "dg lineage", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t.title + " 演化图" });
      lanes.forEach((l, i) => {
        const y = laneTop[i];
        if (i > 0) Atlas.s("line", { class: "lane-ln", x1: 0, x2: W, y1: y, y2: y }, svg);
        const tx = Atlas.s("text", { class: "lane-label", x: 6, y: y + laneH[i] / 2 }, svg);
        tx.textContent = l.label;
      });
      (R.edges || []).filter((e) => pos[e.from] && pos[e.to]).forEach((e) => {
        const a = pos[e.from], b = pos[e.to];
        const x1 = a.x + bw, y1 = a.y + bh / 2, x2 = b.x - 4, y2 = b.y + bh / 2;
        const mx = (x1 + x2) / 2;
        Atlas.s("path", { class: "edge", d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` }, svg);
        const lab = Atlas.s("text", { class: "edge-label t-c", x: mx, y: (y1 + y2) / 2 - 8 }, svg);
        lab.textContent = e.label.length > 14 ? e.label.slice(0, 13) + "…" : e.label;
        Atlas.s("title", { text: e.label }, lab);
      });
      nodes.forEach((n) => {
        const p = pos[n.id];
        const a = Atlas.s("a", { href: href(n.page) }, svg);
        const g = Atlas.s("g", { class: "node kind-" + n.kind }, a);
        Atlas.s("rect", { x: p.x, y: p.y, width: bw, height: bh, rx: 9 }, g);
        Atlas.s("text", { class: "t-c t-b", x: p.x + bw / 2, y: p.y + 21, text: n.title }, g);
        Atlas.s("text", { class: "t-c t-sm", x: p.x + bw / 2, y: p.y + 39, text: n.date }, g);
        Atlas.s("title", { text: n.tldr || n.title }, g);
      });
      host.classList.add("lineage-wrap");
      host.replaceChildren(svg);
      // Long titles: squeeze into the box instead of spilling over neighbours.
      svg.querySelectorAll(".node text.t-b").forEach((tx) => {
        const len = tx.getComputedTextLength ? tx.getComputedTextLength() : 0;
        if (len > bw - 12) { tx.setAttribute("textLength", bw - 12); tx.setAttribute("lengthAdjust", "spacingAndGlyphs"); }
      });
      // Wide tracks (many date columns) would scale text illegibly: keep natural size and scroll instead.
      const cw = host.clientWidth || 900;
      if (W > cw * 1.35) svg.style.width = W + "px";
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
