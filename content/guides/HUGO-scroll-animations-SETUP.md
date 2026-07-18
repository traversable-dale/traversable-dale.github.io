# Scroll Animations Setup for Hugo Site

How to add **scroll-triggered animations** to the site — both vector Lottie
animations and canvas frame-sequence scrubbers (the pin-and-scroll "shiny cat"
effect). Built directly on the `hugo-theme-console` theme, no Hinode needed.

## 📁 Files Included

1. **`layouts/shortcodes/lottie.html`** — `{{</* lottie */>}}` shortcode (vector animations)
2. **`layouts/shortcodes/frameseq.html`** — `{{</* frameseq */>}}` shortcode (frame sequences / rendered clips)
3. **`static/js/lottie_light.min.js`** — self-hosted Lottie player (SVG, light build)
4. **`static/js/lottie-scroll.js`** — play-on-view / scrub logic for Lottie
5. **`static/js/frame-scrub.js`** — canvas frame-sequence scrubber
6. **`layouts/partials/footer.html`** — lazy-loads the scripts per page

## 🧠 First: pick the right tool

There are two very different kinds of "Lottie," and using the wrong one is what
causes flickering/garbled playback.

| Your animation is… | Use | Why |
|--------------------|-----|-----|
| **Vector** (shapes exported from After Effects via Bodymovin) | `{{</* lottie */>}}` | Small, crisp, scales infinitely |
| **A rendered clip** (3D render, video, `image2lottie` export) | `{{</* frameseq */>}}` | It's really a frame sequence — canvas draws each frame with zero flicker |

> ⚠️ **The image2lottie trap:** its **"Lottie JSON"** export is *not* a vector
> animation — it's 400+ full-frame images stacked as layers (a flipbook). The
> Lottie SVG renderer flickers badly on it. **Do not use the JSON.** Export the
> **WebP Sequence** ("high quality frames") instead and feed it to `frameseq`.

## 🚀 Vector Lottie — `{{</* lottie */>}}`

### Step 1: Export from After Effects
Use the **Bodymovin** plugin (or LottieFiles) to export a `.json`. Keep it to
shapes/transforms/opacity/masks — the light player is SVG-only, so **AE
expressions and effects won't render**.

### Step 2: Drop the file in `/static`
```
static/
└── my-anim.json
```

### Step 3: Use it in any page
```markdown
{{</* lottie src="/my-anim.json" */>}}                        <!-- play once when it scrolls into view -->
{{</* lottie src="/my-anim.json" mode="scrub" */>}}           <!-- timeline follows scroll position -->
{{</* lottie src="/my-anim.json" loop="true" height="360px" */>}}
```

**Params:** `src` (required), `mode` (`play` | `scrub`), `loop` (`true`/`false`),
`height`, `class`.

## 🐱 Frame sequence — `{{</* frameseq */>}}` (the pin-and-scroll effect)

### Step 1: Get the frames
Export a **WebP Sequence** from image2lottie (or any numbered image sequence),
named `frame_000.webp`, `frame_001.webp`, … in one folder.

### Step 2: Drop the folder in `/static`
```
static/
└── lottie/
    └── cat-frames/
        ├── frame_000.webp
        ├── frame_001.webp
        └── … (423 frames)
```

### Step 3: Use it in a page
```markdown
{{</* frameseq dir="/lottie/cat-frames" count="423" */>}}                          <!-- sticky/pinned scrub (default) -->
{{</* frameseq dir="/lottie/cat-frames" count="423" sticky="false" height="480px" */>}}  <!-- inline scrub -->
```

**Params:**

| Param | Default | Meaning |
|-------|---------|---------|
| `dir` | — (required) | Folder under `/static` holding the frames |
| `count` | — (required) | Number of frames |
| `sticky` | `true` | `true` pins the canvas full-height and scrubs as you scroll past; `false` scrubs inline |
| `track` | `300vh` | Scroll distance for a full play-through in sticky mode — **raise for slower scrub, lower for faster** |
| `height` | `70vh` | Canvas height in inline mode |
| `pad` | `3` | Zero-padding of the frame index (`frame_000`) |
| `ext` | `webp` | Frame file extension |
| `class` | — | Extra CSS classes |

## 🧪 Testing

1. Run `hugo serve -D` (the `-D` shows draft pages)
2. Open the lab page, e.g. `http://localhost:1313/lab/scroll-scrub/`
3. Scroll — the cat pins to the viewport and spins in sync with the scrollbar

The scripts only load on pages that actually use a shortcode (guarded by
`.HasShortcode` in `footer.html`), so other pages stay lightweight.

## ⚙️ Tuning the scrub feel

- **Scrub speed** → change `track` (e.g. `track="500vh"` = slower, more frames per scroll).
- **Frame quality** → re-export a higher-quality WebP Sequence and replace the folder; no code change.
- **Size** → each frame ≈ a few KB; ~400 frames ≈ 3 MB total. Keep clips short.

## 📱 Mobile notes

- The canvas is high-DPI aware (`devicePixelRatio`), so it stays sharp on Retina/phones.
- Sticky scrubbing works on iOS/Android Safari & Chrome.
- ~400 frames = ~3 MB of downloads; fine on Wi-Fi, heavier on cellular. For a
  hero animation, keep the frame count modest and the clip short.

## 🐛 Troubleshooting

### Flickering / garbled frames
You're feeding an `image2lottie` **JSON flipbook** to the Lottie SVG player.
Switch to `{{</* frameseq */>}}` with a WebP Sequence instead.

### Animation doesn't show up on the live site
Check the page isn't `draft: true` — the GitHub Actions build runs `hugo --minify`
**without** `-D`, so drafts are excluded from production.

### Canvas is blank
- Confirm the frames return `200` (Network tab) at `/lottie/<dir>/frame_000.webp`.
- Confirm `count` matches the actual number of files and `pad` matches the padding.

### Nothing loads at all
- Check the browser console for errors.
- Verify `frame-scrub.js` / `lottie-scroll.js` is present in the page (it's only
  injected when the matching shortcode is used).

## 🔧 Hugo Theme Compatibility

Built for the `hugo-theme-console` theme. The scripts are injected via the
overridable `layouts/partials/footer.html`. If you change themes, make sure the
footer (or an equivalent end-of-`<body>` hook) still renders.

Enjoy the scroll! 🐱✨
