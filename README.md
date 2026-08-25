# Project Portal

A lightweight mobile-first PDF tool for field record entry.

## Deployment

This repository is published as a GitHub Pages site. It contains only the files required by the deployed web app.

The site opens at `index.html`, which is the tool index. The Diaphragm Wall entry tool is `diaphragm-wall.html`; its Diaphragm Wall unit record, Guide Wall review, and Rebar Cage review share one application and one PDF workflow. The template entry tool is `template.html`; it provides a mobile-first RC formwork review, measurement, pour-release, stripping, PDF, JSON, and Markdown workflow. Rebar, steel-structure, and scaffold links intentionally resolve to the custom GitHub Pages `404.html` until those tools are built. Legacy `record.html` and `checklists.html` URLs redirect to the Diaphragm Wall tool.

## Field workflow

1. Open the Pages URL on a phone and select an engineering record category from the tool index.
2. Select the Diaphragm Wall or Formwork tool from the visible record index. For the Diaphragm Wall tool, select the Diaphragm Wall, Guide Wall, or Rebar Cage record from the visible record switcher.
3. Enter the project and wall baseline, then add excavation, pre-work, and concrete records.
4. Review calculated counts, cumulative volume, estimated rise, measured rise, and differences.
5. Choose **輸出**, select the current form or the complete record PDF, and share the result to LINE or Files. The Diaphragm Wall tool can also export JSON/Markdown; JSON is the canonical structured file and can be imported back through **輸出 → 匯入施工紀錄** on the same Diaphragm Wall page. Markdown is for reading and archiving only and is not used for form restoration. The template tool has its own separate JSON/Markdown export and is not compatible with the Diaphragm Wall import.

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
