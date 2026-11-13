### Checklist PDF

Builds print-ready A4 PDFs from checklist markdown files: [publishing-checklist](../platforms/publishing-checklist.md) and its Russian copy [publishing-checklist-russian](../platforms/publishing-checklist-russian.md). The folder is hidden from Obsidian and from the docs website.

| File | Purpose |
| --- | --- |
| `build.mjs` | Turns the markdown into a styled HTML page and prints it to PDF with headless Chrome or Edge |
| `out/` | Generated HTML and PDF, ignored by git |
| `../pictures/MirraGames.png` | Company logo on the cover, skipped with a warning if missing |

### Usage

Requires Node.js 18 or newer and Chrome or Edge 131 or newer, which added the page margin boxes used for page numbers. The fonts load from Google Fonts, so the build needs internet.

```bash
node .pdf/build.mjs
```

With no arguments it renders both checklists, English and Russian, into `.pdf/out/`. Pass a markdown file, its language and an output folder to render something else:

```bash
node .pdf/build.mjs path/to/checklist.md --language ru --output path/to/output
```

### Languages

Text that the script adds itself, such as "How to read" and the check count, comes from `LANGUAGES` in `build.mjs`. It has `en` and `ru` today. Group labels in the markdown must match its `platformSpecific` value to get the accent color: `**Platform-specific**` in English, `**Для отдельных площадок**` in Russian.

### Markdown it understands

The script reads only the subset the checklists use:

1. `# Title`, an intro paragraph and a numbered list for the cover page.
2. `## A. Section` headings, and a heading without a letter, such as `## Sources`, for a plain section.
3. `- [ ] **A1.** Text` items, with an optional `**Platform, Platform:**` prefix that becomes colored tags. Each name must exist in `PLATFORMS` in `build.mjs`, which also sets the tag colors and the platforms shown on the cover.
4. Indented `- Unity: hint` lines under an item.
5. `**Label**` lines that group items, with an optional note in parentheses after them.
6. A "Checked on" line in English or "Проверено" in Russian, whose date goes onto the cover.
