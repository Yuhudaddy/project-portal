# Project Portal

A lightweight static web form prototype for field record entry.

## Deployment

This repository is published as a GitHub Pages site. It contains only the files required by the deployed web app.

The main prototype is available at `index.html`. A photo-based filled example of the time-cycle record is available at `example.html`.

## Local preview

Open `index.html` in a modern browser, or run a local static server:

```bash
python3 -m http.server 4173
```

## Data handling

The prototype stores drafts locally in the browser. It does not provide a server-side database, user accounts, or centralized submission workflow.
