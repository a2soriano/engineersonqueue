# engineersonqueue website

Responsive commission-group website built with Svelte 5, TypeScript, Vite, and Lucide icons. Features service descriptions, an honest pre-launch portfolio, an ISC2 credential section, FAQs, mobile navigation, and a downloadable project brief.

## Development

Requires Node.js 22+ (validated with Node 24) and npm.

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

```sh
npm run check
npm run build
npm run preview -- --port 4173
```

## Publish on GitHub Pages

The workflow in `.github/workflows/deploy.yml` checks and builds the site, then deploys it on every push to `main`.

1. Push these files to `a2soriano/engineersonqueue`.
2. Open the repository's **Settings → Pages** and choose **GitHub Actions** as the build source.
3. Open **Actions → Deploy website to GitHub Pages** and run the workflow if it has not already started.
4. After a successful deployment, visit `https://a2soriano.github.io/engineersonqueue/`.

The Vite base path is `/engineersonqueue/` so assets load correctly on this project site. For a custom domain or root-level static host, change `base` in `vite.config.ts` to `/` before building. No backend, database, or deployment secrets are needed. GitHub's generated workflow token handles deployment.

Creating a build or pushing the workflow does not establish that the site is live; check the Actions deployment result.

## Before launch

- Add a real contact email, social account, or form service. Currently visitors can generate, copy, and download a brief; no inquiry is transmitted. The interface explicitly explains this.
- Confirm the member's specific ISC2 certification and add a public verification link if desired. The current copy claims only the membership credential supplied by the team, with no invented certification level or endorsement.
- Replace the honest portfolio placeholder with real projects when available; obtain permission before publishing client work.
- Google Fonts are optional external requests; system sans-serif fallbacks keep the site usable if fonts cannot load.

The hero artwork is CSS and SVG; no external image assets are required. Brand copy and service data live in `src/App.svelte`; responsive styles live in `src/style.css`.
