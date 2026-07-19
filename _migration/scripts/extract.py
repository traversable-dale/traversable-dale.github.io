#!/usr/bin/env python3
"""Extract visible text + hyperlinks from johnsyzonenko.com project pages."""
import re, os, json, html, subprocess, sys
from html.parser import HTMLParser

SLUGS = [
    "project---xrpl-apex-2025", "project---camata", "project---goethe-institut",
    "project---kodansha-house", "project---fantastic-flora", "project---elementa",
    "project---blue-paradox", "project---miro", "project---ion-media",
    "project-inter-nyc", "project-nike-air-soho", "project-ledger",
    "project-diesel", "project-shaker-mountain", "project-thought-patterns",
    "project-yo-yo-ma", "project-incarceration-nations",
    "projects", "about", "contact", "",
]
BASE = "https://www.johnsyzonenko.com/"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
RAW = "raw"; os.makedirs(RAW, exist_ok=True)

SKIP = {"script", "style", "noscript", "head", "svg"}
BLOCK = {"p","div","h1","h2","h3","h4","h5","h6","li","br","tr","section","header","footer","blockquote"}


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []          # visible text pieces
        self.links = []        # (anchor_text, href)
        self.imgs = []         # (src, alt)
        self.skip_depth = 0
        self.a_stack = []      # open <a> hrefs, collecting text

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in SKIP:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag == "a":
            self.a_stack.append([a.get("href", ""), []])
        elif tag == "img":
            src = a.get("src", "")
            if src:
                self.imgs.append((src, a.get("alt", "")))
        elif tag in ("video", "source", "iframe"):
            src = a.get("src", "")
            if src:
                self.links.append(("[embed:%s]" % tag, src))
        if tag in BLOCK:
            self.out.append("\n")

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth:
            return
        if tag == "a" and self.a_stack:
            href, txt = self.a_stack.pop()
            self.links.append(("".join(txt).strip(), href))
        if tag in BLOCK:
            self.out.append("\n")

    def handle_data(self, data):
        if self.skip_depth:
            return
        if not data.strip():
            return
        self.out.append(data)
        for fr in self.a_stack:
            fr[1].append(data)

    def text(self):
        t = "".join(self.out)
        t = re.sub(r"[ \t ]+", " ", t)
        t = re.sub(r" *\n *", "\n", t)
        t = re.sub(r"\n{3,}", "\n\n", t)
        return t.strip()


def absolutize(u):
    if not u:
        return ""
    if u.startswith(("http://", "https://", "mailto:", "tel:")):
        return u
    return BASE.rstrip("/") + "/" + u.lstrip("/")


results = {}
for slug in SLUGS:
    url = BASE + slug
    path = os.path.join(RAW, (slug or "home") + ".html")
    if not os.path.exists(path):
        subprocess.run(["curl", "-sL", "-A", UA, url, "-o", path], check=True)
    raw = open(path, encoding="utf-8", errors="replace").read()
    p = Extract()
    p.feed(raw)

    # dedupe links, preserve order, drop pure-nav duplicates later
    seen, links = set(), []
    for txt, href in p.links:
        h = absolutize(href)
        if not h or (txt, h) in seen:
            continue
        seen.add((txt, h))
        links.append({"text": txt, "url": h})
    seen_i, imgs = set(), []
    for src, alt in p.imgs:
        s = absolutize(src)
        if s in seen_i:
            continue
        seen_i.add(s)
        imgs.append({"src": s, "alt": alt})

    title = ""
    m = re.search(r"<title>(.*?)</title>", raw, re.S)
    if m:
        title = html.unescape(m.group(1)).strip()

    results[slug or "home"] = {
        "slug": slug or "home", "url": url, "meta_title": title,
        "text": p.text(), "links": links, "images": imgs,
    }
    print(f"{slug or 'home':35s} text={len(p.text()):6d}  links={len(links):3d}  imgs={len(imgs):3d}")

json.dump(results, open("extracted.json", "w"), indent=2)
print("\nwrote extracted.json")
