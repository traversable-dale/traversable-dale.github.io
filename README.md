# My Website!!!

### WARNING :warning: WORK IN PROGRESS

Welcome to my simple portfolio website made with Hugo and GitHub Pages. I am in the process of migrating all of my content over from my [webflow](https://www.johnsyzonenko.com) site.

Source and Console Theme: <br>
https://github.com/gohugoio/hugo <br>
https://github.com/mrmierzejewski/hugo-theme-console/?tab=readme-ov-file <br>

If you'd like to make your own, file templates and the comprehensive startup guide are available in ```/ref```

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
