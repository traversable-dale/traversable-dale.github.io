---
title: "Lottie, Frame Sequences, and a TouchDesigner Exporter"
date: 2026-07-18
draft: false
summary: "Evaluating Lottie as an export format for TouchDesigner output"
resource_group: "research"
tags: ["lottie", "frame-sequence", "touchdesigner", "webp", "animation", "research", "performance"]
---

**Date:** 2026-07-18
**Context:** Investigating how to export scroll-animation assets from TouchDesigner
for this Hugo site, after prototyping the `{{</* lottie */>}}` and `{{</* frameseq */>}}`
shortcodes.

**Outcome:** Lottie is the wrong target for TD output. Build a frame-sequence
exporter instead. The conversion script — not the TD capture — is the part that
carries the value.

---

## 1. What Lottie actually is

A JSON scene graph, originally the Bodymovin export format from After Effects.

```
layers[] → each layer has:
  ks:       transform (position, scale, rotation, opacity) — keyframed
  shapes[]: bezier paths, fills, strokes, gradients, trim paths
  masks, track mattes, parenting, precomps
```

Two properties define it:

- **Vector.** Paths are 2D cubic beziers stored as vertex arrays with in/out
  tangent pairs. Resolution-independent, tiny file size.
- **Sparsely keyframed.** Animation is `{t, s, i/o}` keyframes with easing
  curves, not per-frame samples. A 10-second animation might be 8 keyframes.
  The renderer interpolates at display framerate.

## 2. What the various "Lottie converters" are doing

Three different operations all marketed as conversion:

| Tool | What it does | Result |
|---|---|---|
| **Bodymovin (AE → Lottie)** | Real transcoding. AE shape layers already *are* keyframed vector beziers; Lottie is nearly the same model serialized. | Near 1:1. Works well. |
| **image2lottie / png2lottie / gif2lottie** | Not converting. Wraps each raster frame in an image layer and base64-embeds it. | A ZIP-with-a-manifest in a Lottie costume. **This is the flicker case.** |
| **Raster tracing (potrace, vectorizers)** | Genuine raster→vector. | Works on flat logos/line art. Fails on photographic, gradient, or 3D content. |

**Why frame-by-frame tracing can't work even in principle:** tracing each frame
independently produces no temporal coherence. Frame 5's paths have no
correspondence to frame 6's — different vertex counts, different topology — so
there is nothing to keyframe between. The output is a *vector* flipbook: N
discrete path sets, larger and slower than the raster flipbook it replaced.

## 3. Why TouchDesigner can't export Lottie

The accurate statement is not "it's impossible" — it's **"nothing you'd want to
render in TD has a vector representation to export."** The barrier is which data
you start from, plus economics. Not physics.

TD holds two very different kinds of data:

- **TOPs are pixels.** Rasterization is one-way. No vector to recover. This is
  where "can't" is genuinely true, and it's where all our output lives.
- **SOPs and CHOPs are not.** A Bezier SOP has real control points. CHOP channels
  *are* keyframe data. That is the raw material Lottie is made of.

So a **SOP + CHOP → Lottie exporter is writable.** No one appears to have shipped
a good one, but it's a real project, not a contradiction. Friction is ordinary
engineering:

- SOP curves are 3D, Lottie is flat — everything goes through a camera projection
- Lottie's paint model is painter's-algorithm 2D: no lighting, no depth sort, no
  textures; gradients limited to linear/radial
- CHOPs give per-frame samples; Lottie wants sparse keyframes with easing. Baking
  one keyframe per frame works but bloats
- Bezier tangent conventions and normalization differ enough to be fiddly

**Why it's still not worth building:** what survives that pipeline is flat 2D
vector animation driven by curve geometry — and for *that*, After Effects, Rive,
and Figma are all better authoring tools with native Lottie export. The exporter
would be substantial work to make TD mediocre at something others do well, while
doing nothing for what TD is actually good at (rendered, shaded, generative,
particle, 3D).

### The key equivalence

A PNG-sequence-to-Lottie and a raw frame sequence **are the same content.** The
Lottie wrapper adds a JSON envelope, ~33% base64 inflation, and an N-layer scene
graph the SVG renderer walks every tick. The frame sequence is that payload with
the wrapper removed. Nothing is lost, because there was never vector data in a
TD render to lose.

---

## 4. The animation landscape — scrubbed vs. played

| Approach | Best for | Cost |
|---|---|---|
| **Vector Lottie** | UI motion, icons, logos | Tiny; requires vector authoring — TD can't feed it |
| **Frame sequence + canvas** | Scroll-**scrubbed** rendered clips | Frame-exact, no flicker; heavy payload, all-frames preload |
| **Video (webm/mp4)** | **Play**-on-view, longer clips | 10–50× smaller than frames; scrubbing unreliable |
| **WebGL / shader** | Interactive, infinite | Real-time, no payload; separate authoring path |

Video looks like the obvious win until you try to scrub it — browsers won't seek
frame-accurately and iOS adds restrictions. **That limitation is the entire reason
scrollytelling uses frame sequences.**

Conclusion: for scroll-scrubbed TD output, the frame sequence is correct and there
is no better option. For play-on-view animation not tied to scroll position, WebM
is dramatically cheaper — and Movie File Out writes it natively with no conversion
step. Hence a two-mode exporter.

---

## 5. What's already built on the Hugo site

- **`{{</* lottie */>}}`** — `layouts/shortcodes/lottie.html` + `static/js/lottie-scroll.js`
  + self-hosted `static/js/lottie_light.min.js`. For **vector** Lottie only
  (AE/Bodymovin origin). Modes: play-on-view / scrub / loop.
- **`{{</* frameseq */>}}`** — `layouts/shortcodes/frameseq.html` +
  `static/js/frame-scrub.js`. Sticky 300vh track, canvas pinned at 100vh, scroll
  position → frame index, `requestAnimationFrame`-throttled, letterboxed to
  preserve aspect. Live test at `content/lab/scroll-scrub.md`.

Scripts load lazily from `layouts/partials/footer.html` via `.HasShortcode`.

### Constraint the exporter must respect

`static/js/frame-scrub.js` (lines 49–60) **preloads every frame eagerly** on page
load. At 2.9 MB that's fine. At 4K, or 900 frames, it is not. Output resolution ×
frame count is a budget — the exporter should enforce and report it. That is the
most valuable thing it can do beyond automating file shuffling.

---

## 6. Findings from the actual TD export

Source: a network export of the project's `moviefile_out` node, writing a PNG
image sequence to a local scratch folder outside the site repo. Paths below are
referred to as `<export-dir>`; substitute your own.

### Capture is native — no scripting required

```json
"type": "imagesequence",
"imagefiletype": "png"
```

Movie File Out writes image sequences natively. Frame numbering comes from the
file parameter expression:

```python
'/…/Test-1.png' + 'TDout' + me.fileSuffix
```

`me.fileSuffix` appends the per-frame index. **The capture half of the component
is parameter wiring, not code.**

### Gotcha 1 — the fps expression is dormant

```json
"fps": { "val": 30.0, "expr": "me.time.rate", "mode": "CONSTANT" }
```

The expression is written but mode is `CONSTANT`, so it is inert — hardcoded to
30 regardless of timeline rate. If tracking `me.time.rate` was the intent, mode
must be `EXPRESSION`. Decide deliberately either way: **fps has to land in the
manifest** for the scrubber to know playback duration.

### Gotcha 2 — filenames are not zero-padded

```
Test-1.pngTDout.0.0.png
Test-1.pngTDout.0.1.png
Test-1.pngTDout.0.10.png
Test-1.pngTDout.0.100.png
```

That's `me.fileSuffix`'s native form, and it's a trap:

- **Lexical sort scrambles frame order** — 1, 10, 100, 101… before 2. The
  conversion script must parse the trailing integer and sort **numerically**.
  Never `sorted(glob(...))`.
- `frame-scrub.js` (lines 40–44) builds URLs as `frame_%03d.webp`, so
  **renumbering to a padded scheme is mandatory**, not cosmetic.

This is the most likely source of a silent, baffling bug in this pipeline.

### The number that justifies the component

Same 423 frames, same 1280×720, both on disk as of 2026-07-18:

| Location | Format | Size |
|---|---|---|
| `<export-dir>/` (raw TD output) | PNG | **288 MB** |
| `static/lottie/cat-frames/` | WebP | **2.9 MB** |

~99% reduction, ~6.6 KB/frame, visually equivalent. The conversion step is not a
convenience wrapper around the native export — **it is what makes the output
shippable at all.** 288 MB of PNG is not a website.

### What this reveals about the current pipeline

Frame counts and dimensions match exactly, and an `image2lottie` animation JSON
is present in the scratch folder — so the path that produced the cat frames was:

```
TD → 423 PNG → image2lottie → WebP sequence → Hugo
```

**image2lottie is currently in the pipeline as a WebP converter** — routing
through a tool whose actual output was rejected, to reach a byproduct we can
produce directly.

Target:

```
TD → 423 PNG → convert script → padded WebP + manifest → Hugo
```

Same destination, one fewer third-party dependency. And the manifest (count, fps,
dimensions) stops being hand-transcribed: `count="423"` is currently typed by hand
into the shortcode and **silently breaks if a re-render changes the frame count.**

---

## 7. Proposed component — `frameseq_exporter`

Two output modes behind one capture front-end:

- **`frames`** — PNG capture → WebP conversion → padded rename → manifest, for
  `{{</* frameseq */>}}`. Scroll-scrubbed.
- **`video`** — Movie File Out writes WebM directly, no conversion step. Needs a
  small play-on-view shortcode that does not exist yet.

Same status parameters and capture wiring for both.

### TouchDesigner patterns to reuse

Four patterns from prior recorder work carry over directly:

- **Recorder extension** — an idempotent `SetupParameters()` guarded on
  `customPages` so re-initialization is safe; an explicit `OpenFile` /
  `CloseFile` / `Pause` / `Resume` lifecycle; a re-attach step so the extension
  survives `reinitextensions` mid-session; and fire-and-forget
  `subprocess.Popen` post-processing. That last one is the direct model for
  kicking off WebP conversion without blocking the cook.
- **Movie File Out driver** — push resolved paths onto `movie_out.par.file`,
  toggle `.par.record` / `.par.pause`, and read an **Info CHOP** for
  `total_frames_written`. Document the required network setup in the module
  docstring; the wiring is not discoverable from the code alone.
- **Parameter Execute DAT** — `onPulse` forwards to a single `OnPulse(par)`
  dispatch for Record/Play/Convert pulses; `onValueChange` re-reads movie info
  when the file selection changes.
- **CHOP Execute DAT** — `onOffToOn` fires conversion off `total_frames_written`
  or a timer's `done` channel. Use the `run('…', fromOP=me, delayFrames=1)`
  idiom — **required here**, since a recording cannot be stopped from inside its
  own cook.
- Read-only status params via `par.readOnly = True`, fed by an Info CHOP on the
  source movie.

### Build order

1. **Conversion script first** — numeric sort, renumber to `frame_%03d`, WebP
   encode, write manifest. Testable immediately against the existing 288 MB
   `Test-1/` folder. This is the piece with real logic.
2. **Extension wrapper second** — mostly parameter plumbing on top.

### Open items

- Confirm whether Movie File Out can write WebP directly (it reads WebP; writing
  is believed unsupported, which is *why* the conversion script exists). Verify
  before designing around it.
- Decide the fps `CONSTANT` vs `EXPRESSION` question above.
- Define the resolution × frame-count budget the exporter enforces.
- `{{</* frameseq */>}}` should read the manifest rather than take a hand-typed
  `count`.
