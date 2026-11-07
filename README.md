# Forma — Training Atlas

A workout tracker centered on an interactive muscle map. Explore anatomy, discover exercises, log a session, and see recorded training activity update on the body.

Built with React 19, TypeScript, and Vite. Runs entirely in the browser; no server, API keys, database, or environment variables are required.

## Quick start

Install Node.js **22.13 or newer** (Node 22 LTS is used in CI), then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build:

```sh
npm run check
npm run build
npm run preview
```

Serve the generated `dist/` directory over HTTP; opening `index.html` directly from the filesystem is not supported.

## Features

- Front/back vector muscle atlas with 19 muscle regions, keyboard selection, search, zoom, and pan.
- 29 curated exercises, home/gym discovery, equipment and difficulty filters, instructions, and static muscle-focus illustrations.
- Custom exercises with primary and secondary muscle assignments.
- Autosaved active sessions with working/warm-up sets, reps, kg, seconds, km, effort ratings, notes, previous values, and rest timers.
- Reusable routines and an eight-week plan with rest days.
- Editable workout history, session duplication, calendar, personal bests, and exercise progress.
- Consistent training heatmap thresholds and transparent set calculations.
- Removable sample workouts and validated JSON backup import/export.

## Upload to GitHub

Create an empty GitHub repository, then run these commands **inside this project directory**. Replace `YOUR-USER` and `YOUR-REPOSITORY` with your own values:

```sh
git init -b main
git add .
git commit -m "Initial Forma app"
git remote add origin https://github.com/YOUR-USER/YOUR-REPOSITORY.git
git push -u origin main
```

The included ignore rules exclude installed dependencies, build output, environment files, hosting metadata, and Forma backup exports. Commit `package-lock.json` so collaborators and CI install the same dependency versions.

For a browser upload, upload the **contents** of this folder to the repository root, including hidden configuration files such as `.github`, `.gitignore`, and `.nvmrc`. Avoid uploading the ZIP itself as your application source.

## Optional GitHub Pages hosting

1. Push the source to GitHub.
2. Open **Settings → Pages** and choose **GitHub Actions** as the build source.
3. Open **Actions → Deploy to GitHub Pages → Run workflow**, choosing the branch you want to deploy.
4. Open the URL shown by the completed deployment.

The Pages workflow runs manually to keep publication deliberate. CI still runs automatically on pushes and pull requests, checking formatting, types, tests, and production builds on Windows and Linux. GitHub repository permissions and plan restrictions apply to Pages availability.

Relative asset URLs allow `dist/` to work at either a domain root or a repository subpath. Other static hosts can also serve this directory. No SPA history fallback is necessary because navigation uses in-app state rather than URL routes.

## Data and privacy

Workout data is stored in browser `localStorage` under `forma.training.v1`. It is specific to the current browser and site origin; publishing this app does not upload or sync your workouts. Export a backup from **Data and settings** before clearing browser data or moving to a different domain. Import that backup at the new location to transfer records.

Sample history is generated relative to the first launch date and is clearly labeled. Clearing samples preserves your own workouts, routines, and active session. Backups may contain personal workout details and should not be committed to the repository.

The stylesheet requests DM Sans and Manrope from Google Fonts. System fonts provide a fallback. No analytics are included.

## Training calculation

Each checked working set in a saved session contributes **1** to every primary muscle and **0.5** to every secondary muscle. Warm-ups, unchecked sets, active sessions, and plans contribute zero. Fixed intensity bands are 0, greater than 0 but below 4, 4 to below 8, 8 to below 12, and 12+. Recent activity uses the most recent qualifying session date within the selected period.

Colors describe recorded training activity. They do not measure muscle growth, readiness, or recovery.

## Project structure

```text
src/
  main.tsx         Application entry and stylesheet imports
  forma.tsx        Navigation, persistence, routines, history, and progress
  anatomy.tsx      Original interactive SVG muscle map
  components.tsx   Exercise library, dialogs, and set/session editors
  data.ts          Types, catalog, sample data, and training calculations
  styles.css      Base visual system
  responsive.css  Tablet/mobile layouts and reduced-motion rules
tests/
  data.test.mjs    Training calculations and history-isolation checks
.github/workflows/
  ci.yml          Windows/Linux validation
  pages.yml       Optional manual Pages deployment
```

## Development

| Command                | Purpose                             |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Local development with hot reload   |
| `npm run format`       | Format authored files               |
| `npm run format:check` | Check formatting                    |
| `npm run typecheck`    | Strict TypeScript validation        |
| `npm test`             | Node test runner for data behavior  |
| `npm run check`        | Formatting, types, and tests        |
| `npm run build`        | Type-check and build to `dist/`     |
| `npm run preview`      | Serve the production output locally |

Before a pull request, run `npm run check` and `npm run build`. For UI changes, verify desktop and mobile, keyboard focus, and the select muscle → add exercise → complete working set → save → updated map flow. Check refresh persistence and warm-up exclusion when changing the logger.

## Scope and attribution

The anatomy is an original simplified superficial diagram. Paired muscles and several related muscles are grouped; a deep dissection model is not included. Exercise illustrations are static and do not demonstrate movement. Units are kg, km, and seconds. Cloud sync is not included.

Anatomical naming and locations were checked against [OpenStax Anatomy & Physiology 2e](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-2-naming-skeletal-muscles). The SVG paths were authored for this app. Icons are provided by Lucide; dependency licenses remain with their respective authors.

No open-source license has been selected for this project. Choose and add a license before inviting reuse under open-source terms. `private: true` prevents accidental npm publication; it does not control GitHub repository visibility.

Deployment references: [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
