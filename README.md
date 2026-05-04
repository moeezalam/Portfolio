# Moeez Alam Portfolio

A Claude-dark inspired personal site built with React + Vite. It pulls project data from GitHub and layers in manual highlights.

## Quick Start

```bash
npm install
npm run data:projects
npm run dev
```

## Content Updates

- Profile, experience, education, skills: `src/data/site.js`
- Project overrides (summaries, tags, screenshots): `src/data/projects.manual.json`
- Resume PDF: `public/resume.pdf`
- Profile photo: add `public/profile.jpg` (fallback at `public/profile-placeholder.svg`)

## Data Pipeline

```bash
npm run data:projects
```

This script fetches public GitHub repos for `moeezalam` and writes them to `src/data/projects.generated.json`.

## Deployment (GitHub Pages)

Push to `main` and GitHub Actions will build and deploy automatically. The workflow sets the correct base path using `VITE_BASE`.
