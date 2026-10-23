# engineersonqueue website

Responsive commission-group website built with Svelte 5, TypeScript, Vite, and Lucide icons. Features service descriptions, an honest pre-launch portfolio, a credential section, FAQs, mobile navigation, and a direct email commission form with client contact details.

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

The default Vite base path is `/` for Cloudflare Pages and other root-level hosts. The GitHub Actions workflow sets `VITE_BASE_PATH=/engineersonqueue/` explicitly for this GitHub project site. For a custom domain attached to GitHub Pages, change that workflow value to `/`. No backend, database, or deployment secrets are needed. GitHub's generated workflow token handles deployment.

Creating a build or pushing the workflow does not establish that the site is live; check the Actions deployment result.

Production builds include a `version.json` manifest. Open tabs check for a new deployment on startup, when returning to the tab, and every minute. A newer release triggers a refresh with a version query parameter, preserving the current section and other query parameters. Refresh waits while a commission dialog is open or a form is being edited. If an old deployment predates this feature, open the site once with a fresh `?v=` value or force-refresh to load the update.

## Before launch

- Activate FormSubmit for `engineersonqueue@protonmail.com` as described below before relying on email inquiries.
- Confirm the member's specific ISC2 certification and add a public verification link if desired. The current copy claims only the membership credential supplied by the team, with no invented certification level or endorsement.
- Replace the honest portfolio placeholder with real projects when available; obtain permission before publishing client work.
- Google Fonts are optional external requests; system sans-serif fallbacks keep the site usable if fonts cannot load.

The hero artwork is CSS and SVG; no external image assets are required. Brand copy and service data live in `src/App.svelte`; responsive styles live in `src/style.css`.

## Commission request email

The form sends requests to **engineersonqueue@protonmail.com** using a standard browser POST to FormSubmit. This works with GitHub Pages and does not require an SMTP password or a private API key in the browser. The receiving address is public in `src/lib/contact.ts`; change it there to switch inboxes.

Each request includes the client's name, required reply email, optional phone number or social contact, selected service, and project details. The client email uses FormSubmit's `email` field so the team can reply. FormSubmit handles any provider verification and redirects back to the website's confirmation dialog after processing. The absolute `_next` return URL uses the current domain and deployment base, so it works on both GitHub Pages and Cloudflare Pages.

The site uses the browser's native form submission instead of AJAX: it does not abort delivery after 20 seconds or try to parse a cross-origin JSON response. This prevents the previous client-side error path after the service had already sent the email. Named inputs remain enabled during submission so contact information is included; only the send button is disabled to discourage duplicate clicks. Returning with the browser's Back button resets the pending state. A hidden honeypot field helps filter automated submissions. The UI explains that FormSubmit processes inquiry data.

### One-time receiving inbox activation

1. Wait for the GitHub Pages deployment to complete.
2. Submit one clearly labeled setup request through the live site.
3. Open **engineersonqueue@protonmail.com**, check inbox and spam, and click the FormSubmit activation link. Only someone with access to this inbox can complete this step.
4. Submit a new request after activation and verify that it arrives and that Reply addresses the client email. Do not assume the pre-activation setup request will be forwarded.

Local browser tests intercept the provider POST and verify the contact payload and confirmation redirect without sending email. The owner has reported receiving live commission emails; local tests do not independently verify inbox delivery. Check FormSubmit's current service limits and availability if delivery stops. No email credentials should be committed to this repository.

## Publish free on Cloudflare Pages

Cloudflare Pages hosts this static site on the Free plan with a `pages.dev` address; buying a domain is optional. The project now builds for `/` by default, so no source edit is needed for Cloudflare. The GitHub Pages workflow explicitly sets `VITE_BASE_PATH=/engineersonqueue/` to keep the existing GitHub URL working.

1. In the Cloudflare dashboard, open **Compute → Workers & Pages**. Click **Create application** (or **Create app**), then choose **Pages**. If the initial screen offers Workers, use the **Pages / Get started** link instead.
2. Choose **Connect to Git / Import an existing Git repository**, connect GitHub, and select `a2soriano/engineersonqueue`. Grant access only to the repository needed for this project.
3. Set the project name to `engineersonqueue` if available and the production branch to `main`.
4. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite (or None) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | Leave empty (repository root) |
   | Environment variable | `NODE_VERSION=24` |

   Leave `VITE_BASE_PATH` unset, or set it to `/`. No deploy command, Wrangler configuration, SMTP credentials, or paid plan is required for this Pages project.
5. Click **Save and Deploy**. Wait for a successful deployment, then use the exact `https://<project-name>.pages.dev` address Cloudflare provides. The suggested name is not guaranteed to be available.

Later pushes to `main` deploy automatically on Cloudflare when the Git connection is enabled. Connecting a custom `.com` domain is optional and domain registration is a separate expense. After moving hosts, verify the commission form on the new domain and follow any FormSubmit activation prompt before relying on delivery there.

To build manually for a root-domain host, run `npm run build`. To reproduce the GitHub Pages subpath build locally, run `VITE_BASE_PATH=/engineersonqueue/ npm run build`.
