"""Parse an arXiv (LaTeXML) HTML paper into ordered blocks for translation.

Usage: python scripts/arxiv_blocks.py <arxiv.html> <blocks.json>   (download https://arxiv.org/html/<id> first)
Blocks: {"t": "h", "lvl": 2|3|4, "num": "4.1", "en": "title", "id": "S4.SS1"}
        {"t": "p", "id": "S4.SS1.p2", "en": "paragraph with \\(math\\), <em>, [12]"}
        {"t": "li", "id": ..., "en": ...}             (list items, rendered as bullets)
        {"t": "eq", "id": ..., "tex": "..."}           (display equations)
        {"t": "fig", "id": "S1.F1", "srcs": [...], "cap": "caption text"}
        {"t": "table", "id": "S6.T1", "html": "<table>…</table>", "cap": "caption"}
Stdlib only.
"""
import html, json, re, sys
from html.parser import HTMLParser

VOID = {"img", "br", "hr", "meta", "link", "input", "col", "source", "wbr"}


class Node:
    __slots__ = ("tag", "attrs", "kids", "parent")

    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.kids, self.parent = tag, dict(attrs), [], parent

    def cls(self):
        return self.attrs.get("class", "") or ""


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root", [], None)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.kids.append(data)


def find(n, pred):
    out = []
    for k in n.kids:
        if isinstance(k, Node):
            if pred(k):
                out.append(k)
            out += find(k, pred)
    return out


def text_of(n):
    return "".join(k if isinstance(k, str) else text_of(k) for k in n.kids)


def inline(n):
    """Inner content → light HTML: math as \\(..\\), em/strong/code kept, citations as text, notes dropped."""
    parts = []
    for k in n.kids:
        if isinstance(k, str):
            parts.append(html.escape(k, quote=False))
            continue
        c = k.cls()
        if k.tag == "math":
            tex = k.attrs.get("alttext", text_of(k)).strip()
            parts.append(("$$" + tex + "$$") if k.attrs.get("display") == "block" else ("\\(" + tex + "\\)"))
        elif "ltx_note" in c:          # footnotes: keep their text in parentheses
            mark = find(k, lambda x: "ltx_note_content" in x.cls())
            if mark:
                body = inline(mark[0])
                body = re.sub(r"^\s*<sup>[^<]*</sup>\s*", "", body)
                parts.append(f"<span class=\"fn\">（注：{body.strip()}）</span>")
        elif k.tag == "cite":
            parts.append(html.escape(re.sub(r"\s+", " ", text_of(k)).strip(), quote=False))
        elif k.tag in ("em", "i") or "ltx_font_italic" in c:
            parts.append("<em>" + inline(k) + "</em>")
        elif k.tag in ("b", "strong") or "ltx_font_bold" in c:
            parts.append("<strong>" + inline(k) + "</strong>")
        elif "ltx_font_typewriter" in c or k.tag == "code":
            parts.append("<code>" + inline(k) + "</code>")
        elif k.tag == "a" and "ltx_ref" in c:
            parts.append(inline(k))
        elif k.tag == "br":
            parts.append(" ")
        else:
            parts.append(inline(k))
    out = "".join(parts)
    return re.sub(r"[ \t\r\n]+", " ", out).strip()


def main(src, dst):
    b = Builder()
    b.feed(open(src, encoding="utf-8").read())
    art = find(b.root, lambda x: x.tag == "article" and "ltx_document" in x.cls())[0]
    blocks = []

    def caption(fig):
        caps = [k for k in fig.kids if isinstance(k, Node) and k.tag == "figcaption"]
        return inline(caps[0]) if caps else ""

    def walk(n):
        for k in n.kids:
            if not isinstance(k, Node):
                continue
            c, kid = k.cls(), k.attrs.get("id", "")
            if k.tag in ("h1", "h2", "h3", "h4", "h5", "h6") and "ltx_title" in c:
                if "ltx_title_document" in c:
                    continue
                tag = find(k, lambda x: "ltx_tag" in x.cls())
                num = text_of(tag[0]).strip().rstrip(".") if tag else ""
                for t in tag:
                    t.kids = []
                title = inline(k).strip()
                lvl = 2 if "ltx_title_section" in c or "ltx_title_abstract" in c else 3 if "ltx_title_subsection" in c else 4
                blocks.append({"t": "h", "lvl": lvl, "num": num, "en": title, "id": (k.parent.attrs.get("id") or "")})
            elif k.tag == "figure" and ("ltx_figure" in c) and "ltx_figure_panel" not in c:
                srcs = [x.attrs.get("data") or x.attrs.get("src") for x in find(k, lambda x: x.tag in ("object", "img") and "ltx_graphics" in x.cls())]
                blocks.append({"t": "fig", "id": kid, "srcs": srcs, "cap": caption(k)})
            elif (k.tag == "figure" and "ltx_table" in c) or (k.tag == "div" and "ltx_table" in c):
                tables = find(k, lambda x: x.tag == "table")
                blocks.append({"t": "table", "id": kid, "cap": caption(k), "rows": [
                    [inline(td) for td in find(tr, lambda x: x.tag in ("td", "th"))] for tr in find(tables[0], lambda x: x.tag == "tr")] if tables else []})
            elif k.tag == "table" and "ltx_equation" in c:
                maths = find(k, lambda x: x.tag == "math")
                if maths:
                    blocks.append({"t": "eq", "id": kid, "tex": maths[0].attrs.get("alttext", "").strip()})
            elif "ltx_para" in c:
                # a paragraph may contain several ltx_p, lists, and equations, in order
                for x in k.kids:
                    if not isinstance(x, Node):
                        continue
                    xc = x.cls()
                    if "ltx_p" in xc.split():
                        t = inline(x)
                        if t:
                            blocks.append({"t": "p", "id": x.attrs.get("id") or kid, "en": t})
                    elif "ltx_itemize" in xc or "ltx_enumerate" in xc:
                        for li in [y for y in x.kids if isinstance(y, Node) and y.tag == "li"]:
                            ps = find(li, lambda y: "ltx_p" in y.cls().split())
                            t = " ".join(inline(p) for p in ps)
                            if t:
                                blocks.append({"t": "li", "id": li.attrs.get("id", ""), "en": t})
                    elif x.tag == "table" and "ltx_equation" in xc:
                        maths = find(x, lambda y: y.tag == "math")
                        if maths:
                            blocks.append({"t": "eq", "id": x.attrs.get("id", ""), "tex": maths[0].attrs.get("alttext", "").strip()})
                    elif x.tag == "figure":
                        walk(Node("wrap", [], None)) if False else walk_one(x)
            elif k.tag == "p" and "ltx_p" in c.split():          # bare paragraph, e.g. directly inside the abstract
                t = inline(k)
                if t:
                    blocks.append({"t": "p", "id": kid, "en": t})
            elif "ltx_abstract" in c or "ltx_section" in c or "ltx_subsection" in c or "ltx_subsubsection" in c or "ltx_paragraph" in c:
                walk(k)
            elif "ltx_bibliography" in c or "ltx_appendix" in c:
                continue
            elif k.tag in ("div", "section"):
                walk(k)

    def walk_one(x):
        holder = Node("holder", [], None)
        holder.kids = [x]
        walk(holder)

    walk(art)
    json.dump(blocks, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    kinds = {}
    for bl in blocks:
        kinds[bl["t"]] = kinds.get(bl["t"], 0) + 1
    print(kinds, sum(len(bl.get("en", "")) for bl in blocks), "chars")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
