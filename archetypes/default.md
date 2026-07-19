---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: {{ .Date }}
draft: true
# One sentence, shown on /resources/. Say what the page does.
summary: ""
# hugo | system | research | experiment   (leave empty for non-resource pages)
resource_group: ""
# Pick terms from data/keywords.yaml. Add new terms THERE first —
# any tag not listed there raises a build warning.
tags: []
---

Do not add an `# H1` here. The theme renders the `title` above as the page
heading; start the body at `##`.
