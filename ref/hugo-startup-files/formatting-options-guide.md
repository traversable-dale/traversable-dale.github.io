# Project Template Formatting Options

This document shows three different ways to format your project metadata. Choose the one you like best!

---

## Option 1: Single Column Table (Most Compact)

| | |
|---|---|
| **Role** | [Your Role Title] |
| **Client** | [Client Name](https://clientwebsite.com) |
| **Associated** | [Studio/Company Name](https://studiowebsite.com) |
| **Team** | [Team Member 1, Team Member 2, Team Member 3] |
| **Location** | [City, State/Country] |
| **Date** | [Month Year] |

**Pros:**
- Very compact and organized
- Easy to scan
- All info aligned nicely
- Works well on mobile

**CSS to make it tighter:**
```css
article table {
  font-size: 0.85em;
  line-height: 1.3;
}
```

---

## Option 2: Two-Column Table (Ultra Compact)

| | | | |
|---|---|---|---|
| **Role** | [Your Role Title] | **Client** | [Client Name](https://clientwebsite.com) |
| **Associated** | [Studio Name](https://studiowebsite.com) | **Team** | [Team Member 1, Team Member 2] |
| **Location** | [City, Country] | **Date** | [Month Year] |

**Pros:**
- Takes up less vertical space
- Puts more info above the fold
- Modern look

**Cons:**
- Can be cramped on mobile
- Harder to read if team names are long

---

## Option 3: Styled Div with Line Breaks

<div style="font-size: 0.9em; line-height: 1.4; padding: 1em; background: #f5f5f5; border-left: 3px solid #333;">

**Role:** [Your Role Title]  
**Client:** [Client Name](https://clientwebsite.com)  
**Associated:** [Studio/Company Name](https://studiowebsite.com)  
**Team:** [Team Member 1, Team Member 2, Team Member 3]  
**Location:** [City, State/Country]  
**Date:** [Month Year]

</div>

**Pros:**
- Visual distinction with background color
- Clean and simple
- Easy to read

**Cons:**
- Takes up more vertical space than tables
- Inline styles aren't ideal (better to use CSS classes)

---

## Option 4: Minimal List Format

<div style="font-size: 0.85em; line-height: 1.5;">

**Role:** [Your Role Title] | **Client:** [Client Name](https://clientwebsite.com) | **Location:** [City, Country]  
**Team:** [Team Member 1, Team Member 2, Team Member 3] | **Date:** [Month Year]

</div>

**Pros:**
- Ultra compact
- Modern, minimalist
- Fits on 2 lines

**Cons:**
- Can be harder to scan quickly
- May look cluttered with long names

---

## My Recommendation: Option 1 (Single Column Table)

The single column table gives you:
- ✅ Professional appearance
- ✅ Easy to scan and read
- ✅ Works perfectly on mobile
- ✅ Clean alignment
- ✅ Easy to update

Just add this CSS to make it more compact:

```css
/* Add to assets/css/custom.css */
article table {
  font-size: 0.85em;
  line-height: 1.3;
  margin-bottom: 2em;
}

article table td {
  padding: 0.3em 0.5em;
}

article table td:first-child {
  font-weight: 600;
  color: #666;
}
```

---

## Image Placeholder Structure

Your project folder structure should look like this:

```
static/
└── images/
    └── projects/
        └── project-name/
            ├── hero.jpg           (main project image)
            ├── detail-1.jpg       (process or detail shot)
            └── installation.jpg   (final result)
```

In your markdown, reference them like:

```markdown
![Project Hero Image](/images/projects/project-name/hero.jpg)
*Main image showing the project in action*

![Detail View](/images/projects/project-name/detail-1.jpg)
*Close-up or process view of key feature*

![Final Installation](/images/projects/project-name/installation.jpg)
*Final result or completed installation*
```

---

## Quick Start: Copy This Template

```markdown
---
title: "Project Name"
date: 2025-10-31
draft: false
---

| | |
|---|---|
| **Role** | Your Role |
| **Client** | [Client Name](https://link.com) |
| **Associated** | [Studio Name](https://link.com) |
| **Team** | Person 1, Person 2, Person 3 |
| **Location** | City, Country |
| **Date** | Month Year |

---

## Overview

"Quote from client or event description" - Source

Brief introduction paragraph.

![Hero Image](/images/projects/project-name/hero.jpg)
*Main project caption*

## Project Description

Main description paragraphs...

![Detail Image](/images/projects/project-name/detail.jpg)
*Detail caption*

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

Results and impact...

## Acknowledgments

Special thanks to...
```
