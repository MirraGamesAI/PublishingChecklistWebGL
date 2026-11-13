#!/usr/bin/env node
// Renders checklist markdown files into print-ready HTML pages and A4 PDFs with headless Chrome or Edge.
// Usage: node build.mjs [checklist.md] [--language en|ru] [--output folder]
// With no file it builds every document in DEFAULT_DOCUMENTS into ./Output next to this script.

import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath, pathToFileURL } from "node:url"

const BRAND = "Mirra Games"
const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))
const REPOSITORY_DIRECTORY = path.resolve(SCRIPT_DIRECTORY, "..", "..")
const MARKDOWN_DIRECTORY = path.join(REPOSITORY_DIRECTORY, "Markdown")
const CHANGELOG_PATH = path.join(REPOSITORY_DIRECTORY, "CHANGELOG.md")
const LOGO_PATH = path.join(SCRIPT_DIRECTORY, "Assets", "MirraGames.png")
const DEFAULT_OUTPUT = path.join(SCRIPT_DIRECTORY, "Output")
const BROWSER_TIMEOUT_MILLISECONDS = 120000

const DEFAULT_DOCUMENTS = [
  { markdown: path.join(MARKDOWN_DIRECTORY, "publishing-checklist.md"), language: "en" },
  { markdown: path.join(MARKDOWN_DIRECTORY, "publishing-checklist-russian.md"), language: "ru" },
]

/** Interface text per language. The markdown supplies everything else. Markers map each automation hint to its CSS class suffix. */
const LANGUAGES = {
  en: {
    howToRead: "How to read",
    sections: "Sections",
    platformSpecific: "Platform-specific",
    automatable: "Can be automated",
    automatableCount: "can be automated",
    markers: { "Auto test": "auto-test", "Ask AI": "ask-ai" },
    optional: "Optional",
    version: "Version",
    checkedOn: "Checked on",
    checkForms: { one: "check", other: "checks" },
    sectionForms: { one: "section", other: "sections" },
  },
  ru: {
    howToRead: "Как читать",
    sections: "Разделы",
    platformSpecific: "Для отдельных площадок",
    automatable: "Можно автоматизировать",
    automatableCount: "можно автоматизировать",
    markers: { "Автотест": "auto-test", "Спросить ИИ": "ask-ai" },
    optional: "Опционально",
    version: "Версия",
    checkedOn: "Проверено",
    checkForms: { one: "проверка", few: "проверки", many: "проверок", other: "проверки" },
    sectionForms: { one: "раздел", few: "раздела", many: "разделов", other: "раздела" },
  },
}

/** Short platform names used in the checklist, in cover order, with CSS class suffixes, full names and tag colors. */
const PLATFORMS = {
  CoolMath: { key: "cool-math", fullName: "CoolMath", background: "#def5f1", color: "#0f766e" },
  CrazyGames: { key: "crazy-games", fullName: "CrazyGames", background: "#f2e8fd", color: "#7a2bc4" },
  GameDistribution: { key: "game-distribution", fullName: "GameDistribution", background: "#e9ecfb", color: "#2f45b5" },
  GamePix: { key: "game-pix", fullName: "GamePix", background: "#e3f5e8", color: "#1e7a3c" },
  Lagged: { key: "lagged", fullName: "Lagged", background: "#eceff3", color: "#475467" },
  OK: { key: "ok", fullName: "OK", background: "#fff0e0", color: "#b54708" },
  Playgama: { key: "playgama", fullName: "Playgama", background: "#fde8f1", color: "#b0306a" },
  Poki: { key: "poki", fullName: "Poki", background: "#dff3fa", color: "#0e6f8e" },
  VK: { key: "vk", fullName: "VK", background: "#e2f0ff", color: "#0b63c4" },
  "WG Playground": { key: "wg-playground", fullName: "WG Playground", background: "#f3ece4", color: "#7a5230" },
  Y8: { key: "y8", fullName: "Y8", background: "#eef5dc", color: "#567a0f" },
  Yandex: { key: "yandex", fullName: "Yandex Games", background: "#fdf3d3", color: "#8a5d00" },
  YouTube: { key: "youtube", fullName: "YouTube Playables", background: "#fdeceb", color: "#b42318" },
}

const BROWSER_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/microsoft-edge",
]

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function escapeCssString(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function formatCount(language, count, forms) {
  const category = new Intl.PluralRules(language).select(count)
  return `${count} ${forms[category] ?? forms.other}`
}

/** Converts the inline markdown used by the checklist: code spans, bold and links. With strings, a code span that names a marker becomes its tag. */
function renderInline(text, strings = null) {
  const codeSpans = []
  let html = escapeHtml(text).replace(/`([^`]+)`/g, (_, code) => {
    codeSpans.push(code)
    return `@@CODE${codeSpans.length - 1}@@`
  })
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return html.replace(/@@CODE(\d+)@@/g, (_, index) => {
    const code = codeSpans[Number(index)]
    return strings && Object.hasOwn(strings.markers, code) ? renderMarker(code, strings) : `<code>${code}</code>`
  })
}

/** Splits a leading "`Marker`" code span off an item's text when it names a known automation marker. */
function splitMarker(text, strings) {
  const match = /^`([^`]+)` (.+)$/.exec(text)
  if (!match || !Object.hasOwn(strings.markers, match[1])) return { marker: "", text }
  return { marker: match[1], text: match[2] }
}

/** Splits a leading "**Platform, Platform:**" prefix off an item's text. */
function splitPlatforms(text) {
  const match = /^\*\*([^*]+):\*\* (.+)$/.exec(text)
  if (!match) return { platforms: [], text }
  const names = match[1].split(",").map((name) => name.trim())
  if (!names.every((name) => name in PLATFORMS)) {
    console.warn(`Unknown platform in "${match[1]}". Add it to PLATFORMS to get a colored tag.`)
    return { platforms: [], text }
  }
  return { platforms: names, text: match[2] }
}

/** Splits a trailing "(Optional)" mark off a section title. */
function splitOptional(title, strings) {
  const suffix = ` (${strings.optional})`
  return title.endsWith(suffix) ? { title: title.slice(0, -suffix.length), optional: true } : { title, optional: false }
}

function appendToList(blocks, entry) {
  const last = blocks[blocks.length - 1]
  if (last?.type === "list") last.entries.push(entry)
  else blocks.push({ type: "list", entries: [entry] })
}

/** Parses the checklist's markdown subset into a title, notices, intro, guide and sections. */
function parseChecklist(markdown, strings) {
  const checklist = { title: "", notices: [], lead: [], guide: [], sections: [] }
  let section = null
  let lastItem = null
  let notice = null
  let automatable = false

  for (const rawLine of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trimEnd()
    let match

    // A quote block is a notice. A first line like "[!WARNING]" sets its kind, as in GitHub alerts.
    if ((match = /^> ?(.*)$/.exec(line))) {
      const kind = /^\[!([A-Za-z]+)\]$/.exec(match[1])
      if (kind || !notice) {
        notice = { type: "notice", kind: kind ? kind[1].toLowerCase() : "note", lines: [] }
        if (section) section.blocks.push(notice)
        else checklist.notices.push(notice)
      }
      if (!kind && match[1]) notice.lines.push(match[1])
      lastItem = null
      continue
    }
    notice = null
    if (!line.trim()) continue

    if ((match = /^# (.+)$/.exec(line))) {
      checklist.title = match[1]
    } else if ((match = /^## (?:([A-Z])\. )?(.+)$/.exec(line))) {
      section = { letter: match[1] ?? "", ...splitOptional(match[2], strings), blocks: [], itemCount: 0, automatableCount: 0 }
      checklist.sections.push(section)
      lastItem = null
      automatable = false
    } else if ((match = /^- \[ \] \*\*([A-Z]\d+)\.\*\* (.+)$/.exec(line)) && section) {
      const { marker, text } = splitMarker(match[2], strings)
      if (automatable !== Boolean(marker)) {
        console.warn(`${match[1]} ${automatable ? "has no marker inside" : "has a marker outside"} the "${strings.automatable}" block.`)
      }
      lastItem = { type: "item", id: match[1], marker, hints: [], ...splitPlatforms(text) }
      section.blocks.push(lastItem)
      section.itemCount++
      if (marker) section.automatableCount++
    } else if ((match = /^\s+- (.+)$/.exec(line)) && lastItem) {
      lastItem.hints.push(match[1])
    } else if ((match = /^\*\*(.+?)\*\*(?: \((.+)\))?$/.exec(line)) && section) {
      const optional = match[2] === strings.optional
      section.blocks.push({ type: "label", text: match[1], note: optional ? "" : match[2] ?? "", optional })
      automatable = match[1] === strings.automatable
      lastItem = null
    } else if ((match = /^\d+\. (.+)$/.exec(line))) {
      if (section) appendToList(section.blocks, match[1])
      else checklist.guide.push(match[1])
    } else {
      if (section) section.blocks.push({ type: "paragraph", text: line })
      else checklist.lead.push(line)
      lastItem = null
    }
  }
  return checklist
}

function renderTag(name) {
  return `<span class="tag tag-${PLATFORMS[name].key}">${escapeHtml(name)}</span>`
}

function renderHint(hint) {
  const match = /^(Unity): (.+)$/.exec(hint)
  if (!match) return `<p class="hint">${renderInline(hint)}</p>`
  return `<p class="hint"><span class="hint-label">${match[1]}</span>${renderInline(match[2])}</p>`
}

function renderMarker(name, strings) {
  return `<span class="marker marker-${strings.markers[name]}">${escapeHtml(name)}</span>`
}

function renderOptional(strings) {
  return `<span class="optional">${escapeHtml(strings.optional)}</span>`
}

function renderNotice(notice) {
  return `<aside class="notice notice-${notice.kind}">${notice.lines.map((line) => `<p>${renderInline(line)}</p>`).join("")}</aside>`
}

function renderBlock(block, strings) {
  switch (block.type) {
    case "notice":
      return renderNotice(block)
    case "item":
      return `<div class="item">
  <span class="box"></span>
  <span class="id">${block.id}</span>
  <div class="text"><p>${block.marker ? renderMarker(block.marker, strings) : ""}${block.platforms.map(renderTag).join("")}${renderInline(block.text)}</p>${block.hints.map(renderHint).join("")}</div>
</div>`
    case "label": {
      const modifier = block.text === strings.platformSpecific ? " label-platform" : block.text === strings.automatable ? " label-automatable" : ""
      const note = block.note ? `<span class="label-note">${renderInline(block.note)}</span>` : ""
      const optional = block.optional ? renderOptional(strings) : ""
      return `<div class="label${modifier}">${escapeHtml(block.text)}${optional}${note}</div>`
    }
    case "list":
      return `<ol class="sources">${block.entries.map((entry) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(entry)
        if (!link) return `<li>${renderInline(entry)}</li>`
        return `<li><a href="${escapeHtml(link[2])}">${escapeHtml(link[1])}</a><span class="url">${escapeHtml(link[2])}</span></li>`
      }).join("")}</ol>`
    default:
      return `<p class="paragraph">${renderInline(block.text)}</p>`
  }
}

function sectionAnchor(section, index) {
  return `section-${section.letter ? section.letter.toLowerCase() : index + 1}`
}

function renderSection(section, index, strings) {
  const letter = section.letter ? `<span class="letter">${section.letter}</span>` : ""
  return `<section class="section${section.letter ? "" : " section-plain"}" id="${sectionAnchor(section, index)}">
<h2>${letter}<span>${escapeHtml(section.title)}</span>${section.optional ? renderOptional(strings) : ""}</h2>
${section.blocks.map((block) => renderBlock(block, strings)).join("\n")}
</section>`
}

/** Reads the logo as a data URI, so the HTML stays self-contained. Returns an empty string if it is missing. */
function readLogo() {
  try {
    return `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString("base64")}`
  } catch {
    console.warn(`Logo not found, building without it: ${LOGO_PATH}`)
    return ""
  }
}

/** Reads the version from the changelog's first heading, such as "# Name 1.2.3". Returns an empty string if there is none. */
function readVersion() {
  try {
    const heading = /^# .*$/m.exec(fs.readFileSync(CHANGELOG_PATH, "utf8"))
    return /(\d+\.\d+\.\d+)\s*$/.exec(heading?.[0] ?? "")?.[1] ?? ""
  } catch {
    console.warn(`Changelog not found, building without a version: ${CHANGELOG_PATH}`)
    return ""
  }
}

function renderCover(checklist, language, branding) {
  const strings = LANGUAGES[language]
  const checkedOn = findCheckedOnDate(checklist, strings)
  const lettered = checklist.sections.filter((section) => section.letter)
  const itemTotal = lettered.reduce((sum, section) => sum + section.itemCount, 0)
  const automatableTotal = lettered.reduce((sum, section) => sum + section.automatableCount, 0)
  const chips = Object.values(PLATFORMS)
    .map((platform) => `<span class="chip tag-${platform.key}">${escapeHtml(platform.fullName)}</span>`)
    .join("")
  const contents = checklist.sections
    .map((section, index) => section.letter
      ? `<a href="#${sectionAnchor(section, index)}"><span class="letter letter-small">${section.letter}</span><span class="contents-title">${escapeHtml(section.title)}${section.optional ? renderOptional(strings) : ""}</span><span class="contents-count">${section.itemCount}</span></a>`
      : "")
    .join("")
  const meta = [
    branding.version ? `${strings.version} ${branding.version}` : "",
    formatCount(language, itemTotal, strings.checkForms),
    automatableTotal ? `${automatableTotal} ${strings.automatableCount}` : "",
    formatCount(language, lettered.length, strings.sectionForms),
    checkedOn ? `${strings.checkedOn} ${checkedOn}` : "",
  ].filter(Boolean)

  return `<header class="cover">
  ${branding.logo ? `<img class="logo" src="${branding.logo}" alt="${escapeHtml(BRAND)}">` : ""}
  <div class="brand">${escapeHtml(BRAND)}</div>
  <h1>${escapeHtml(checklist.title)}</h1>
  ${checklist.notices.map(renderNotice).join("\n  ")}
  ${checklist.lead.map((line) => `<p class="lead">${renderInline(line)}</p>`).join("")}
  <div class="chips">${chips}</div>
  <div class="meta">${meta.map((entry) => `<span>${escapeHtml(entry)}</span>`).join("")}</div>
  <div class="cover-bottom">
    <div class="block-title">${escapeHtml(strings.howToRead)}</div>
    <ol class="guide">${checklist.guide.map((line) => `<li><span>${renderInline(line, strings)}</span></li>`).join("")}</ol>
    <div class="block-title">${escapeHtml(strings.sections)}</div>
    <nav class="contents" style="grid-template-rows: repeat(${Math.ceil(lettered.length / 2)}, auto)">${contents}</nav>
  </div>
</header>`
}

function renderStyles(title) {
  const footerFont = 'font: 500 7pt Inter, "Segoe UI", sans-serif; color: #8a94a2;'
  return `
@page {
  size: A4;
  margin: 16mm 15mm 17mm 15mm;
  @bottom-left { content: "${escapeCssString(BRAND)}"; ${footerFont} font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  @bottom-center { content: "${escapeCssString(title)}"; ${footerFont} }
  @bottom-right { content: counter(page) " / " counter(pages); ${footerFont} }
}
@page :first {
  @bottom-center { content: none; }
}
:root {
  --ink: #1b2430;
  --body: #2f3a48;
  --muted: #6b7685;
  --line: #e6e9ee;
  --accent: #284b63;
  --accent-soft: #eaf0f4;
  --panel: #f5f7f9;
}
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: #ffffff; color: var(--body); font-family: Inter, "Segoe UI", sans-serif; font-size: 9.4pt; line-height: 1.45; }
a { color: var(--accent); text-decoration: none; }
code { font-family: "JetBrains Mono", Consolas, monospace; font-size: 0.86em; background: var(--panel); border: 1px solid var(--line); border-radius: 4px; padding: 0 4px; color: var(--ink); }
strong { color: var(--ink); font-weight: 600; }

.cover { height: 262mm; display: flex; flex-direction: column; break-after: page; padding-top: 8mm; }
/* The mark has transparent padding inside the image, so the negative margin lines its left edge up with the text. */
.logo { display: block; width: 24mm; height: 24mm; margin: 0 0 7mm -4.4mm; }
.brand { font-size: 8pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
h1 { margin: 10px 0 14px; font-size: 30pt; line-height: 1.08; letter-spacing: -0.025em; color: var(--ink); font-weight: 700; max-width: 160mm; }
.notice { margin: 10px 0 12px; padding: 9px 14px; border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; background: var(--accent-soft); color: var(--ink); font-size: 9.4pt; line-height: 1.45; break-inside: avoid; }
.notice p { margin: 0; }
.notice p + p { margin-top: 4px; }
.notice-warning, .notice-caution { border-left-color: #d97706; background: #fff4e0; }
.notice-warning strong, .notice-caution strong { color: #8a4b00; }
.cover .notice { margin: 0 0 14px; max-width: 165mm; }
.lead { margin: 0 0 6px; font-size: 11pt; line-height: 1.5; color: var(--body); max-width: 155mm; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0 12px; }
.chip { font-size: 8pt; font-weight: 600; padding: 4px 11px; border-radius: 999px; }
.meta { display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: 8.5pt; color: var(--muted); }
.meta span + span { padding-left: 18px; border-left: 1px solid var(--line); }
.cover-bottom { margin-top: auto; }
.block-title { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin: 0 0 8px; }
.guide { list-style: none; counter-reset: guide; margin: 0 0 22px; padding: 12px 14px; background: var(--panel); border-radius: 10px; }
.guide li { counter-increment: guide; display: grid; grid-template-columns: 22px 1fr; align-items: start; font-size: 9.5pt; padding: 3px 0; }
.guide li::before { content: counter(guide); width: 16px; height: 16px; border-radius: 50%; background: var(--accent); color: #ffffff; font-size: 7.5pt; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
.contents { display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-flow: column; gap: 0 22px; }
.contents a { display: flex; align-items: center; gap: 9px; padding: 5px 0; border-bottom: 1px solid var(--line); color: var(--ink); font-size: 9.5pt; }
.contents-title { flex: 1; }
.contents-count { color: var(--muted); font-size: 8pt; font-variant-numeric: tabular-nums; }

.section { margin: 0 0 16px; }
.section h2 { display: flex; align-items: center; gap: 10px; margin: 0 0 4px; padding: 10px 0 8px; border-bottom: 2px solid var(--accent); font-size: 13.5pt; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; break-after: avoid; }
.letter { flex: none; width: 24px; height: 24px; border-radius: 6px; background: var(--accent); color: #ffffff; display: inline-flex; align-items: center; justify-content: center; font-size: 11pt; font-weight: 700; }
.letter-small { width: 18px; height: 18px; border-radius: 5px; font-size: 8pt; }
.label { margin: 12px 0 0; padding: 0 0 4px; font-size: 7.2pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); break-after: avoid; }
.label-platform { color: var(--accent); }
.label-automatable { margin-top: 14px; padding-top: 8px; border-top: 1px dashed #c3cad3; color: var(--accent); }
.marker { display: inline-block; margin-right: 5px; padding: 0 5px; border-radius: 4px; font-size: 6.8pt; font-weight: 700; letter-spacing: 0.05em; line-height: 1.65; text-transform: uppercase; white-space: nowrap; vertical-align: 1px; }
.marker-auto-test { background: #e4eefb; color: #1f5fa8; }
.marker-ask-ai { background: #efe9fb; color: #5b3db5; }
.label-note { margin-left: 8px; text-transform: none; letter-spacing: 0; font-weight: 500; color: var(--muted); }
.optional { display: inline-block; margin-left: 8px; padding: 0 7px; border: 1px solid #c3cad3; border-radius: 999px; color: var(--muted); font-size: 6.8pt; font-weight: 600; letter-spacing: 0.06em; line-height: 1.7; text-transform: uppercase; vertical-align: 1px; }
.section h2 .optional { margin-left: 0; }
.item { display: grid; grid-template-columns: 12px 32px 1fr; column-gap: 9px; padding: 4px 0; border-bottom: 1px solid var(--line); break-inside: avoid; }
.box { width: 11px; height: 11px; margin-top: 2.5px; border: 1.4px solid #9aa5b1; border-radius: 3px; }
.id { font-size: 8.4pt; font-weight: 700; color: var(--accent); padding-top: 0.5px; font-variant-numeric: tabular-nums; }
.text p { margin: 0; }
.hint { margin-top: 3px !important; font-size: 8.2pt; color: var(--muted); }
.hint-label { display: inline-block; margin-right: 6px; padding: 0 5px; border-radius: 4px; background: var(--accent-soft); color: var(--accent); font-size: 6.8pt; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; vertical-align: 1px; }
.tag { display: inline-block; margin-right: 5px; padding: 0 6px; border-radius: 999px; font-size: 7pt; font-weight: 600; line-height: 1.6; vertical-align: 1px; }
${Object.values(PLATFORMS).map((platform) => `.tag-${platform.key} { background: ${platform.background}; color: ${platform.color}; }`).join("\n")}

.section-plain h2 { border-bottom-color: var(--line); }
.paragraph { margin: 8px 0; color: var(--muted); }
.sources { margin: 0; padding-left: 26px; }
.sources li { padding: 3px 0; break-inside: avoid; }
.sources .url { display: block; font-size: 7.8pt; color: var(--muted); word-break: break-all; }
`
}

function findCheckedOnDate(checklist, strings) {
  const prefix = `${strings.checkedOn} `
  const line = checklist.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.type === "paragraph" && block.text.startsWith(prefix))
  return line ? line.text.slice(prefix.length).split(/[,.]/)[0].trim() : ""
}

function renderDocument(checklist, language, branding) {
  const strings = LANGUAGES[language]
  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(checklist.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>${renderStyles(checklist.title)}</style>
</head>
<body>
${renderCover(checklist, language, branding)}
<main>
${checklist.sections.map((section, index) => renderSection(section, index, strings)).join("\n")}
</main>
</body>
</html>
`
}

function findBrowser() {
  return BROWSER_CANDIDATES.find((candidate) => fs.existsSync(candidate)) ?? null
}

/** Prints the HTML page to PDF in a throwaway browser profile, so a running browser is never touched. */
function printToPdf(browser, htmlPath, pdfPath) {
  const profileDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "checklist-pdf-"))
  try {
    const result = spawnSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profileDirectory}`,
      "--no-pdf-header-footer",
      "--virtual-time-budget=20000",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ], { encoding: "utf8", timeout: BROWSER_TIMEOUT_MILLISECONDS })
    if (result.error) throw result.error
    if (!fs.existsSync(pdfPath)) throw new Error(`The browser did not write the PDF:\n${result.stderr}`)
  } finally {
    fs.rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 3 })
  }
}

function parseArguments(argumentList) {
  const options = { markdown: null, language: "en", output: DEFAULT_OUTPUT }
  for (let index = 0; index < argumentList.length; index++) {
    const argument = argumentList[index]
    if (argument === "--language") options.language = argumentList[++index]
    else if (argument === "--output") options.output = path.resolve(argumentList[++index] ?? "")
    else options.markdown = path.resolve(argument)
  }
  return options
}

function buildDocument(document, outputDirectory, browser, branding) {
  if (!(document.language in LANGUAGES)) {
    throw new Error(`Unknown language "${document.language}". Known: ${Object.keys(LANGUAGES).join(", ")}`)
  }
  if (!fs.existsSync(document.markdown)) throw new Error(`Markdown file not found: ${document.markdown}`)

  const checklist = parseChecklist(fs.readFileSync(document.markdown, "utf8"), LANGUAGES[document.language])
  const baseName = path.basename(document.markdown, path.extname(document.markdown))
  const htmlPath = path.join(outputDirectory, `${baseName}.html`)
  const pdfPath = path.join(outputDirectory, `${baseName}.pdf`)
  fs.writeFileSync(htmlPath, renderDocument(checklist, document.language, branding), "utf8")
  console.log(`HTML: ${htmlPath}`)

  if (!browser) return
  fs.rmSync(pdfPath, { force: true })
  printToPdf(browser, htmlPath, pdfPath)
  console.log(`PDF: ${pdfPath}`)
}

function main() {
  const options = parseArguments(process.argv.slice(2))
  const documents = options.markdown ? [{ markdown: options.markdown, language: options.language }] : DEFAULT_DOCUMENTS
  fs.mkdirSync(options.output, { recursive: true })

  const browser = findBrowser()
  const branding = { logo: readLogo(), version: readVersion() }
  let failed = false
  for (const document of documents) {
    try {
      buildDocument(document, options.output, browser, branding)
    } catch (error) {
      console.error(error.message)
      failed = true
    }
  }

  if (!browser) console.error("No Chrome or Edge found, so only HTML was written. Print it to PDF from any browser.")
  process.exit(failed || !browser ? 1 : 0)
}

main()
