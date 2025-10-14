# Moviemind MPCS-1

A cinematic, keyboard-friendly questionnaire experience for the MPCS-1 flow. Built with React 18, TypeScript, Vite, Tailwind CSS, and React Router.

## Quickstart

```bash
npm install
npm run dev
```

Visit the printed local URL to explore the experience.

## Binary Policy

- No raster binaries are committed to the repository. The CI workflow (`.github/workflows/no-binaries.yml`) and local guard (`npm run check:no-binaries`) fail when disallowed extensions are detected.
- Use inline data-URL placeholders (as demonstrated in `public/data/mpcs1_manifest.json`) or keep local artwork files ignored by Git.
- When running privately, drop your art into the same `public/assets/**` folders with the prescribed filenames. The runtime prefers on-disk assets automatically, and missing files fall back to generated placeholders with a visible badge.

## Bringing Your Own Art

- Real artwork is **not** committed to the repo. The folders under `public/assets/` only include `.gitkeep` sentinels so Git tracks the structure.
- The runtime manifest (`public/data/mpcs1_manifest.json`) references lightweight data-URL placeholders so the UI works without binary files. When you add your own PNGs with the prescribed filenames (`BLANK_TARRO_00.png`, `G01.png` … `G05.png`, `NEAON_01.png`, etc.), the app automatically prefers those files.
- If an image fails to load at runtime the UI swaps to a generated SVG placeholder and shows an “Asset not found” badge so the flow can continue gracefully.
- A size guard prevents checking in large binaries: `npm run check:assets` (or the `pre-commit` hook) fails when any file under `public/assets/**` exceeds 300 KB. Optimise images before committing. If you must bypass locally, run `GIT_COMMIT_NO_VERIFY=1 git commit -m "feat: wip"`, but please avoid pushing oversized files.

## Project Structure

- `src/` – Application source (components, pages, manifest loader).
- `public/` – Static assets and manifest consumed at runtime.
- `tailwind.config.ts` – Tailwind theme extensions using CSS variables.
- `postcss.config.js` – PostCSS pipeline configuration for Tailwind.
- `tsconfig*.json` – TypeScript compiler configuration for app and tooling.

## Acceptance Checklist

- [ ] Entry shows 5 gate images; keyboard-selectable; gentle parallax (off in reduced motion).
- [ ] Text rounds render on BLANK_TARRO_00.png; options A–C are radio-like and tabbable.
- [ ] Progress rail correct across R1–R6.
- [ ] Back/Next works; answers persist; reload returns to same progress.
- [ ] No layout shifts during transitions.

Mark each item as you verify the behaviour manually.
