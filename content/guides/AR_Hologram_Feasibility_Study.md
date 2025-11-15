# AR Hologram Greeting Card: Technical Feasibility Study

**Prepared by:** John Syzonenko
**Date:** November 15, 2025  
**Client Request:** Interactive AR hologram experience for greeting card activation

---

## Table of Contents

1. [Summary](#summary)
2. [Project Context](#project-context)
3. [Potential Technologies & Workflows](#potential-technologies--workflows)
4. [Technical Approach](#technical-approach)
   - [Option 1: High-End Volumetric Capture](#option-1-high-end-volumetric-capture)
   - [Option 2: 2.5D Volumetric (TouchDesigner + AI Depth)](#option-2-25d-volumetric-touchdesigner--ai-depth)
   - [Option 3: 2D Green Screen Video](#option-3-2d-green-screen-video)
5. [Budget & Timeline Comparison](#budget--timeline-comparison)
6. [Recommendation](#recommendation)
7. [Final Verdict](#final-verdict)

---

## Summary

This study evaluates three technical approaches for creating an AR hologram experience activated via QR code on greeting cards. The solution must be accessible on mobile devices without app downloads, making [8th Wall](https://www.8thwall.com/) WebAR the optimal delivery platform.

**Key Finding:** A 2.5D volumetric approach using TouchDesigner and AI-generated depth maps offers the best balance of visual impact, budget, and timeline for proof-of-concept and initial production.

---

## Project Context

### Requirements
- AR hologram activated by scanning QR code on greeting card
- Web-based (no app download)
- Single talent/message for initial implementation
- Professional quality suitable for consumer product

---

## Potential Technologies & Workflows

### AR Platforms

**[8th Wall](https://www.8thwall.com/) (WebAR)**  
Browser-based AR for iOS and Android. No app download required. Supports image tracking, face effects, world tracking, and volumetric video playback. Industry standard for web-based AR experiences.

**[Snap AR (Lens Studio)](https://ar.snap.com/lens-studio)**  
AR platform for Snapchat. Requires Snapchat app. Offers advanced face tracking, body tracking, and world effects. Strong for social media integration but requires app barrier.

**Native AR (ARKit/ARCore via WebXR)**  
Emerging web standards for AR in mobile browsers. Currently limited browser support and feature set compared to 8th Wall.

### Volumetric Capture Technologies

**[DepthKit](https://www.depthkit.tv/)**  
Software platform for creating volumetric video using depth sensors (Azure Kinect, Femto Bolt). Outputs "Combined Per-Pixel" format that encodes RGB and depth in a single video file. Designed for single-perspective or multi-sensor 2.5D/360° capture. Compatible with Unity, Unreal, and web platforms including 8th Wall.

**[Microsoft Mixed Reality Capture Studios](https://www.microsoft.com/en-us/mixed-reality/capture-studios)**  
Professional volumetric capture facilities using 100+ camera arrays. Produces true 360° holograms viewable from any angle. Outputs to industry-standard formats. Locations in San Francisco and London.

**[Metastage](https://metastage.com/)**  
High-end volumetric capture studio network. Uses multi-camera rigs for full-body 360° capture. Outputs compressed volumetric formats optimized for real-time playback. Multiple studio locations nationwide.

### AI & Computational Approaches

**[TouchDesigner](https://derivative.ca/)**  
Node-based visual programming environment for real-time interactive media. Commonly used for installations, live performances, and media processing. Supports custom shaders, video processing, and integration with depth estimation models.

**[DepthAnything](https://depth-anything-v2.github.io/)**  
State-of-the-art AI model for monocular depth estimation. Generates depth maps from standard 2D video/images without depth sensors. Open-source and can be integrated into custom workflows.

### Traditional AR Content Formats

**Green Screen / Chroma Key Video**  
Standard video compositing technique. Subject filmed against solid color background, keyed out in post-production to create transparent video. Outputs as 2D billboard in AR space. Proven, cost-effective workflow.

**3D Models / Animation**  
Computer-generated 3D assets rendered in AR. Offers full 360° viewing and interactive possibilities. Requires 3D modeling/animation skills. Best for stylized or non-photorealistic content.

---

## Technical Approach

### Option 1: High-End Volumetric Capture

**Process:**
Professional volumetric capture studio → processed 3D assets → 8th Wall deployment

**Studios:** Microsoft Mixed Reality Capture Studios, [Metastage](https://metastage.com/), [Scatter/DepthKit Studio](https://www.depthkit.tv/depthkit-studio)

**Budget:** $15,000 - $50,000+ per shoot day
- Studio rental: $10K-$30K/day
- Travel/logistics: $3K-$10K
- Post-production: $2K-$10K

**Timeline:** 4-6 weeks
- Scheduling: 1-2 weeks
- Shoot day: 1 day
- Processing: 2-3 weeks
- Integration/QA: 1 week

**Pros:**
- True 360° volumetric capture
- Highest visual quality
- Full 6DOF (six degrees of freedom)

**Cons:**
- Prohibitive cost for proof-of-concept
- Limited studio locations
- Long lead times
- Not scalable for rapid iteration

---

### Option 2: 2.5D Volumetric (TouchDesigner + AI Depth)

**Tech Stack:**
Standard camera → [TouchDesigner](https://derivative.ca/) + DepthAnything AI → Adobe Premiere (video stacking) → Metadata generation → 8th Wall

**Process:**
1. Record talent with standard cinema camera (controlled lighting)
2. Process footage through TouchDesigner with DepthAnything depth estimation
3. Export RGB + depth map videos
4. Stack videos in Premiere Pro (RGB top, depth bottom)
5. Generate DepthKit-compatible metadata file
6. Upload to 8th Wall

**Proof-of-Concept Budget:** $2,500 - $4,000
- Audio/Video sync: $500-$800
- Green screen keying setup: $300-$500
- DepthAnything processing pipeline: $800-$1,200
- 8th Wall integration development: $600-$1,000
- Testing/QA: $300-$500

**Production Budget:** $2,000 - $3,500
- Production day: $1K-$2K
- Post-production: $1K-$1.5K

**Timeline:** 2-3 weeks
- Proof-of-concept: 1 week
- Production shoot: 1 day
- Post-production: 3-5 days
- Integration/QA: 2-3 days

**Pros:**
- 10x cost reduction vs. volumetric studios
- Standard equipment (no depth sensors)
- 2.5D depth effect (front-facing)
- Repeatable workflow once established

**Cons:**
- AI depth quality inferior to real sensors
- 2.5D only (not true 360°)
- Requires technical R&D phase
- Metadata generation needs calibration

**Technical Risk:** Medium
- Format compatibility: High confidence (8th Wall supports DepthKit format)
- Depth quality: Moderate confidence (DepthAnything produces usable depth, may have artifacts)
- Integration effort: 3-5 days initial setup

---

### Option 3: 2D Green Screen Video

**Tech Stack:**
Green screen shoot → Adobe After Effects compositing → 8th Wall video AR

**Process:**
1. Record talent against green screen
2. Key out background in After Effects
3. Export transparent video (WebM/HEVC)
4. Upload to 8th Wall as video texture

**Proof-of-Concept Budget:** $800 - $1,500
- Audio/Video sync development: $300-$500
- Green screen keying setup: $300-$500
- 8th Wall integration development: $200-$500

**Production Budget:** $1,000 - $2,000
- Production day: $500-$1K
- Post-production: $500-$1K

**Timeline:** 1-2 weeks
- Proof-of-concept: 2-3 days
- Production shoot: 1 day
- Post-production: 1-2 days
- Integration/QA: 1-2 days

**Pros:**
- Lowest cost
- Proven workflow
- Fast turnaround
- Zero technical risk

**Cons:**
- Flat 2D appearance (billboard effect)
- No depth/dimensionality
- Less premium feel
- Limited "hologram" effect

---

## Budget & Timeline Comparison

### Single Talent Implementation

| Approach | Proof-of-Concept | Production | **Total Cost** | Timeline | Visual Quality |
|----------|------------------|------------|----------------|----------|----------------|
| **High-End Volumetric** | N/A | $15,000 - $50,000+ | **$15,000 - $50,000+** | 4-6 weeks | ★★★★★ |
| **2.5D AI Volumetric** | $2,500 - $4,000 | $2,000 - $3,500 | **$4,500 - $7,500** | 2-3 weeks | ★★★★☆ |
| **2D Green Screen** | $800 - $1,500 | $1,000 - $2,000 | **$1,800 - $3,500** | 1-2 weeks | ★★★☆☆ |

**Cost Differential:**
- 2.5D approach: ~$6,000 average
- 2D approach: ~$2,650 average
- **Premium for volumetric effect: ~$3,350** (2.3x multiplier)

---

## Recommendation

**Recommended Approach: Option 2 (2.5D Volumetric)**

**Rationale:**
1. **Visual Impact:** 2.5D depth provides significantly more "hologram" presence than flat video, meeting the experiential goal
2. **Cost Efficiency:** 80-90% cost savings vs. high-end volumetric studios
3. **Feasibility:** Moderate technical risk with clear fallback option
4. **Timeline:** Achievable within 2-3 week window

**Suggested Phasing:**
- **Phase 1 (Week 1):** Proof-of-concept - validate TouchDesigner → 8th Wall pipeline
- **Phase 2 (Week 2-3):** Production shoot and final integration

**Fallback:** If proof-of-concept reveals insurmountable technical issues, Option 3 (green screen) provides immediate pivot path. The work completed in proof-of-concept (audio/video sync, green screening, 8th Wall integration) transfers directly to the 2D workflow.

---

## Final Verdict

The 2.5D volumetric approach represents the optimal balance of innovation, budget, and deliverability for this greeting card AR experience. While it requires an initial technical investment of approximately $3,500 more than the 2D approach, the enhanced visual quality and "hologram" effect justify the premium for a consumer-facing product.

**Decision Points:**  
After completion of the proof-of-concept (Week 1), a technical review will determine:
- Depth quality from DepthAnything processing
- 8th Wall rendering performance on target devices
- Overall visual fidelity vs. client expectations

If proof-of-concept results are unsatisfactory, pivot to 2D green screen workflow using completed development work. Estimated sunk cost in pivot scenario: $1,500 - $2,000.

**Recommended Next Action:** Approve $2,500 - $4,000 proof-of-concept budget to validate technical approach before committing to full production.

---

**Questions or concerns?** Contact John Syzonenko
