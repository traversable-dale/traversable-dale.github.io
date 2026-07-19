# Migration source data — johnsyzonenko.com → Hugo

Scraped content from the old Webflow portfolio at `https://www.johnsyzonenko.com`,
staged for porting into this Hugo site. Captured **2026-07-19**.

This directory is **source material, not site content.** Nothing here is built by
Hugo. Port from it into `content/projects/`, then leave these files alone as a
reference for what the original said.

---

## What's here

| Path | What it is |
|---|---|
| `projects-full.csv` | 17 projects that had real detail pages. Full verbatim body text + all links. The planning view. |
| `projects/*.md` | Same 17 projects, one file each. **Paste from these**, not the CSV. |
| `projects-index-only.csv` | 15 entries that exist only as rows on `/projects` — music videos, short films. No detail page, so title/client/role only. |
| `about.md`, `home.md`, `contact.md`, `projects.md` | Non-project pages, same treatment. |
| `scripts/` | The scrapers. See "Re-running" below. |

### Why both a CSV and markdown files

Same data, two shapes. Full body copy is unpleasant in a spreadsheet cell —
`inter-nyc` alone is ~9,800 characters and 99 links. Use the CSV to plan and
sort across projects; use the markdown when actually writing a page.

### `projects-full.csv` columns

`title`, `slug`, `source_url`, `role`, `client`, `associated`, `team`,
`location`, `date`, `body_text`, `tags`, `hyperlinks`, `inline_images`,
`markdown_file`

- `hyperlinks` — pipe-separated `anchor text -> url`
- `tags` — the tech chips from the old page (see caveat below)
- `markdown_file` — path to the fuller version of the same row

---

## Known problems in the source data

Read this before porting anything. These are defects **on the live site**, not
scrape artifacts — the scrape is faithful to what's published.

### 1. Wrong client links (fix during migration)

Three projects link a client's name to Dave Tennent's site, all carrying the
same Facebook `fbclid` tracking parameter — a URL pasted from a Facebook
referral and reused across CMS entries.

| Project | Anchor text | Currently points to | Should point to |
|---|---|---|---|
| Camata | Pierre Huyghe Studio | `studiodave.io/?fbclid=…` | **TODO — verify** |
| XRPL Apex 2025 | Invisible North | `studiodave.io/?fbclid=…` | **TODO — verify** |
| Elementa | Moustrappe Media | `studiodave.io/?fbclid=…` | **TODO — verify** |

Kodansha House also links there, but correctly — Dave Tennent is the actual
credit on that one.

The correct destinations were not researched, so they are left as TODO rather
than guessed. Strip the `fbclid` parameter from anything carried over.

### 2. Tag chips have no destinations

Every tech tag (TouchDesigner, Arduino, …) links to `/#` on the old site. They
were captured into the `tags` column as plain strings. Good raw material for a
real Hugo taxonomy.

### 3. Metadata labels are inconsistent

9 of 17 pages have no `Client:` line; 8 have no `Date:`. Those pages word their
labels differently — Blue Paradox, for instance, puts the museum under
`Location:` and has no client field at all. **Empty cells mean "the page didn't
say," not "unknown."** The information is usually sitting in the body text.

### 4. Stale `<title>` tags

The Camata page's `<title>` reads "Project - Elementa." Meta titles were ignored
throughout; titles come from the page H1.

### 5. Blue Paradox client is ambiguous

The homepage card credits Radical Media; the detail page credits the Museum of
Science and Industry, Chicago. Unresolved — confirm before publishing. ("Griffin
Museum of Science and Industry" is the same institution; Griffin is the
naming-rights sponsor.)

### 6. No images

Webflow loads project imagery client-side, so no asset URLs appear in the HTML —
only site logos. The `inline_images` column is near-empty and that is expected,
not a scrape failure. Images need gathering per project; local originals beat
the Webflow-compressed CDN copies.

---

## Re-running the scrape

```bash
cd _migration/scripts
python3 extract.py     # curls all pages → raw/*.html + extracted.json
python3 build.py       # extracted.json → ../projects/*.md + ../projects-full.csv
```

Stdlib only, no dependencies. `extract.py` caches raw HTML in `raw/` and skips
anything already downloaded — **delete `raw/` to force a refetch.**

`build.py` writes to an absolute path (`OUT` at the top of the file) and will
overwrite existing output. Edit that constant if the repo moves.

Squarespace/Webflow markup shifts over time. If output suddenly looks thin,
check the chrome filters in `build.py` — `CHROME_URLS`, `NAV_HEAD`, `FOOT_MARK`
strip the repeated nav and footer, and they're matched literally.

---

## Migration status

Nothing has been ported yet. `content/projects/camata.md` predates this scrape
and was written by hand — reconcile it against `projects/camata.md` rather than
assuming either is authoritative.

Open questions for whoever picks this up:

- The old homepage surfaced only 7 of 32 projects. Does the new site mirror that
  restraint or promote more of the back catalogue?
- Should the 15 index-only entries (music videos, films) become real pages, a
  simple link list, or get dropped?
