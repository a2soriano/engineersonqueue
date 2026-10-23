# engineersonqueue website

Responsive commission-group website built with Svelte 5, TypeScript, Vite, and Lucide icons. Features service descriptions, an honest pre-launch portfolio, a credential section, FAQs, mobile navigation, and an email commission form with a downloadable brief fallback when email delivery is not configured.

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

- Activate FormSubmit for `engineersonqueue@protonmail.com` as described below before relying on email inquiries.
- Confirm the member's specific ISC2 certification and add a public verification link if desired. The current copy claims only the membership credential supplied by the team, with no invented certification level or endorsement.
- Replace the honest portfolio placeholder with real projects when available; obtain permission before publishing client work.
- Google Fonts are optional external requests; system sans-serif fallbacks keep the site usable if fonts cannot load.

The hero artwork is CSS and SVG; no external image assets are required. Brand copy and service data live in `src/App.svelte`; responsive styles live in `src/style.css`.

## Commission request email

The form sends requests to **engineersonqueue@protonmail.com** using FormSubmit's AJAX endpoint. This works with GitHub Pages and does not require an SMTP password or a private API key in the browser. The receiving address is public in `src/lib/contact.ts`; change it there to switch inboxes. If no address is set, the original local brief generator remains available.

Each request includes the client's name, required reply email, optional phone number or social contact, selected service, and project details. The client email uses FormSubmit's `email` field so the team can reply. The UI shows a submission confirmation only after FormSubmit returns a successful response; this confirms acceptance by the service, not inbox delivery. Network failures, timeouts, and provider rejection preserve the form and offer retry or a direct email link. A hidden honeypot field helps filter automated submissions. The UI explains that FormSubmit processes inquiry data.

### One-time receiving inbox activation

1. Wait for the GitHub Pages deployment to complete.
2. Submit one clearly labeled setup request through the live site.
3. Open **engineersonqueue@protonmail.com**, check inbox and spam, and click the FormSubmit activation link. Only someone with access to this inbox can complete this step.
4. Submit a new request after activation and verify that it arrives and that Reply addresses the client email. Do not assume the pre-activation setup request will be forwarded.

No real delivery or inbox activation is proven by the local browser tests, which intercept the provider request and verify success, rejection, and network-failure behavior without sending email. Check FormSubmit's current service limits and availability if delivery stops. No email credentials should be committed to this repository.
