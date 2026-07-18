---
title: "Scroll Scrub"
date: 2026-07-18
draft: false
---

## Shiny Cat — Scroll Scrub

A canvas frame-sequence scrubber (423 frames). As you scroll, the cat is pinned
to the viewport and its rotation scrubs in sync with the scrollbar — sharp, and
no flicker. This is the right technique for a rendered clip like this (not a
Lottie flipbook).

Scroll down to reach the cat, then keep scrolling to spin it.

<div style="height:60vh"></div>

{{< frameseq dir="/lottie/cat-frames" count="423" >}}

<div style="height:40vh; display:flex; align-items:center; justify-content:center;">
  <em>&darr; that was sticky/pinned scrubbing &mdash; below is inline mode &darr;</em>
</div>

### Inline mode (scrubs as the box crosses the viewport)

{{< frameseq dir="/lottie/cat-frames" count="423" sticky="false" height="420px" >}}

<div style="height:60vh"></div>
