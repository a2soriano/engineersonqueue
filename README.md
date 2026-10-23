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

- Configure the free Web3Forms public form access key for `engineersonqueue@protonmail.com` as described below before relying on email inquiries.
- Confirm the member's specific ISC2 certification and add a public verification link if desired. The current copy claims only the membership credential supplied by the team, with no invented certification level or endorsement.
- Replace the honest portfolio placeholder with real projects when available; obtain permission before publishing client work.
- Google Fonts are optional external requests; system sans-serif fallbacks keep the site usable if fonts cannot load.

The hero artwork is CSS and SVG; no external image assets are required. Brand copy and service data live in `src/App.svelte`; responsive styles live in `src/style.css`.

## Commission request email

The form uses Web3Forms to send commission requests to the inbox associated with a public form access key. The team's receiving inbox is **engineersonqueue@protonmail.com**. A static GitHub Pages or Cloudflare Pages site can use this without an SMTP password or a backend server.

### One-time free setup

1. Create a free form access key at `https://web3forms.com` using `engineersonqueue@protonmail.com` and follow the verification email.
2. The confirmed public form key supplied by the team is configured in `src/lib/contact.ts`. To change it later, replace that public default or set `VITE_WEB3FORMS_ACCESS_KEY` in the build environment. An explicitly empty value disables online submissions; leaving the variable unset uses the confirmed default. This is a browser form access key, designed to be visible in the shipped JavaScript; it is not an account password or private administration API token.
3. Rebuild and deploy, then submit one clearly labeled setup request from the live domain and verify that it arrives with the correct reply email. Sending email to a destination depends on the access key's inbox binding; changing only `commissionEmail` does not reroute submissions.

Customers submit their name, required reply email, optional phone or social contact, service, and project details without leaving the site. The interface shows success only after an explicit successful response from Web3Forms. A rejected request preserves the contact fields for correction. A lost or timed-out response is treated as unconfirmed delivery, since the email may already have been accepted; the site does not automatically resend or claim that delivery failed.

Web3Forms must be configured before email submissions can work. The missing-key state offers a direct email link. The site uses Web3Forms only and does not redirect customers away to submit a request. Free-plan limits and provider delivery speed still apply; neither submission confirmation nor tests prove instant inbox delivery.

Local browser checks intercept the provider request and exercise success, rejection, missing setup, and uncertain delivery without sending real emails. Keep the provider's public browser form access key separate from account passwords and private management credentials.

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

Later pushes to `main` deploy automatically on Cloudflare when the Git connection is enabled. Connecting a custom `.com` domain is optional and domain registration is a separate expense. After moving hosts, verify the commission form on the new domain and verify the Web3Forms key is configured before relying on delivery there.

To build manually for a root-domain host, run `npm run build`. To reproduce the GitHub Pages subpath build locally, run `VITE_BASE_PATH=/engineersonqueue/ npm run build`.
