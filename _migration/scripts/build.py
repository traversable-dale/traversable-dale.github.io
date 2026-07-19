#!/usr/bin/env python3
"""Turn extracted.json into per-project markdown + a master CSV."""
import json, csv, os, re

OUT = "/Users/tdt-mba1/Documents/GIT/traversable-dale.github.io/_migration"
os.makedirs(os.path.join(OUT, "projects"), exist_ok=True)

d = json.load(open("extracted.json"))

# chrome that repeats on every page
CHROME_URLS = {
    "https://www.johnsyzonenko.com/projects",
    "https://www.johnsyzonenko.com/about",
    "https://www.johnsyzonenko.com/contact",
    "https://www.johnsyzonenko.com/",
    "https://www.linkedin.com/in/john-syzonenko/",
    "https://www.instagram.com/traversable_dale",
    "https://github.com/traversable-dale",
}
NAV_HEAD = ["Work", "ABOUT", "JOHN SYZONENKO"]
FOOT_MARK = "ContactAboutWork"

PROJECT_SLUGS = [k for k in d if k.startswith("project")and k != "projects"]

FIELD_RE = re.compile(
    r"^(Role|Client|Associated|Team|Location|Date|Credits?|Agency|Venue)\s*:\s*(.*)$", re.I)


def clean(text):
    """Strip leading nav and trailing footer; return body lines."""
    lines = [l.strip("‍ \xa0") for l in text.split("\n")]
    lines = [l for l in lines if l.strip()]
    while lines and lines[0] in NAV_HEAD:
        lines.pop(0)
    for i, l in enumerate(lines):
        if l.startswith(FOOT_MARK):
            lines = lines[:i]
            break
    return lines


rows = []
for slug in PROJECT_SLUGS:
    page = d[slug]
    lines = clean(page["text"])
    title = lines[0] if lines else slug

    meta, body, tags = {}, [], []
    for l in lines[1:]:
        m = FIELD_RE.match(l)
        if m:
            meta[m.group(1).capitalize()] = m.group(2).strip()
        else:
            body.append(l)

    # body links = everything that isn't site chrome or a dead "#" anchor
    body_links, dead_tags = [], []
    for l in page["links"]:
        u, t = l["url"], l["text"].strip("‍ \xa0")
        if u in CHROME_URLS:
            continue
        if u.endswith("/#"):
            if t:
                dead_tags.append(t)
            continue
        body_links.append((t or "(no anchor text)", u))

    # write markdown
    md = [f"# {title}", "", f"Source: {page['url']}", ""]
    if meta:
        md.append("## Metadata")
        md += [f"- **{k}:** {v}" for k, v in meta.items()]
        md.append("")
    md.append("## Body copy (verbatim)")
    md.append("")
    md += body
    md.append("")
    if dead_tags:
        md.append("## Tag chips (link to # on live site)")
        md.append(", ".join(dead_tags))
        md.append("")
    if body_links:
        md.append("## Hyperlinks")
        md += [f"- [{t}]({u})" for t, u in body_links]
        md.append("")
    if page["images"]:
        md.append("## Inline images found in HTML")
        md += [f"- {i['src']}" + (f" — alt: {i['alt']}" if i["alt"] else "")
               for i in page["images"]]
        md.append("")

    fn = slug.replace("project---", "").replace("project-", "")
    with open(os.path.join(OUT, "projects", fn + ".md"), "w") as f:
        f.write("\n".join(md))

    rows.append({
        "title": title,
        "slug": fn,
        "source_url": page["url"],
        "role": meta.get("Role", ""),
        "client": meta.get("Client", ""),
        "associated": meta.get("Associated", ""),
        "team": meta.get("Team", ""),
        "location": meta.get("Location", ""),
        "date": meta.get("Date", ""),
        "body_text": "\n\n".join(body),
        "tags": "; ".join(dead_tags),
        "hyperlinks": " | ".join(f"{t} -> {u}" for t, u in body_links),
        "inline_images": " | ".join(i["src"] for i in page["images"]),
        "markdown_file": f"_migration/projects/{fn}.md",
    })

rows.sort(key=lambda r: r["title"].lower())
cols = list(rows[0].keys())
with open(os.path.join(OUT, "projects-full.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(rows)

# non-project pages kept as plain markdown too
for slug in ("projects", "about", "contact", "home"):
    page = d[slug]
    lines = clean(page["text"])
    md = [f"# {slug}", "", f"Source: {page['url']}", "", "## Body copy (verbatim)", ""]
    md += lines
    md += ["", "## Hyperlinks"]
    md += [f"- [{l['text'].strip() or '(no anchor text)'}]({l['url']})"
           for l in page["links"]]
    with open(os.path.join(OUT, f"{slug}.md"), "w") as f:
        f.write("\n".join(md))

print(f"{len(rows)} projects -> {OUT}/projects-full.csv")
for r in rows:
    print(f"  {r['slug']:24s} body={len(r['body_text']):5d}  links={r['hyperlinks'].count('->'):3d}")
