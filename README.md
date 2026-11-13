# Unity WebGL Publishing Checklist

One checklist for publishing Unity WebGL games on 13 web platforms, kept by Mirra Games. It covers the game build, not the store page.

| Path | Purpose |
| --- | --- |
| [Markdown/publishing-checklist.md](Markdown/publishing-checklist.md) | The checklist in English |
| [Markdown/publishing-checklist-russian.md](Markdown/publishing-checklist-russian.md) | The same checklist in Russian |
| [Tools/PrintPDF](Tools/PrintPDF/README.md) | Builds print-ready PDFs of both |
| [CHANGELOG.md](CHANGELOG.md) | What changed in each version |

### Build the PDFs

```bash
node Tools/PrintPDF/build.mjs
```

The PDFs appear in `Tools/PrintPDF/Output/`.

### Edit the checklist

1. Change both language files together, so they stay the same item for item.
2. Keep item numbers permanent: a new item takes the next free number in its section, and a removed number is never reused.
3. Put the checks a person must do first. Checks a script or an AI can take over go under "Can be automated" with an `Auto test` or `Ask AI` marker.
4. Raise the version in `CHANGELOG.md`. The PDF cover reads it from there.
