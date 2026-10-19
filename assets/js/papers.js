/* Research Atlas — paper library + reading pages (loaded after atlas.js on papers/*.html).
 *
 * Library   <body data-page-kind="library">  + <div id="library"></div>
 *           Lists every non-concept node of registry.js as a paper: shelves (未读 / 在读 / 已读 / 收藏, from
 *           localStorage), category = track, year jump, search, sort (date / citations), grouping, "继续阅读".
 *           Citations come from papers/metrics.js (window.ATLAS_METRICS, a dated Semantic Scholar snapshot).
 *           A node with `reading: "papers/<x>.html"` has a full reading page (粗读 + 全文翻译); cards link there,
 *           otherwise to the node's structure page.
 * Reading   <body data-page-kind="reading" data-node="<id>">
 *           [data-status] / [data-fav] controls, .read-progress bar, scroll progress through #fulltext (stored),
 *           bilingual blocks (.bi with .zh / .en; .bi-toggle per block; [data-mode="zh|bi"] global; [data-expand]).
 * Per-viewer state lives in localStorage under "atlas-paper:<node id>" = { status, fav, progress, pos, at }.
 * Storage can be unavailable (private mode): everything still renders, it just is not remembered.
 */
(function () {
  "use strict";
  const A = window.Atlas, R = (A && A.registry) || window.ATLAS_REGISTRY;
  const M = (window.ATLAS_METRICS && window.ATLAS_METRICS.papers) || {};
  const KEY = (id) => "atlas-paper:" + id;
  const load = (id) => { try { return JSON.parse(localStorage.getItem(KEY(id))) || {}; } catch (e) { return {}; } };
  const save = (id, st) => { try { localStorage.setItem(KEY(id), JSON.stringify(Object.assign(st, { at: Date.now() }))); } catch (e) { /* ignore */ } };
  const root = () => document.body.dataset.root || "";
  const href = (p) => (/^https?:/.test(p) ? p : root() + p);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (d) => { const [y, m] = String(d || "").split("-"); return y ? `${y} 年${m ? " " + (+m) + " 月" : ""}` : ""; };
  const fmtN = (n) => (n == null ? "" : n.toLocaleString("en-US"));
  const STATUS = { unread: "未读", reading: "在读", done: "已读" };
  const statusOf = (st) => st.status || (st.progress > 0.02 ? "reading" : "unread");

  /* ------------------------------------------------------------------ library */
  function papers() {
    const tracks = Object.fromEntries((R.tracks || []).map((t) => [t.id, t]));
    return (R.nodes || []).filter((n) => n.kind !== "concept").map((n) => {
      const m = (n.arxiv && M[n.arxiv]) || {};
      return { n, track: tracks[n.track], cites: m.citations, infl: m.influential, st: load(n.id),
               link: href(n.reading || n.page), year: String(n.date || "").slice(0, 4) };
    });
  }

  function renderLibrary(host) {
    const all = papers();
    const ui = { shelf: "all", cat: "all", q: "", sort: "date-desc", group: "year", full: false };
    try { Object.assign(ui, JSON.parse(localStorage.getItem("atlas-library-ui")) || {}); ui.q = ""; } catch (e) { /* ignore */ }
    const fetched = window.ATLAS_METRICS && window.ATLAS_METRICS.fetched;
    host.innerHTML = `
      <aside class="lib-side">
        <div class="lib-sec"><div class="lib-h">书架</div><div data-list="shelf"></div></div>
        <div class="lib-sec"><div class="lib-h">分类（研究路线）</div><div data-list="cat"></div></div>
        <div class="lib-sec"><div class="lib-h">跳到年份</div><div class="lib-years" data-list="year"></div></div>
        <div class="lib-sec"><div class="lib-h">内容</div><label class="lib-check"><input type="checkbox" data-k="full"> 只看有全文翻译的</label></div>
        <p class="lib-note">被引次数来自 Semantic Scholar${fetched ? `，截至 ${esc(fetched)}` : ""}；阅读进度与收藏只保存在你的浏览器里。</p>
      </aside>
      <div class="lib-main">
        <div class="lib-search"><input type="search" placeholder="搜索标题、机构、标签或摘要" data-k="q" aria-label="搜索"><kbd>/</kbd></div>
        <div class="lib-continue" hidden></div>
        <div class="lib-bar"><span class="lib-count"></span><span class="spacer"></span>
          <label>排序 <select data-k="sort"><option value="date-desc">发布时间（新→旧）</option><option value="date-asc">发布时间（旧→新）</option><option value="cites">被引次数（高→低）</option></select></label>
          <label>分组 <select data-k="group"><option value="year">按年份</option><option value="track">按路线</option><option value="none">不分组</option></select></label>
        </div>
        <div class="lib-groups"></div>
      </div>`;
    const $ = (s) => host.querySelector(s);
    const persist = () => { try { localStorage.setItem("atlas-library-ui", JSON.stringify(Object.assign({}, ui, { q: "" }))); } catch (e) { /* ignore */ } };

    function filtered() {
      const q = ui.q.trim().toLowerCase();
      return all.filter((p) => {
        const s = statusOf(p.st);
        if (ui.shelf === "fav" ? !p.st.fav : ui.shelf !== "all" && s !== ui.shelf) return false;
        if (ui.cat !== "all" && p.n.track !== ui.cat) return false;
        if (ui.full && !p.n.reading) return false;
        if (!q) return true;
        const hay = [p.n.title, p.n.full_title, p.n.org, p.n.venue, p.n.tldr, (p.n.tags || []).join(" "), p.track && p.track.short, p.n.arxiv].join(" ").toLowerCase();
        return q.split(/\s+/).every((w) => hay.includes(w));
      });
    }
    function card(p) {
      const s = statusOf(p.st), prog = Math.round(100 * (p.st.progress || 0));
      const tags = (p.n.tags || []).slice(0, 4).map((t) => `<span class="pc-tag">#${esc(t)}</span>`).join("");
      return `<a class="pcard${p.n.reading ? " has-full" : ""}" href="${esc(p.link)}">
        <div class="pc-top"><span class="pc-id">${p.n.arxiv ? "arXiv:" + esc(p.n.arxiv) : esc(p.n.venue || "")}</span><span>${esc(fmtDate(p.n.date))}</span>
          <span class="pc-icons">${p.st.fav ? '<i class="ic-fav" title="已收藏">★</i>' : ""}${s === "done" ? '<i class="ic-done" title="已读">✓</i>' : ""}</span></div>
        <h3>${esc(p.n.title)}</h3>
        ${p.n.full_title ? `<div class="pc-en">${esc(p.n.full_title)}</div>` : ""}
        <p class="pc-blurb">${esc(p.n.tldr && p.n.tldr !== "（占位）" ? p.n.tldr : "")}</p>
        <div class="pc-meta">${p.n.reading ? '<span class="pc-badge">全文翻译</span>' : '<span class="pc-badge alt">结构拆解</span>'}
          ${p.track ? `<span class="pc-track">${esc(p.track.short)}</span>` : ""}${p.n.org ? `<span class="pc-org">${esc(String(p.n.org).split(/[;；/、]/)[0])}</span>` : ""}
          ${p.cites != null ? `<span class="pc-cites" title="Semantic Scholar 被引次数（高影响力引用 ${fmtN(p.infl)}）">被引 ${fmtN(p.cites)}</span>` : ""}${tags}</div>
        <div class="pc-foot">${s !== "unread" ? `<span class="pc-status ${s}">${STATUS[s]}${s === "reading" ? " " + prog + "%" : ""}</span>` : ""}</div>
        ${prog > 0 && s !== "done" ? `<div class="pc-progress"><i style="width:${prog}%"></i></div>` : ""}
      </a>`;
    }
    function render() {
      persist();
      const list = filtered();
      // sidebar counts are computed on the other filters so the numbers stay meaningful
      const shelfCount = (k) => all.filter((p) => (k === "all" ? true : k === "fav" ? p.st.fav : statusOf(p.st) === k)).length;
      $('[data-list="shelf"]').innerHTML = [["all", "全部"], ["unread", "未读"], ["reading", "在读"], ["done", "已读"], ["fav", "收藏"]]
        .map(([k, l]) => `<button type="button" class="lib-item${ui.shelf === k ? " on" : ""}" data-shelf="${k}">${l}<span>${shelfCount(k)}</span></button>`).join("");
      $('[data-list="cat"]').innerHTML = [["all", "全部", all.length]].concat((R.tracks || []).map((t) => [t.id, t.short, all.filter((p) => p.n.track === t.id).length]))
        .map(([k, l, c]) => `<button type="button" class="lib-item${ui.cat === k ? " on" : ""}" data-cat="${k}">${esc(l)}<span>${c}</span></button>`).join("");
      const years = {};
      list.forEach((p) => (years[p.year] = (years[p.year] || 0) + 1));
      $('[data-list="year"]').innerHTML = Object.keys(years).sort().reverse()
        .map((y) => `<button type="button" class="lib-year" data-year="${y}">${y} <span>${years[y]}</span></button>`).join("");
      $(".lib-count").textContent = `共 ${all.length} 篇 · 显示 ${list.length} 篇`;
      // continue reading
      const cont = all.filter((p) => statusOf(p.st) === "reading").sort((a, b) => (b.st.at || 0) - (a.st.at || 0)).slice(0, 3);
      const cbox = $(".lib-continue");
      cbox.hidden = !cont.length;
      cbox.innerHTML = `<span class="lc-label">继续阅读</span>` + cont.map((p) => `<a class="lc-item" href="${esc(p.link)}"><b>${esc(p.n.title)}</b><span>${Math.round(100 * (p.st.progress || 0))}%</span><i style="width:${Math.round(100 * (p.st.progress || 0))}%"></i></a>`).join("");
      // sort + group
      const byDate = (a, b) => String(a.n.date).localeCompare(String(b.n.date));
      list.sort(ui.sort === "cites" ? (a, b) => (b.cites || 0) - (a.cites || 0) : ui.sort === "date-asc" ? byDate : (a, b) => byDate(b, a));
      const groups = [];
      const keyOf = (p) => (ui.group === "year" ? p.year : ui.group === "track" ? p.n.track : "");
      list.forEach((p) => { const k = keyOf(p); let g = groups.find((x) => x.k === k); if (!g) groups.push((g = { k, items: [] })); g.items.push(p); });
      // group order is fixed (years newest first, tracks in registry order); the sort applies inside each group
      if (ui.group === "track") groups.sort((a, b) => (R.tracks || []).findIndex((t) => t.id === a.k) - (R.tracks || []).findIndex((t) => t.id === b.k));
      if (ui.group === "year") groups.sort((a, b) => (ui.sort === "date-asc" ? a.k.localeCompare(b.k) : b.k.localeCompare(a.k)));
      const title = (k) => (ui.group === "year" ? `${k} 年` : ui.group === "track" ? ((R.tracks || []).find((t) => t.id === k) || {}).title || k : "");
      $(".lib-groups").innerHTML = list.length ? groups.map((g) => `${ui.group !== "none" ? `<h2 class="lib-group" id="g-${esc(g.k)}">${esc(title(g.k))} <span>${g.items.length}</span></h2>` : ""}<div class="pcards">${g.items.map(card).join("")}</div>`).join("")
        : `<p class="lib-empty">没有符合条件的论文。</p>`;
      host.querySelector('[data-k="sort"]').value = ui.sort;
      host.querySelector('[data-k="group"]').value = ui.group;
      host.querySelector('[data-k="full"]').checked = !!ui.full;
    }
    host.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.shelf) { ui.shelf = b.dataset.shelf; render(); }
      else if (b.dataset.cat) { ui.cat = b.dataset.cat; render(); }
      else if (b.dataset.year) {
        if (ui.group !== "year") { ui.group = "year"; render(); }
        const t = document.getElementById("g-" + b.dataset.year);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    host.addEventListener("input", (e) => {
      const k = e.target.dataset.k;
      if (!k) return;
      ui[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      render();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); host.querySelector('[data-k="q"]').focus(); }
    });
    render();
  }

  /* ------------------------------------------------------------------ reading page */
  function initReading() {
    const id = document.body.dataset.node;
    const st = load(id);
    const bar = document.querySelector(".read-progress i"), pct = document.querySelector(".read-pct");
    const ctl = document.querySelectorAll("[data-status]"), fav = document.querySelector("[data-fav]");
    const paint = () => {
      const s = statusOf(st);
      ctl.forEach((b) => b.classList.toggle("on", b.dataset.status === s));
      if (fav) { fav.classList.toggle("on", !!st.fav); fav.textContent = st.fav ? "★ 已收藏" : "☆ 收藏"; }
      const p = Math.round(100 * (st.progress || 0));
      if (bar) bar.style.width = (s === "done" ? 100 : p) + "%";
      if (pct) pct.textContent = s === "done" ? "已读完" : p ? `已读 ${p}%` : "未开始";
    };
    ctl.forEach((b) => b.addEventListener("click", () => { st.status = b.dataset.status; if (st.status === "unread") { st.progress = 0; st.pos = 0; } save(id, st); paint(); }));
    if (fav) fav.addEventListener("click", () => { st.fav = !st.fav; save(id, st); paint(); });
    // resume
    const resume = document.querySelector("[data-resume]");
    if (resume) {
      if (st.pos > 400 && statusOf(st) === "reading") { resume.hidden = false; resume.addEventListener("click", () => window.scrollTo({ top: st.pos, behavior: "smooth" })); }
      else resume.hidden = true;
    }
    // progress = furthest point reached between the start of the reading content (#overview, else the full text)
    // and the end of the full text — so reading only the overview + section notes still counts
    const full = document.getElementById("fulltext-body");
    const start = document.getElementById("notes") || document.getElementById("overview") || full;
    let tm = 0;
    window.addEventListener("scroll", () => {
      clearTimeout(tm);
      tm = setTimeout(() => {
        if (!full || !start) return;
        const top = start.getBoundingClientRect().top, h = (full.getBoundingClientRect().bottom - top) || 1;
        const f = Math.max(0, Math.min(1, (window.innerHeight * 0.6 - top) / h));
        if (f > (st.progress || 0)) st.progress = f;
        if (f > 0.02) st.pos = window.scrollY;
        if (f > 0.02 && (!st.status || st.status === "unread")) st.status = "reading";
        if (st.progress > 0.97 && st.status === "reading") st.status = "done";
        save(id, st); paint();
      }, 250);
    }, { passive: true });
    // bilingual blocks
    document.querySelectorAll(".bi").forEach((b) => {
      const t = b.querySelector(".bi-toggle");
      if (t) t.addEventListener("click", () => { const o = b.classList.toggle("open"); t.setAttribute("aria-expanded", o); t.textContent = o ? "收起原文" : "原文"; });
    });
    const mode = (m) => {
      document.body.classList.toggle("bilingual", m === "bi");
      document.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("on", x.dataset.mode === m));
      try { localStorage.setItem("atlas-reading-mode", m); } catch (e) { /* ignore */ }
    };
    document.querySelectorAll("[data-mode]").forEach((x) => x.addEventListener("click", () => mode(x.dataset.mode)));
    let m0 = "zh";
    try { m0 = localStorage.getItem("atlas-reading-mode") || "zh"; } catch (e) { /* ignore */ }
    mode(m0);
    paint();
  }

  function boot() {
    const kind = document.body.dataset.pageKind;
    if (kind === "library") { const h = document.getElementById("library"); if (h) renderLibrary(h); }
    if (kind === "reading") initReading();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
