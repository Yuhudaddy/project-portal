# Project Portal

A lightweight mobile-first PDF tool for field record entry.

## Deployment

This repository is published as a GitHub Pages site. It contains only the files required by the deployed web app.

The site opens at `index.html`, which is the tool index. The current continuous-wall entry tool is `continuous-wall.html`; its unit record, guide-trench review, and reinforcement-cage review share one application and one PDF workflow. Template, rebar, steel-structure, and scaffold links intentionally resolve to the custom GitHub Pages `404.html` until those tools are built. Legacy `record.html` and `checklists.html` URLs redirect to the continuous-wall tool.

## Field workflow

1. Open the Pages URL on a phone and select an engineering record category from the tool index.
2. For the continuous-wall tool, select the unit, guide-trench, or reinforcement-cage record from the visible record switcher.
3. Enter the project and wall baseline, then add excavation, pre-work, and concrete records.
4. Review calculated counts, cumulative volume, estimated rise, measured rise, and differences.
5. Choose **Export PDF**, select the current form or the complete six-page record, and share the result to LINE or Files.

The tool intentionally has no draft storage or server-side sync. Refreshing or closing the page clears the in-memory record; the PDF is the handoff artifact.

## Local preview

Open `index.html` in a modern browser, or run a local static server:

```bash
python3 -m http.server 4173
```

## Data handling

The tool keeps entered values only in the current page session. It does not provide local draft storage, a server-side database, user accounts, or a centralized submission workflow.

## Security boundary

The site is a public, static GitHub Pages application. It has no authentication or private record repository. Entered form values remain in page memory and are not uploaded by the application; downloaded files are controlled by the user's device. Do not place confidential or personally identifiable production data in public example files.
