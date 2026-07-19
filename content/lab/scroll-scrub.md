---
title: "Scroll Scrub"
date: 2026-07-18
draft: false
summary: "Canvas frame-sequence scrubber running 423 frames"
resource_group: "experiment"
tags: ["frame-sequence", "canvas", "scroll", "animation", "webp", "performance"]
---

A canvas frame-sequence scrubber running 423 WebP frames. Scroll position maps
directly to frame index, so playback is frame-exact and does not flicker.

Setup instructions are in [Scroll Animations Setup](/guides/hugo-scroll-animations-setup/).

## Pinned mode

The canvas holds at the top of the viewport while the scrub runs its full range.

<div class="scrub-lead"></div>

{{< frameseq dir="/lottie/cat-frames" dir-small="/lottie/cat-frames-sm" count="423" >}}

<div class="scrub-gap"></div>

## Inline mode

The canvas stays in the document flow and scrubs as it crosses the viewport.

{{< frameseq dir="/lottie/cat-frames" dir-small="/lottie/cat-frames-sm" count="423" sticky="false" height="420px" >}}

<div class="scrub-tail"></div>
