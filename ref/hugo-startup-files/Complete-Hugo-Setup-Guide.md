# Hugo + GitHub Pages Complete Setup Guide

## Complete File Templates & Instructions

All personal information has been removed and replaced with placeholders.

---

## Table of Contents

1. [Quick Start Commands](#quick-start)
2. [File Templates](#file-templates)
3. [Folder Structure](#folder-structure)
4. [Troubleshooting](#troubleshooting)
5. [Daily Workflow](#daily-workflow)

---

## Quick Start

### Complete Setup Sequence

```bash
# 1. Install Hugo
brew install hugo  # macOS

# 2. Create site
hugo new site my-website
cd my-website

# 3. Initialize Git (MUST DO FIRST!)
git init

# 4. Add theme
git submodule add https://github.com/mrmierzejewski/hugo-theme-console.git themes/hugo-theme-console

# 5. Create custom homepage layout
mkdir -p layouts
cat > layouts/index.html << 'EOF'
{{ define "main" }}
<h1>{{ .Site.Title }}</h1>

{{ .Content }}

{{ end }}
EOF

# 6. Create content pages
hugo new _index.md
hugo new about.md
hugo new work.md
hugo new projects/project-1.md

# 7. Setup custom CSS
mkdir -p layouts/partials static/css
cat > layouts/partials/header.html << 'EOF'
<link rel="stylesheet" href="/css/custom.css">
EOF

# 8. Create image folders
mkdir -p static/images/projects/project-1

# 9. Test locally
hugo serve -D

# 10. Setup GitHub
gh auth login
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main

# 11. Setup GitHub Actions
mkdir -p .github/workflows
# Create hugo.yml (see file templates below)

git add .github/
git commit -m "Add GitHub Actions"
git push

# 12. Enable GitHub Pages
# Go to Settings → Pages → Source: GitHub Actions
```

---

## File Templates

### hugo.toml

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

### layouts/index.html

```html
{{ define "main" }}
<h1>{{ .Site.Title }}</h1>

{{ .Content }}

{{ end }}
```

### layouts/partials/header.html

```html
<link rel="stylesheet" href="/css/custom.css">
```

### content/_index.md (Homepage)

```markdown
---
title: "Your Name"
date: 2025-10-31
draft: false
---

Creative Technologist based in [Your City], specializing in [specialization 1], [specialization 2], and [specialization 3].

## Recent Projects

<div class="projects-grid">
  <div class="project-item">
    <a href="/projects/project-1/">
      <img src="/images/projects/project-1/thumbnail.jpg" alt="Project 1">
      <strong>Project 1 Title</strong>
    </a>
  </div>
  
  <div class="project-item">
    <a href="/projects/project-2/">
      <img src="/images/projects/project-2/thumbnail.jpg" alt="Project 2">
      <strong>Project 2 Title</strong>
    </a>
  </div>
  
  <div class="project-item">
    <a href="/projects/project-3/">
      <img src="/images/projects/project-3/thumbnail.jpg" alt="Project 3">
      <strong>Project 3 Title</strong>
    </a>
  </div>
  
  <div class="project-item">
    <a href="/projects/project-4/">
      <img src="/images/projects/project-4/thumbnail.jpg" alt="Project 4">
      <strong>Project 4 Title</strong>
    </a>
  </div>
  
  <div class="project-item">
    <a href="/projects/project-5/">
      <img src="/images/projects/project-5/thumbnail.jpg" alt="Project 5">
      <strong>Project 5 Title</strong>
    </a>
  </div>
  
  <div class="project-item">
    <a href="/projects/project-6/">
      <img src="/images/projects/project-6/thumbnail.jpg" alt="Project 6">
      <strong>Project 6 Title</strong>
    </a>
  </div>
</div>

---

[View on GitHub](https://github.com/yourusername)
```

### content/about.md

```markdown
---
title: "About"
date: 2025-10-31
draft: false
---

![Your Name](/images/your-photo.jpg)

## Hi! I'm [Your Name].

I am a [Your Profession] based in [Your City], specializing in [specialization 1], [specialization 2], and [specialization 3].

Coming from a background in [background 1], [background 2], and [background 3], I have developed a unique passion for [your main passion/tool/field].

If you'd like to get in touch, I'd love to hear from you!

**YOUR-EMAIL@EXAMPLE.COM**

---

## My Skills

[Skill 1](https://link1.com) • [Skill 2](https://link2.com) • [Skill 3](https://link3.com) • [Skill 4](https://link4.com) • [Skill 5](https://link5.com) • [Skill 6](https://link6.com) • Skill 7 • Skill 8 • Skill 9 • Skill 10 • Skill 11 • Skill 12

**Specializations:** Specialization 1 • Specialization 2 • Specialization 3 • Specialization 4 • Specialization 5
```

### content/work.md

```markdown
---
title: "Work"
date: 2025-10-31
draft: false
---

## 2025

- [Project Name 1](/projects/project-1/) - Brief description
- [Project Name 2](/projects/project-2/) - Brief description

## 2024

- [Project Name 3](/projects/project-3/) - Brief description
- [Project Name 4](/projects/project-4/) - Brief description
- [Project Name 5](/projects/project-5/) - Brief description
```

### content/projects/project-template.md

```markdown
---
title: "Project Name"
date: 2025-10-31
draft: false
---

| | |
|---|---|
| **Role** | Your Role Title |
| **Client** | [Client Name](https://link.com) |
| **Associated** | [Studio/Company Name](https://link.com) |
| **Team** | Person 1, Person 2, Person 3 |
| **Location** | City, Country |
| **Date** | Month Year |

---

## Overview

"Optional quote or description" - Source

Brief introduction paragraph.

![Hero Image](/images/projects/project-name/hero.jpg)
*Main image caption*

## Project Description

Detailed description paragraphs...

![Detail Image](/images/projects/project-name/detail.jpg)
*Detail view caption*

More description...

## Technology Stack

- Technology 1
- Technology 2
- Technology 3

## Key Features

- Feature 1
- Feature 2
- Feature 3

![Result Image](/images/projects/project-name/result.jpg)
*Final result caption*

## Outcomes

Results, impact, reception...

## Acknowledgments

Thanks to collaborators and team members...
```

### .github/workflows/hugo.yml

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

### static/css/custom.css

See the separate custom.css file for complete styling with:
- Dark theme (black background, white text)
- Neon orange links
- 2x3 project grid
- Compact project metadata tables
- Responsive mobile layout

---

## Folder Structure

```
my-website/
├── .github/
│   └── workflows/
│       └── hugo.yml
├── content/
│   ├── _index.md
│   ├── about.md
│   ├── work.md
│   └── projects/
│       ├── project-1.md
│       ├── project-2.md
│       └── project-3.md
├── layouts/
│   ├── index.html
│   └── partials/
│       └── header.html
├── static/
│   ├── css/
│   │   └── custom.css
│   └── images/
│       ├── your-photo.jpg
│       └── projects/
│           ├── project-1/
│           │   ├── thumbnail.jpg
│           │   ├── hero.jpg
│           │   └── detail.jpg
│           ├── project-2/
│           │   └── thumbnail.jpg
│           └── project-3/
│               └── thumbnail.jpg
├── themes/
│   └── hugo-theme-console/
├── hugo.toml
└── .git/
```

---

## Troubleshooting

### "fatal: not a git repository"
**Cause:** Trying to add theme before `git init`  
**Solution:** Always run `git init` BEFORE `git submodule add`

### "Invalid username or token" when pushing
**Cause:** GitHub requires Personal Access Token  
**Solution:** 
```bash
brew install gh
gh auth login
# Choose HTTPS, Yes, Login with browser
```

### Homepage shows old content
**Cause:** Theme's default layout overriding your content  
**Solution:** Create `layouts/index.html` with custom layout

### Project grid not showing (images stack)
**Cause:** Hugo stripping HTML or CSS not loading  
**Solution:** Add `unsafe = true` to hugo.toml markup section

### Custom CSS not loading
**Cause:** Console theme needs specific file  
**Solution:** Create `layouts/partials/header.html` (NOT extended_head.html!)

### Table text is gray
**Cause:** Theme's default styles overriding  
**Solution:** Add `.terminal` selector override to CSS

### Images not appearing
**Solutions:**
- Move images to static/ folder (not content/)
- Use paths starting with / (e.g., /images/...)
- Check filenames match exactly (case-sensitive)
- Verify files were committed and pushed

### 404 after deployment
**Solutions:**
- Check repo is Public
- Verify Pages source is "GitHub Actions"
- Check Actions tab for errors
- Ensure draft: false in content
- Push any change to trigger rebuild

---

## Daily Workflow

```bash
# 1. Edit content locally
# 2. Test
hugo serve -D

# 3. When ready, set draft: false in front matter
# 4. Commit and push
git add .
git commit -m "Add new project"
git push

# 5. GitHub Actions automatically deploys (2-3 min)
```

### Adding New Project

```bash
# Create project page
hugo new projects/new-project.md

# Add images
# Put images in: static/images/projects/new-project/

# Fill in template
# Edit the .md file with project details

# Update homepage
# Edit content/_index.md to add grid item

# Update work page
# Edit content/work.md to add to list

# Test, commit, push
hugo serve -D
git add .
git commit -m "Add new project"
git push
```

---

## Key Learnings

1. **Always `git init` before adding theme** - Most common beginner error
2. **Console theme needs `header.html` not `extended_head.html`** for CSS
3. **Add `unsafe = true` to hugo.toml** to allow HTML in markdown
4. **Create `layouts/index.html`** to override theme's homepage
5. **Images must be in `static/` folder** not `content/`
6. **Use GitHub CLI (`gh auth login`)** for easy authentication
7. **Theme's `.terminal` class overrides colors** - add specific CSS overrides
8. **GitHub Pages requires Public repo** on free plan

---

## Resources

- **Hugo Docs:** https://gohugo.io/documentation/
- **Hugo Themes:** https://themes.gohugo.io/
- **GitHub Pages:** https://docs.github.com/en/pages
- **Hugo Forum:** https://discourse.gohugo.io/
- **Markdown Guide:** https://www.markdownguide.org/

---

Created: October 31, 2025  
All examples use placeholder information
