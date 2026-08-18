# Project Portal

A lightweight mobile-first PDF tool for field record entry.

## Deployment

This repository is published as a GitHub Pages site. It contains only the files required by the deployed web app.

The field entry tool runs directly from `index.html`. The unit record, guide-trench review, and reinforcement-cage review share one application and one PDF workflow. Legacy `record.html` and `checklists.html` URLs redirect to the integrated tool.

## Field workflow

1. Open the Pages URL on a phone and select the unit, guide-trench, or reinforcement-cage record from Project Tools.
2. Enter the project and wall baseline, then add excavation, pre-work, and concrete records.
3. Review calculated counts, cumulative volume, estimated rise, measured rise, and differences.
4. Choose **Export PDF**, select the current form or the complete seven-page record, and share the result to LINE or Files.

The tool intentionally has no draft storage or server-side sync. Refreshing or closing the page clears the in-memory record; the PDF is the handoff artifact.

## Local preview

Open `index.html` in a modern browser, or run a local static server:

```bash
python3 -m http.server 4173
```

## Data handling

The tool keeps entered values only in the current page session. It does not provide local draft storage, a server-side database, user accounts, or a centralized submission workflow.
