### Checklist PDF

Builds print-ready A4 PDFs from the checklist markdown files: [publishing-checklist](../../Markdown/publishing-checklist.md) and its Russian copy [publishing-checklist-russian](../../Markdown/publishing-checklist-russian.md).

| File | Purpose |
| --- | --- |
| `build.mjs` | Turns the markdown into a styled HTML page and prints it to PDF with headless Chrome or Edge |
| `Assets/MirraGames.png` | Company logo on the cover, skipped with a warning if missing |
| `Output/` | Generated HTML and PDF, ignored by git |
| `../../CHANGELOG.md` | Its first heading supplies the version on the cover, skipped with a warning if missing |

### Usage

Requires Node.js 18 or newer and Chrome or Edge 131 or newer, which added the page margin boxes used for page numbers. The fonts load from Google Fonts, so the build needs internet.

```bash
node Tools/PrintPDF/build.mjs
```

With no arguments it renders both checklists, English and Russian, into `Tools/PrintPDF/Output/`. Pass a markdown file, its language and an output folder to render something else:

```bash
node Tools/PrintPDF/build.mjs path/to/checklist.md --language ru --output path/to/output
```

### Languages

Text that the script adds itself, such as "How to read" and the check count, comes from `LANGUAGES` in `build.mjs`. It has `en` and `ru` today. The same table holds the words the script looks for in the markdown, so they must match it exactly:

| Key | English | Russian |
| --- | --- | --- |
| `platformSpecific` | `**Platform-specific**` | `**Для отдельных площадок**` |
| `automatable` | `**Can be automated**` | `**Можно автоматизировать**` |
| `optional` | `(Optional)` | `(Опционально)` |
| `markers` | `Auto test`, `Ask AI` | `Автотест`, `Спросить ИИ` |

### Markdown it understands

The script reads only the subset the checklists use:

1. `# Title`, an intro paragraph and a numbered list for the cover page.
2. A quote block before the first section, shown as a notice on the cover. A first line such as `> [!WARNING]` sets its kind, as in GitHub alerts.
3. `## A. Section` headings, and a heading without a letter, such as `## Sources`, for a plain section. A trailing `(Optional)` becomes a chip.
4. `- [ ] **A1.** Text` items, with an optional `**Platform, Platform:**` prefix that becomes colored tags. Each name must exist in `PLATFORMS` in `build.mjs`, which also sets the tag colors and the platforms shown on the cover.
5. An automation marker in backticks between the number and the text, such as `Auto test` or `Ask AI`. Marked items belong under the `**Can be automated**` label, and the script warns when a marker and the label disagree.
6. Indented `- Unity: hint` lines under an item.
7. `**Label**` lines that group items, with an optional note in parentheses after them. The note `(Optional)` becomes a chip.
8. A "Checked on" line in English or "Проверено" in Russian, whose date goes onto the cover.
