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

### Enabling/Disabling Effects

Edit the `CONFIG` object at the top of `mouse-effects.js`:

```javascript
const CONFIG = {
  spotlightEffect: true,   // Set to false to disable
  rippleEffect: true,      // Set to false to disable
  glowEffect: true,        // Set to false to disable
  tiltEffect: true         // Set to false to disable
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
    circle 200px at /* 200px = spotlight size */
    var(--mouse-x, 50%) var(--mouse-y, 50%),
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100% /* 0.7 = darkness level */
  );
}
```

- **Larger spotlight:** Change `200px` to `300px` or `400px`
- **Darker background:** Increase `0.7` to `0.9`
- **Lighter background:** Decrease `0.7` to `0.4`

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

## 🧪 Testing

1. Run your Hugo server: `hugo server`
2. Visit your homepage at `http://localhost:1313`
3. Test each effect:
   - **Spotlight:** Move your mouse around
   - **Ripples:** Click anywhere
   - **Glow:** Hover over project cards
   - **Tilt:** Move mouse over project cards slowly

## 🐛 Troubleshooting

### Effects not working at all
- Check browser console (F12) for JavaScript errors
- Verify `mouse-effects.js` is loading (check Network tab in dev tools)
- Make sure the script tag is present in your HTML

### Spotlight not appearing
- Check if `.spotlight-overlay` div exists in your HTML
- Verify `spotlightEffect: true` in CONFIG
- Check if z-index conflicts with other elements

### Glow not working on project cards
- Verify your project cards have the class `project-item`
- Check that `glowEffect: true` in CONFIG
- Make sure `.project-item` has `position: relative`

### Tilt feels too strong/weak
- Adjust `tiltStrength` value in `mouse-effects.js`
- Try values between 3-20

## 🎨 Additional Customization Ideas

### Multiple Ripples Per Click
In `mouse-effects.js`, uncomment these lines in `initRipples()`:
```javascript
setTimeout(() => createRipple(e.clientX, e.clientY), 100);
setTimeout(() => createRipple(e.clientX, e.clientY), 200);
```

### Only Show Effects on Hover
To make spotlight only appear when hovering project cards, modify the CSS:
```css
.projects-grid:hover ~ .spotlight-overlay {
  opacity: 1;
}
```

### Different Colors for Different Projects
Add custom CSS classes to specific project items and override the glow color.

## 📝 Notes

- Effects are optimized for performance using `requestAnimationFrame` where appropriate
- All effects work on mobile, but consider disabling tilt on touch devices
- The JavaScript auto-initializes when the page loads
- Effects respect the existing dark theme styling

## 🔧 Hugo Theme Compatibility

This works with the hugo-theme-console you're using. The effects target:
- `.project-item` - Your project grid items
- `.projects-grid` - Your project container

If you change themes, you may need to update these selectors.

## 💡 Tips

- Start with all effects enabled and disable ones you don't like
- The glow and tilt effects work best together
- Spotlight adds drama but can be distracting - try it with lower opacity first
- Orange ripples match your site's color scheme!

Enjoy your interactive portfolio! 🎨✨
