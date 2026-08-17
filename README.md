# Project Portal

A lightweight static web form prototype for field record entry.

## Deployment

This repository is published as a GitHub Pages site. It contains only the files required by the deployed web app.

The field entry flow starts at `index.html` and links to the blank production record at `record.html`. A photo-based filled example is available at `demo.html`; `example.html` remains as a backwards-compatible legacy URL. The older desktop checklist page is preserved at `checklists.html`.

## Field workflow

1. Open the Pages URL on a phone and choose **New construction unit**.
2. Enter the unit/design baseline, then record depth checks, key cycle times, and each concrete truck.
3. Review the calculated cumulative volume, estimated rise, measured rise, and difference.
4. Choose **Export PDF** and share the printed PDF to LINE or save it to Files.

Drafts are stored only in the current browser on the current device. The PDF is the handoff artifact; this static version has no server-side sync.

## Local preview

Open `index.html` in a modern browser, or run a local static server:

```bash
python3 -m http.server 4173
```

## Data handling

The prototype stores drafts locally in the browser. It does not provide a server-side database, user accounts, or centralized submission workflow.
