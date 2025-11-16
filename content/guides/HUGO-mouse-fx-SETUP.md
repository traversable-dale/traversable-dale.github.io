# Mouse Effects Setup for Hugo Site

## 📁 Files Included

1. **custom.css** - Your updated stylesheet with mouse effect styles
2. **mouse-effects.js** - JavaScript to power the effects
3. **SETUP.md** - This file

## 🚀 Installation Steps

### Step 1: Update CSS
Replace your existing `static/css/custom.css` (or wherever your CSS lives) with the updated `custom.css` file.

### Step 2: Add JavaScript
1. Copy `mouse-effects.js` to your Hugo site's `static/js/` directory
   ```
   your-hugo-site/
   └── static/
       └── js/
           └── mouse-effects.js
   ```

2. If the `static/js/` directory doesn't exist, create it first

### Step 3: Link JavaScript in Your Template

**Option A: Add to your header partial**
Edit `layouts/partials/header.html` and add this before the closing `</head>` tag:
```html
<script src="/js/mouse-effects.js"></script>
```

**Option B: Add to your base layout**
Edit `layouts/_default/baseof.html` and add this before the closing `</body>` tag:
```html
<script src="/js/mouse-effects.js"></script>
```

**Option C: Add to homepage only**
If you only want effects on the homepage, edit `layouts/index.html` and add:
```html
{{ define "main" }}
  <!-- your existing homepage content -->
  <script src="/js/mouse-effects.js"></script>
{{ end }}
```

### Step 4: Add Spotlight Overlay (Optional but Recommended)

Add this HTML element to your base template (`layouts/_default/baseof.html`), right after the opening `<body>` tag:

```html
<body>
  <div class="spotlight-overlay"></div>
  <!-- rest of your content -->
```

**Note:** The JavaScript will automatically create this element if it doesn't exist, but adding it manually ensures it's there from the start.

## ⚙️ Configuration

### Global Transition Speed Control 🎛️

**NEW:** All effects now use a single global speed variable! 

At the very top of `custom.css`, you'll find:

```css
:root {
  --transition-speed: 1s; /* Change this ONE value to control ALL effects */
}
```

This controls:
- ✅ Spotlight fade in/out
- ✅ Card glow fade in/out
- ✅ Bold text color change
- ✅ Bold text magnetic movement
- ✅ 3D tilt speed

**Recommended values:**
- `0.5s` = Fast/snappy
- `1s` = Current setting (balanced) ⭐
- `1.5s` = Slow/dramatic
- `2s` = Very slow/floaty

### Enabling/Disabling Effects

Edit the `CONFIG` object at the top of `mouse-effects.js`:

```javascript
const CONFIG = {
  spotlightEffect: true,   // Set to false to disable
  rippleEffect: true,      // Set to false to disable
  glowEffect: true,        // Set to false to disable
  tiltEffect: true,        // Set to false to disable
  boldTextGlow: true       // Set to false to disable
};
```

### Customizing Effect Appearance

#### Ripple Effect
In `custom.css`, find the ripple section:
```css
.ripple {
  background: rgba(255, 102, 0, 0.6); /* Change color here */
  width: 20px;  /* Change size */
  animation: ripple 0.6s ease-out; /* Change speed */
}
```

**Try these colors:**
- Orange (current): `rgba(255, 102, 0, 0.6)`
- White: `rgba(255, 255, 255, 0.5)`
- Blue: `rgba(0, 153, 255, 0.6)`
- Purple: `rgba(153, 51, 255, 0.6)`

#### Spotlight Effect
In `custom.css`:
```css
.spotlight-overlay {
  background: radial-gradient(
    circle 1000px at /* 1000px = spotlight size */
    var(--mouse-x, 50%) var(--mouse-y, 50%),
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100% /* 0.7 = darkness level */
  );
}
```

- **Larger spotlight:** Change `1000px` to `1500px` or `2000px`
- **Smaller spotlight:** Change `1000px` to `600px` or `800px`
- **Darker background:** Increase `0.7` to `0.9`
- **Lighter background:** Decrease `0.7` to `0.4`

**Note:** Spotlight only appears when hovering over images and bold text!

#### Card Glow
In `custom.css`:
```css
.project-item::before {
  width: 300px;  /* Glow size */
  height: 300px;
  background: radial-gradient(
    circle, 
    rgba(255, 102, 0, 0.3), /* Glow color & intensity */
    transparent 70%
  );
}
```

- **Brighter glow:** Increase `0.3` to `0.5` or `0.7`
- **Bigger glow:** Increase `300px` to `400px`
- **Different color:** Change RGB values

#### 3D Tilt
In `mouse-effects.js`, find the `initTilt()` function:
```javascript
const tiltStrength = 10; // Change this number
```

- **More dramatic tilt:** Increase to `15` or `20`
- **Subtle tilt:** Decrease to `5` or `3`

#### Bold Text Magnetic Effect
In `mouse-effects.js`, find the `initBoldTextGlow()` function:
```javascript
const magneticRange = 30; // Distance from cursor (pixels)
const magneticStrength = 1.5; // How strong the pull is
```

**Magnetic Range:**
- `20px` = Very close range
- `30px` = Current setting (focused)
- `50px` = Medium range
- `100px` = Wide magnetic field

**Magnetic Strength:**
- `0.5` = Subtle, gentle pull
- `1.5` = Current setting (noticeable) ⭐
- `2.5` = Strong, dramatic pull
- `4.0` = Very aggressive magnetic effect

**Bold Text Colors:**
- Default: Orange (#ff6600)
- On hover: White (#ffffff) with white glow

To change colors, edit `custom.css`:
```css
strong span, b span {
  color: #ff6600 !important; /* Default color */
}

strong.mouse-near span, b.mouse-near span {
  color: #ffffff !important; /* Hover color */
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.6); /* Glow effect */
}
```

## 🧪 Testing

1. Run your Hugo server: `hugo server`
2. Visit your homepage at `http://localhost:1313`
3. Test each effect:
   - **Spotlight:** Move your mouse over images and bold text
   - **Ripples:** Click anywhere
   - **Glow:** Hover over project cards
   - **Tilt:** Move mouse over project cards slowly
   - **Bold Text Magnetic:** Move cursor near bold text (within 30px)

## 🐛 Troubleshooting

### Effects not working at all
- Check browser console (F12) for JavaScript errors
- Verify `mouse-effects.js` is loading (check Network tab in dev tools)
- Make sure the script tag is present in your HTML

### Spotlight not appearing
- Check if `.spotlight-overlay` div exists in your HTML
- Verify `spotlightEffect: true` in CONFIG
- Make sure you're hovering over images or bold text (spotlight only activates on these elements)
- Check if z-index conflicts with other elements

### Glow not working on project cards
- Verify your project cards have the class `project-item`
- Check that `glowEffect: true` in CONFIG
- Make sure `.project-item` has `position: relative`

### Tilt feels too strong/weak
- Adjust `tiltStrength` value in `mouse-effects.js`
- Try values between 3-20

### Bold text not turning orange/white
- Verify the character spans are being created (check browser inspector)
- Make sure there are no CSS conflicts overriding the colors
- Check that `boldTextGlow: true` in CONFIG

### Bold text magnetic effect too subtle/strong
- Adjust `magneticStrength` in `mouse-effects.js`
- Adjust `magneticRange` to change activation distance

### All transitions too fast/slow
- Change `--transition-speed` variable at the top of `custom.css`
- This controls all effect speeds globally

## 🎨 Effect Details

### Current Configuration:
- **Spotlight:** 1000px radius, only on images and bold text
- **Card Glow:** Orange glow on project items
- **Click Ripples:** Orange ripples matching your theme
- **3D Tilt:** Cards tilt based on cursor position
- **Bold Text Magnetic:** Each character individually pulled toward cursor
  - Default: Orange text
  - Near cursor: White text with white glow
  - Range: 30px
  - Strength: 1.5
- **Global Transition Speed:** 1s for all effects

### Bold Text Magnetic Physics:
The magnetic effect splits each bold text element into individual character `<span>` elements. Each character:
- Calculates distance to your cursor
- Pulls toward cursor proportionally to distance
- Creates a wave/ripple effect as you move across words
- Smoothly returns to original position when cursor moves away
- Changes color from orange → white when within range
- All transitions use the global speed variable

## 🔧 Hugo Theme Compatibility

This works with the hugo-theme-console you're using. The effects target:
- `.project-item` - Your project grid items
- `.projects-grid` - Your project container
- `strong, b` - Bold text elements
- `img` - Images

If you change themes, you may need to update these selectors.

## 💡 Tips

- Start with all effects enabled and disable ones you don't like
- The glow and tilt effects work best together on project cards
- Spotlight adds drama but only appears on images and bold text to avoid distraction
- Orange ripples match your site's color scheme!
- Bold text magnetic effect works best with short phrases (2-10 words)
- Adjust `--transition-speed` to match the overall feel of your site
- For more dramatic effects, try `--transition-speed: 1.5s` or `2s`
- For snappier effects, try `--transition-speed: 0.5s`

## 📝 Advanced Customization

### Multiple Ripples Per Click
In `mouse-effects.js`, uncomment these lines in `initRipples()`:
```javascript
setTimeout(() => createRipple(e.clientX, e.clientY), 100);
setTimeout(() => createRipple(e.clientX, e.clientY), 200);
```

### Only Show Spotlight on Specific Elements
The spotlight is already configured to only show on images and bold text. To change this, edit the `initSpotlight()` function in `mouse-effects.js`.

### Different Colors for Different Projects
Add custom CSS classes to specific project items and override the glow color.

### Custom Magnetic Fields
You can create different magnetic strengths for different text elements by adding custom classes and JavaScript targeting.

## 🎯 What's New in This Version

- ✨ Global transition speed control via CSS variable
- ✨ Per-character magnetic physics for bold text
- ✨ Bold text color changes from orange → white on hover
- ✨ Spotlight now 1000px (much larger)
- ✨ All transitions synchronized to 1s by default
- ✨ Improved spacing preservation in bold text
- ✨ Better text-shadow glow effects

Enjoy your interactive portfolio! 🎨✨
