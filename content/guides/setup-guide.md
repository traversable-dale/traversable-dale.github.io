---
title: "Setup Guide"
date: 2025-10-31
draft: false
---

# Hugo + GitHub Pages Complete Setup Guide

**How this website was built - A complete guide for building your own portfolio site for free**

---

## Table of Contents

1. [Quick Start Overview](#quick-start-overview)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Working with Git Submodules](#working-with-git-submodules)
4. [Required Files Overview](#required-files-overview)
5. [Troubleshooting](#troubleshooting)
6. [Daily Workflow](#daily-workflow)
7. [Key Learnings](#key-learnings)

---

## Quick Start Overview

### What You'll Build
- Professional portfolio with custom dark theme
- Home page with 2x3 project grid
- About page with bio and skills
- Work page with chronological project list
- Individual project pages using templates
- Automatic deployment via GitHub Actions

### Time Required
- Initial setup: 1-2 hours
- Adding content: Ongoing as needed

### Cost
- **$0** - Completely free with GitHub Pages
- Optional: Custom domain ($10-15/year)

---

## Step-by-Step Setup

### 1. Install Hugo

**macOS:**
```bash
brew install hugo
```

**Windows:**
- Download from https://github.com/gohugoio/hugo/releases
- Or use: `choco install hugo-extended -y`

**Linux:**
```bash
sudo apt-get install hugo
# or
sudo snap install hugo
```

**Verify:**
```bash
hugo version
```

---

### 2. Create Your Site

```bash
# Create new site
hugo new site my-website
cd my-website

# Initialize Git (CRITICAL: Do this BEFORE adding theme!)
git init

# Add theme as submodule
git submodule add https://github.com/mrmierzejewski/hugo-theme-console.git themes/hugo-theme-console
```

**Common Error:** Running `git submodule add` before `git init` causes "fatal: not a git repository"

---

### 3. Configure Your Site

Edit `hugo.toml` to include:
- Basic site info (title, baseURL, language)
- Theme name
- Markup settings to allow HTML (`unsafe = true`)
- Navigation links
- Site description

**Basic hugo.toml template:**
```toml
baseURL = 'https://yourusername.github.io/'
languageCode = 'en-us'
title = 'Your Name'
theme = "hugo-theme-console"

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[params]
  description = "Your professional tagline"

[[params.navlinks]]
  name = "Home"
  url = "/"

[[params.navlinks]]
  name = "About"
  url = "/about/"

[[params.navlinks]]
  name = "Work"
  url = "/work/"
```

---

### 4. Create Custom Homepage Layout

**Why needed:** The Console theme has its own homepage layout. You need to override it.

Create `layouts/index.html`:

```html
{{ define "main" }}
<h1>{{ .Site.Title }}</h1>

{{ .Content }}

{{ end }}
```

---

### 5. Enable Custom CSS Loading

**Why needed:** Console theme needs a specific file to load custom styles.

Create `layouts/partials/header.html`:

```html
<link rel="stylesheet" href="/css/custom.css">
```

**Critical:** It MUST be named `header.html` (not `extended_head.html`). The Console theme specifically looks for this file.

---

### 6. Create Your Content Pages

```bash
# Main pages
hugo new _index.md    # Homepage
hugo new about.md     # About page
hugo new work.md      # Work/portfolio list page

# Project pages (create as many as you need)
hugo new projects/project-1.md
hugo new projects/project-2.md
hugo new projects/project-3.md
```

---

### 7. Set Up Folder Structure

```bash
# Create CSS folder
mkdir -p static/css

# Create image folders
mkdir -p static/images/projects/project-1
mkdir -p static/images/projects/project-2
```

**Image organization:**
- Your photo: `static/images/your-photo.jpg`
- Project images: `static/images/projects/project-name/thumbnail.jpg`
- All images MUST be in `static/` folder (not `content/`)

---

### 8. Add Custom Styling

Create `static/css/custom.css` with your design preferences (dark theme, colors, project grid layout, etc.).

**Important CSS Override:**
The Console theme applies a light gray color to many elements through the `.terminal` class. Your CSS must specifically override this to get pure white text in tables and other elements.

---

### 9. Test Locally

```bash
hugo serve -D
```

Open browser to: http://localhost:1313

The server automatically reloads when you save changes!

**Commands:**
- `hugo serve -D` - Include draft posts
- `hugo serve` - Published content only
- `Ctrl+C` - Stop server

---

### 10. Set Up GitHub Repository

**On GitHub.com:**
1. Log in to GitHub
2. Click '+' → New repository
3. Name: `yourusername.github.io` (use YOUR actual username)
4. Make it **Public**
5. Do NOT initialize with anything
6. Create repository

**In your terminal:**
```bash
# Authenticate with GitHub
brew install gh
gh auth login
# Choose: HTTPS → Yes → Login with browser

# Connect and push
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

---

### 11. Set Up Automatic Deployment

Create `.github/workflows/hugo.yml`:

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.128.0
    steps:
      - name: Install Hugo
        run: |
          wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
          sudo dpkg -i hugo.deb
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build with Hugo
        run: hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Then push it:**
```bash
git add .github/
git commit -m "Add GitHub Actions workflow"
git push
```

---

### 12. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source:** Select **GitHub Actions**
4. Done! It auto-saves.

**Check deployment:**
- Go to **Actions** tab
- Watch for green checkmark (takes 2-3 minutes)
- Site will be live at: `https://yourusername.github.io`

---

## Working with Git Submodules

### What Are Submodules?

Git submodules allow you to keep a Git repository as a subdirectory of another Git repository. In this case, the Hugo theme is a submodule - it's maintained in its own repository but included in yours.

### Cloning a Repo with Submodules

When you clone your repository to a new computer, Git doesn't automatically download submodules. You'll see an empty `themes/` folder.

**Option 1: Clone with submodules (Recommended)**
```bash
git clone --recurse-submodules https://github.com/yourusername/yourusername.github.io.git
```

**Option 2: Initialize submodules after cloning**
```bash
# First, clone normally
git clone https://github.com/yourusername/yourusername.github.io.git
cd yourusername.github.io

# Then initialize submodules
git submodule update --init --recursive
```

### Verifying Submodules Loaded

```bash
# Check that the theme folder has content
ls themes/hugo-theme-console/

# You should see: LICENSE, README.md, layouts/, static/, etc.
```

### Common Submodule Issues

**Problem:** Blank white page when running `hugo serve -D`

**Error messages:**
```
WARN  found no layout file for "html" for kind "section"
WARN  found no layout file for "html" for kind "page"
```

**Solution:** Your theme submodule isn't loaded. Run:
```bash
git submodule update --init --recursive
```

---

## Required Files Overview

### Configuration Files

**hugo.toml**
- Main configuration file
- Sets site title, theme, navigation
- Enables HTML in markdown (`unsafe = true`)

**layouts/index.html**
- Overrides theme's homepage layout
- Allows your `_index.md` content to display

**layouts/partials/header.html**
- Loads your custom CSS file
- Console theme specifically looks for this file

**.github/workflows/hugo.yml**
- Configures automatic deployment
- Builds site and publishes to GitHub Pages
- Triggers on every push to main branch

### Content Files

**content/_index.md** (Homepage)
- Short intro about you
- 2x3 grid of project thumbnails
- Link to GitHub

**content/about.md** (About Page)
- Your photo
- Bio paragraph
- Email address
- Skills list with links
- Specializations

**content/work.md** (Work Page)
- Projects organized by year
- Links to individual project pages
- Brief descriptions
- Reverse chronological order

**content/projects/[project-name].md** (Project Pages)
- Metadata table (Role, Client, Team, etc.)
- Project overview and description
- Technology stack
- Key features
- Images throughout
- Outcomes and acknowledgments

**content/projects/_index.md** (Projects Index)
- Redirects to Work page
- Prevents auto-generated project list

### Style Files

**static/css/custom.css**
- Dark theme (black background, white text)
- Neon orange hyperlinks
- 2-column responsive project grid
- Compact table styling
- Image caption formatting
- Theme overrides (especially for `.terminal` class)

### Image Files

All images must be in `static/images/` directory:
- `your-photo.jpg` - For about page
- `projects/project-1/thumbnail.jpg` - For homepage grid
- `projects/project-1/hero.jpg` - Main project image
- `projects/project-1/detail.jpg` - Additional project images

**Image guidelines:**
- Thumbnails: 800-1200px wide
- Hero images: 1200-2000px wide
- Format: JPG for photos, PNG for graphics
- Keep under 500KB when possible
- Use descriptive filenames

---

## Troubleshooting

### "fatal: not a git repository"
**When:** Adding theme as submodule

**Problem:** Tried to run `git submodule add` before initializing Git

**Solution:** Always run `git init` FIRST, then add the theme
```bash
git init  # Do this first!
git submodule add https://github.com/...
```

---

### "Invalid username or token" when pushing to GitHub
**When:** Running `git push`

**Problem:** GitHub requires Personal Access Token, not password

**Solution:** Use GitHub CLI for easy authentication
```bash
brew install gh
gh auth login
# Follow prompts: HTTPS → Yes → Login with browser
```

---

### Homepage shows old/default theme content
**When:** Visiting your site locally or on GitHub Pages

**Problem:** Theme's default homepage layout is overriding your `_index.md` content

**Solution:** Create `layouts/index.html` to override the theme
- This file tells Hugo: "Use my content from _index.md, not the theme's default"
- Without this file, the Console theme shows its own homepage

---

### Project grid not showing (images stack vertically)
**When:** Homepage displays but projects are in a single column

**Problem 1:** Hugo is stripping out the HTML from your markdown

**Solution 1:** Add to `hugo.toml`:
```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

**Problem 2:** Custom CSS isn't loading

**Solution 2:** Verify `layouts/partials/header.html` exists and contains the CSS link

---

### Custom CSS not loading at all
**When:** Your styling doesn't appear on the site

**Problem:** Console theme needs a specific partial file to load custom CSS

**Solution:** Create `layouts/partials/header.html` with:
```html
<link rel="stylesheet" href="/css/custom.css">
```

**Critical notes:**
- Must be named `header.html` (not `extended_head.html`)
- Must be in `layouts/partials/` directory
- The Console theme specifically includes this file in its `<head>` section

---

### Table text appears gray instead of white
**When:** Project metadata tables show gray text for labels

**Problem:** The Console theme applies a CSS class called `.terminal` to many elements. This class sets text color to `#eae6e6` (light gray) which overrides your custom CSS.

**Detailed explanation:**
- The theme uses: `.terminal table td { color: #eae6e6; }`
- Your CSS might say: `table td { color: #ffffff; }`
- Theme's selector is more specific, so it wins
- Result: Gray text instead of white

**Solution:** Override the `.terminal` class specifically in your `custom.css`:
```css
.terminal blockquote, 
.terminal h1, 
.terminal h2, 
.terminal h3, 
.terminal h4, 
.terminal h5, 
.terminal h6, 
.terminal strong, 
.terminal .logo,
.terminal table td {
  color: #ffffff !important;
}
```

**Why this works:**
- Uses the same `.terminal` selector as the theme
- Adds `!important` to force override
- Now your white color beats the theme's gray

---

### Images not appearing (404 errors)
**When:** Image placeholders show but no actual images

**Common causes and solutions:**

1. **Images in wrong folder**
   - ❌ `content/images/photo.jpg`
   - ✅ `static/images/photo.jpg`
   - Hugo only serves files from `static/` folder

2. **Wrong path in markdown**
   - ❌ `![Image](images/photo.jpg)` - missing leading slash
   - ❌ `![Image](static/images/photo.jpg)` - don't include "static"
   - ✅ `![Image](/images/photo.jpg)` - starts with /

3. **Images not committed to Git**
   ```bash
   git add static/images/
   git commit -m "Add images"
   git push
   ```

4. **Filename case mismatch**
   - Filenames are case-sensitive! Match exactly.

---

### Site shows 404 after deployment
**When:** GitHub Actions completes but site shows 404

**Checklist:**

1. **Verify repo is Public**
   - Settings → General → scroll to "Danger Zone"
   - Must be Public for free GitHub Pages

2. **Check Pages source**
   - Settings → Pages
   - Source should be "GitHub Actions"

3. **Look for build errors**
   - Go to Actions tab
   - Click the latest workflow run
   - Look for red X or error messages

4. **Verify content has draft: false**
   - Open your .md files
   - Front matter must say: `draft: false`

5. **Force a rebuild**
   - Make any small change, commit and push
   - Watch Actions tab for new build

---

### Blank white page when running locally
**When:** After cloning repo to a new computer

**Problem:** Theme submodule isn't loaded

**Symptoms:**
```
WARN  found no layout file for "html" for kind "section"
WARN  found no layout file for "html" for kind "page"
```

**Solution:** Initialize submodules
```bash
git submodule update --init --recursive
```

**Verify it worked:**
```bash
ls themes/hugo-theme-console/
# Should show: LICENSE, README.md, layouts/, static/, etc.
```

**Prevention:** When cloning to new computers, use:
```bash
git clone --recurse-submodules https://github.com/yourusername/yourusername.github.io.git
```

---

## Daily Workflow

### Making Updates

```bash
# 1. Edit content files in your text editor

# 2. Test locally
hugo serve -D

# 3. When happy with changes, set draft: false

# 4. Commit and push
git add .
git commit -m "Description of changes"
git push

# 5. GitHub Actions automatically deploys (wait 2-3 minutes)
```

---

### Adding a New Project

**Step-by-step:**

1. **Create project page**
   ```bash
   hugo new projects/new-project-name.md
   ```

2. **Add project images**
   ```bash
   mkdir static/images/projects/new-project-name
   # Add your images to this folder
   ```

3. **Fill in template**
   - Use your project template structure
   - Replace all placeholders
   - Add image paths
   - Set `draft: false`

4. **Update homepage**
   - Edit `content/_index.md`
   - Add new project to the grid HTML

5. **Update work page**
   - Edit `content/work.md`
   - Add project to appropriate year section

6. **Test and deploy**
   ```bash
   hugo serve -D  # Check locally
   git add .
   git commit -m "Add [project name] project"
   git push
   ```

---

### Useful Git Commands

```bash
git status              # See what changed
git add .               # Stage all changes
git commit -m "message" # Save with description
git push                # Upload to GitHub
git log                 # View history
git pull                # Download latest
git submodule update --init --recursive  # Load submodules
```

---

## Key Learnings

### Critical Setup Steps

1. **Run `git init` before adding theme** - Prevents "not a git repository" error

2. **Create `layouts/index.html`** - Overrides theme's default homepage

3. **Create `layouts/partials/header.html`** - Console theme needs THIS specific file for custom CSS

4. **Add `unsafe = true` to hugo.toml** - Allows HTML in markdown for project grid

5. **Images go in `static/` folder** - Not in `content/` folder

6. **Use GitHub CLI for authentication** - `gh auth login` is easiest

7. **Initialize submodules when cloning** - Use `git clone --recurse-submodules` or run `git submodule update --init --recursive`

---

### CSS Override Strategy

**The Problem:**
- Hugo themes come with their own CSS
- Console theme uses `.terminal` class extensively
- Your custom CSS might not override these styles

**The Solution:**
- Use more specific selectors (like `.terminal table td`)
- Add `!important` when needed
- Test with browser inspector (F12) to see which styles win

---

### GitHub Pages Limitations

**Free tier:**
- ✅ Public repos get free Pages
- ❌ Private repos don't (unless GitHub Pro)
- ✅ Custom domains supported
- ✅ HTTPS automatically provided
- ❌ No server-side processing (static only)
- ✅ Unlimited bandwidth

**Pro tier ($4/month):**
- ✅ Private repo with Pages
- Website is still publicly accessible
- Only source code is hidden

---

## Resources

### Official Documentation
- **Hugo:** https://gohugo.io/documentation/
- **Hugo Themes:** https://themes.gohugo.io/
- **GitHub Pages:** https://docs.github.com/en/pages
- **Markdown Guide:** https://www.markdownguide.org/

### Community Support
- **Hugo Forum:** https://discourse.gohugo.io/
- **Hugo GitHub:** https://github.com/gohugoio/hugo

### Helpful Tools
- **VS Code:** https://code.visualstudio.com/
- **GitHub Desktop:** https://desktop.github.com/
- **TinyPNG:** https://tinypng.com/
- **DNS Checker:** https://dnschecker.org/

---

**Last Updated:** October 31, 2025
