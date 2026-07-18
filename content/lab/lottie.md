---
title: "Lottie Lab"
date: 2026-07-18
draft: true
---

## Lottie on Scroll — Test Page

A sandbox for testing [Lottie](https://airbnb.io/lottie/) animations exported
from After Effects (via the Bodymovin plugin). Replace `/gatin.json` with your
own export placed in `/static`.

Scroll down — each animation triggers as it enters the viewport.

<div style="height:80vh"></div>

### 1. Play once on scroll into view (default)

{{< lottie src="/gatin.json" height="360px" >}}

<div style="height:80vh"></div>

### 2. Scrub with scroll position

The timeline is mapped to how far the element has travelled through the viewport.

{{< lottie src="/gatin.json" mode="scrub" height="360px" >}}

<div style="height:80vh"></div>

### 3. Looping while in view

{{< lottie src="/gatin.json" mode="play" loop="true" height="360px" >}}

<div style="height:80vh"></div>
