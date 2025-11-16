# Website Customization Guide

A quick reference for customizing your Hugo portfolio site with interactive mouse effects.

---

## Table of Contents

1. [File Locations](#file-locations)
2. [Heading Styles](#heading-styles)
3. [Interactive Border Effects](#interactive-border-effects)
4. [Bold Text Magnetic Effect](#bold-text-magnetic-effect)
5. [Footer Customization](#footer-customization)
6. [Navigation & Links](#navigation--links)
7. [Mouse Effects Configuration](#mouse-effects-configuration)
8. [Color Scheme](#color-scheme)
9. [Quick Reference Values](#quick-reference-values)

---

## File Locations

**Main Files:**
- `static/css/custom.css` - All styling and visual effects
- `static/js/mouse-effects.js` - Interactive JavaScript behaviors
- `layouts/partials/header.html` - Loads custom CSS and JS
- `layouts/partials/footer.html` - Footer HTML structure
- `layouts/index.html` - Homepage layout override

**Content Files:**
- `content/_index.md` - Homepage content
- `content/about.md` - About page
- `content/work.md` - Work/projects list
- `content/projects/[name].md` - Individual project pages

---

## Heading Styles

### Location: `custom.css` (Lines ~25-115)

### H1 - Regular Titles
```css
h1, .terminal h1 {
  font-size: 1.5em !important;
  line-height: 1 !important;
  padding-bottom: 1em !important;
}
```

**Adjust:**
- `font-size: 1.5em` → Try: `1.2em` (smaller), `2em` (larger)
- `padding-bottom: 1em` → Try: `0.5em` (tighter), `1.5em` (more space)

### H1 - Article/Project Page Titles
```css
article h1 {
  font-size: 3em !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
  text-transform: none !important;
}
```

**Adjust:**
- `font-size: 3em` → Try: `2.5em` (smaller), `4em` (huge)
- `font-weight: 700` → Try: `300` (light), `400` (normal), `900` (extra bold)
- `letter-spacing: 0.02em` → Try: `0` (tight), `0.1em` (spacious)
- `text-transform: none` → Try: `uppercase` for ALL CAPS

### H2 - Main Headings
```css
h2, article h2, .terminal h2 {
  font-size: 1.8em !important;
  margin-top: 2em !important;
  margin-bottom: 1em !important;
}
```

**Adjust:**
- `font-size: 1.8em` → Try: `1.5em` (smaller), `2.2em` (larger)
- `margin-top: 2em` → Space above heading
- `margin-bottom: 1em` → Space below heading

### H3 - Section Headings
```css
h3, article h3, .terminal h3 {
  font-size: 1.4em !important;
  margin-top: 1.5em !important;
  margin-bottom: 0.75em !important;
}
```

### H4 - Minor Headings
```css
h4, article h4, .terminal h4 {
  font-size: 1.1em !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
```

---

## Interactive Border Effects

### Location: `mouse-effects.js` (Lines ~280-390)

### Border Repel Settings
```javascript
function initBorderRepel() {
  const repelRange = 100;      // Distance for effect trigger (pixels)
  const repelStrength = 150;   // How far characters push away (pixels)
```

**Adjust:**
- **Subtle effect:** `repelRange: 50`, `repelStrength: 5`
- **Current (dramatic):** `repelRange: 100`, `repelStrength: 150`
- **Very dramatic:** `repelRange: 200`, `repelStrength: 250`

### Border Characters
```javascript
span.textContent = '=';  // Line 337 (approximately)
```

**Change character:**
- `'='` - Current (equals signs)
- `'─'` - Longer horizontal lines
- `'━'` - Thick horizontal lines
- `'-'` - Regular dashes
- `'~'` - Wavy lines
- `'•'` - Dots

### Border Color on Hover
**Location:** `custom.css` (Line ~300)

```css
.footer-social a.icon-near img {
  filter: brightness(1.3);
}
```

Inside the repel effect JavaScript, characters turn orange:
```javascript
span.style.color = '#ff6600';  // Change this color
```

---

## Bold Text Magnetic Effect

### Location: `mouse-effects.js` (Lines ~195-265)

### Magnetic Settings
```javascript
function initBoldTextGlow() {
  const magneticRange = 20;      // Distance for effect (pixels)
  const magneticStrength = 3;    // Pull strength
```

**Adjust:**
- **Subtle:** `magneticRange: 10`, `magneticStrength: 1`
- **Current:** `magneticRange: 20`, `magneticStrength: 3`
- **Dramatic:** `magneticRange: 50`, `magneticStrength: 8`

### Bold Text Colors
**Location:** `custom.css` (Lines ~145-180)

```css
/* Default orange */
strong, b {
  color: #ff6600 !important;
}

/* White when mouse is near */
strong.mouse-near, b.mouse-near {
  color: #ffffff !important;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
}
```

**Adjust:**
- Default color: Change `#ff6600` to any hex color
- Hover color: Change `#ffffff` to any hex color
- Glow intensity: Change `0.6` to `0.3` (subtle) or `1.0` (bright)

---

## Footer Customization

### Footer Border
**Location:** `mouse-effects.js` (Lines ~378-475)

```javascript
function initFooterBorder() {
  const repelRange = 100;       // Same as heading borders
  const repelStrength = 10;     // Same as heading borders
```

### Footer Icon Settings
**Location:** `mouse-effects.js` (Lines ~477-540)

```javascript
function initFooterIconRepel() {
  const repelRange = 150;
  const repelStrength = 15;
```

### Footer Icon Size
**Location:** `custom.css` (Line ~398)

```css
.footer-social img {
  width: 25px;   /* ADJUST SIZE HERE */
  height: 25px;
}
```

**Adjust:**
- Smaller icons: `15px` - `20px`
- Current: `25px`
- Larger icons: `30px` - `40px`

### Footer Icon Glow
**Location:** `custom.css` (Lines ~383-387)

```css
.footer-social a.icon-near {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) 
          drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
}
```

**Adjust:**
- Inner glow: `0.8` → Try `0.5` (subtle) or `1.0` (bright)
- Outer glow: `0.4` → Try `0.2` (subtle) or `0.6` (bright)
- Glow color: Change `255, 255, 255` (white) to RGB values

### Footer Animation
**Location:** `custom.css` (Lines ~335-338)

```css
.custom-footer {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
```

**Adjust:**
- Slide distance: `translateY(30px)` → Try `50px` (more) or `15px` (less)
- Animation speed: `0.8s` → Try `0.5s` (faster) or `1.2s` (slower)

### Footer Links & Social Icons Setup
**Location:** `layouts/partials/footer.html`

Update your social media URLs:
```html
<a href="https://github.com/yourusername" target="_blank" rel="noopener">
<a href="https://instagram.com/yourusername" target="_blank" rel="noopener">
<a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener">
```

Icon files go in: `static/images/icons/`
- `github.png`
- `instagram.png`
- `linkedin.png`

**Tip:** Use white PNG icons (25x25px or larger for best quality)

---

## Navigation & Links

### Header Navigation Style
**Location:** `custom.css` (Lines ~308-322)

```css
.terminal-menu a,
.terminal-nav a {
  font-size: 1em !important;
  font-weight: 400 !important;
  letter-spacing: 0.05em !important;
  text-transform: none !important;
  padding: 0.5em 1em !important;
}
```

**Adjust:**
- `font-size: 1em` → Try `0.9em` (smaller) or `1.1em` (larger)
- `font-weight: 400` → Try `300` (light), `600` (semi-bold), `700` (bold)
- `letter-spacing: 0.05em` → Try `0` (tight) or `0.1em` (wide)
- `text-transform: none` → Try `uppercase` for ALL CAPS

### Link Colors & Hover
**Location:** `custom.css` (Lines ~225-240)

```css
a {
  color: #ff6600 !important;          /* Default orange */
  padding: 0 0.2em;                   /* Padding (prevents jitter) */
  background-color: transparent;
  transition: color 0.2s ease, background-color 0.2s ease;
}

a:hover {
  color: #000000 !important;          /* Black text */
  background-color: #ff6600 !important; /* Orange background */
}
```

**Adjust:**
- Default link color: Change `#ff6600`
- Hover text color: Change `#000000`
- Hover background: Change second `#ff6600`
- Transition speed: Change `0.2s` → Try `0.3s` (slower) or `0.1s` (faster)

---

## Mouse Effects Configuration

### Location: `mouse-effects.js` (Lines ~13-20)

### Enable/Disable Effects
```javascript
const CONFIG = {
  spotlightEffect: true,   // Dims page except where mouse is
  rippleEffect: true,      // Click to create ripples
  glowEffect: true,        // Cards glow on hover
  tiltEffect: true,        // Cards tilt in 3D
  boldTextGlow: true,      // Bold text magnetic effect
  borderRepel: true,       // Border characters repel
  tiltStrength: 30         // 3D tilt intensity
};
```

**To disable an effect:** Change `true` to `false`

### Global Transition Speed
**Location:** `custom.css` (Line ~11)

```css
:root {
  --transition-speed: 3s; /* Controls ALL effects */
}
```

**Adjust:**
- Fast/snappy: `0.3s` - `0.5s`
- Balanced: `1s`
- Current (slow/dramatic): `3s`
- Very slow/floaty: `5s`

This affects:
- Spotlight fade
- Card glow
- Bold text color change
- Bold text magnetic movement
- 3D tilt speed
- Border character movement

### Spotlight Effect
**Location:** `custom.css` (Lines ~685-695)

```css
.spotlight-overlay {
  background: radial-gradient(
    circle 1000px at /* Spotlight size */
    var(--mouse-x, 50%) var(--mouse-y, 50%),
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100% /* Darkness: 0.7 */
  );
}
```

**Adjust:**
- Spotlight size: `1000px` → Try `600px` (smaller) or `1500px` (larger)
- Darkness: `0.7` → Try `0.4` (lighter) or `0.9` (darker)

### Click Ripple Effect
**Location:** `custom.css` (Lines ~670-683)

```css
.ripple {
  background: rgba(255, 102, 0, 0.6); /* Orange */
  width: 20px;
  height: 20px;
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    transform: scale(4);  /* Size multiplier */
    opacity: 0;
  }
}
```

**Adjust:**
- Ripple color: `rgba(255, 102, 0, 0.6)` → Try `rgba(255, 255, 255, 0.5)` (white)
- Size: `scale(4)` → Try `scale(2)` (smaller) or `scale(6)` (larger)
- Speed: `0.6s` → Try `0.4s` (faster) or `1s` (slower)

### Card Glow Effect
**Location:** `custom.css` (Lines ~708-725)

```css
.project-item::before {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle, 
    rgba(255, 102, 0, 0.3), /* Orange glow at 30% opacity */
    transparent 70%
  );
}
```

**Adjust:**
- Glow size: `300px` → Try `200px` (smaller) or `400px` (larger)
- Intensity: `0.3` → Try `0.2` (subtle) or `0.5` (bright)
- Color: Change RGB values `255, 102, 0` (orange)

---

## Color Scheme

### Primary Colors
```css
/* Main colors used throughout */
--black: #000000      /* Background */
--white: #ffffff      /* Text */
--orange: #ff6600     /* Accent (links, bold text, effects) */
--dark-gray: #333333  /* Borders, subtle elements */
```

### Where to Change Colors

**Background:**
```css
body {
  background-color: #000000;  /* Line ~14 */
}
```

**All text:**
```css
body, p, div, span, li, td, th {
  color: #ffffff !important;  /* Line ~145 */
}
```

**Orange accent** (links, bold text):
```css
a {
  color: #ff6600 !important;  /* Line ~225 */
}

strong, b {
  color: #ff6600 !important;  /* Line ~148 */
}
```

**Interactive effects** (search for `#ff6600` and `rgba(255, 102, 0` in both files)

---

## Quick Reference Values

### Current Settings Summary

| Feature | Range/Strength | Speed | Location |
|---------|----------------|-------|----------|
| **Heading Borders** | 100px / 150px | 3s | `mouse-effects.js` L282-283 |
| **Footer Border** | 100px / 10px | 3s | `mouse-effects.js` L380-381 |
| **Footer Icons** | 150px / 15px | 3s | `mouse-effects.js` L479-480 |
| **Bold Text Magnetic** | 20px / 3px | 3s | `mouse-effects.js` L197-198 |
| **Spotlight Size** | 1000px | 3s | `custom.css` L689 |
| **Click Ripples** | scale(4) | 0.6s | `custom.css` L672 |
| **Card Glow** | 300px | 3s | `custom.css` L710 |
| **Footer Animation** | 30px slide | 0.8s | `custom.css` L336-337 |

### Font Sizes

| Element | Size | Location |
|---------|------|----------|
| Base text | 0.9em | `custom.css` L15 |
| H1 (regular) | 1.5em | `custom.css` L27 |
| H1 (article pages) | 3em | `custom.css` L42 |
| H2 | 1.8em | `custom.css` L64 |
| H3 | 1.4em | `custom.css` L85 |
| H4 | 1.1em | `custom.css` L106 |
| Navigation | 1em | `custom.css` L310 |
| Footer icons | 25px | `custom.css` L398 |

### Spacing

| Element | Top | Bottom | Location |
|---------|-----|--------|----------|
| H1 | 0 | 1em | `custom.css` L28-30 |
| H2 | 2em | 1em | `custom.css` L65-66 |
| H3 | 1.5em | 0.75em | `custom.css` L86-87 |
| H4 | 0 | 0 | `custom.css` L107-108 |

---

## Tips for Customization

1. **Make one change at a time** - Easier to see what each adjustment does
2. **Test locally first** - Use `hugo serve -D` before pushing to GitHub
3. **Keep backups** - Commit working versions before major changes
4. **Browser refresh** - Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5) to see CSS changes
5. **Mobile testing** - Check how changes look on different screen sizes
6. **Match values** - Keep related effects using similar range/strength for consistency

---

## Common Customizations

### Make Everything Faster/Snappier
```css
/* custom.css Line 11 */
:root {
  --transition-speed: 0.5s;
}
```

### Reduce All Mouse Effects
```javascript
// mouse-effects.js - Reduce all range values by 50%
const repelRange = 50;        // was 100
const magneticRange = 10;     // was 20
```

### Change Accent Color to Blue
Find and replace throughout both files:
- `#ff6600` → `#0099ff`
- `rgba(255, 102, 0` → `rgba(0, 153, 255`

### Make Text Larger
```css
/* custom.css Line 15 */
body {
  font-size: 1em; /* was 0.9em */
}
```

### Disable All Mouse Effects
```javascript
// mouse-effects.js Lines 13-19
const CONFIG = {
  spotlightEffect: false,
  rippleEffect: false,
  glowEffect: false,
  tiltEffect: false,
  boldTextGlow: false,
  borderRepel: false,
};
```

---

**Last Updated:** November 16, 2025

For questions or issues, refer to the main [setup guide](setup-guide.md) or check the Hugo documentation.
