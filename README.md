# My Website!!!

### WARNING :warning: WORK IN PROGRESS

Welcome to my simple portfolio website made with Hugo and GitHub Pages. I am in the process of migrating all of my content over from my [webflow](https://www.johnsyzonenko.com) site.

Source and Console Theme: <br>
https://github.com/gohugoio/hugo <br>
https://github.com/mrmierzejewski/hugo-theme-console/?tab=readme-ov-file <br>

If you'd like to make your own, the comprehensive startup guide is published at
[/guides/hhugo_github_pages_complete_guide/](https://traversable-dale.github.io/guides/hhugo_github_pages_complete_guide/).

Check out the WIP site [here](https://traversable-dale.github.io/) <br>

### {Testing...}

**Prerequisite:** Hugo (extended). On macOS: `brew install hugo`. If the theme
folder is empty after cloning, restore it with `git submodule update --init --recursive`.

To launch and test locally, follow the startup guide and:


``` hugo serve -D ```

The `-D` flag renders draft pages. Publishing is automatic: pushing to `main`
triggers the GitHub Actions workflow (`hugo --minify`, drafts excluded) which
deploys to GitHub Pages.

### {Scroll animations}

The site supports scroll-triggered animations via two shortcodes:

- `{{</* lottie src="/anim.json" mode="scrub" */>}}` — vector Lottie animations
- `{{</* frameseq dir="/lottie/cat-frames" count="423" */>}}` — canvas frame-sequence
  scrubber (the pin-and-scroll effect, ideal for rendered clips / `image2lottie`
  WebP sequences)

See [`content/guides/HUGO-scroll-animations-SETUP.md`](content/guides/HUGO-scroll-animations-SETUP.md)
for the full guide. Live test page: `/lab/scroll-scrub/`.

### {Resources section}

`/resources/` generates itself from page metadata — there is no index to edit by
hand. To add a resource, create a file in `content/guides/`, `content/notes/`, or
`content/lab/` with this front matter:

```yaml
---
title: "Scroll Animations Setup"
date: 2026-07-18
draft: false
summary: "One sentence. Shown on the Resources index."
resource_group: "hugo"     # hugo | system | research | experiment
tags: ["hugo", "lottie", "canvas"]
---
```

**Do not put an `# H1` in the body.** The theme renders `title` as the page
heading, so a body H1 produces two. Start the body at `##`.

Rules of thumb:

- **Groups** are defined in [`data/resource_groups.yaml`](data/resource_groups.yaml).
  Add a group there to make it render.
- **Keywords** come from the controlled vocabulary in
  [`data/keywords.yaml`](data/keywords.yaml). Add new terms *there first*, then
  use them. Terms are lowercase and hyphenated — do not invent variants
  (`hugo`, not `Hugo` or `hugo-site`).
- **Validation runs at build time.** An unlisted tag, a missing tag, or an
  unknown `resource_group` each raise a `WARN`. Run `hugo` and read the output —
  note that `hugo --quiet` suppresses warnings.
- `archetypes/default.md` scaffolds all of the above via `hugo new`.

The keyword pool at `/lab/keywords/` and the collapsed one on `/resources/` are
the same component ([`layouts/partials/keyword-pool.html`](layouts/partials/keyword-pool.html)),
filtering identical markup from
[`layouts/partials/resource-groups.html`](layouts/partials/resource-groups.html).
