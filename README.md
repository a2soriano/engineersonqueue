# Engineers on Queue

A responsive website for **Engineers on Queue**, a student-led technical services group focused on software development, electronics, embedded systems, and networking.

The site presents the team's services, qualifications, project portfolio, and commission inquiry process in a lightweight, mobile-friendly interface.

## Tech stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| UI framework | Svelte 5 | Component-based interface and interactions |
| Language | TypeScript | Typed application code |
| Tooling | Vite | Local development and production builds |
| Icons | Lucide | Consistent interface iconography |
| Styling | CSS | Responsive layouts, visual design, and animations |
| Form delivery | Web3Forms | Commission requests from the static site |
| Hosting | Cloudflare Pages or GitHub Pages | Static deployment |

No application server or database is required for the current implementation.

## Getting started

**Requirements:** Node.js 22 or later, npm, and Git. Node.js 24 is the validated development version.

Clone the repository, install the locked dependencies, and start the development server:

```bash
git clone <repository-url>
cd engineersonqueue
npm ci
npm run dev
```

Vite prints the local address in the terminal, typically `http://localhost:5173`.

### Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run check` | Run the project's Svelte and TypeScript checks |
| `npm run build` | Generate an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally for verification |

Run the checks and build before submitting changes:

```bash
npm run check
npm run build
npm run preview
```

## Codebase guide

| Path | Responsibility |
| --- | --- |
| `src/App.svelte` | Main page content, service information, and site interactions |
| `src/style.css` | Global styling and responsive layouts |
| `src/lib/contact.ts` | Contact settings and Web3Forms access-key configuration |
| `.github/workflows/deploy.yml` | GitHub Pages build and deployment workflow |
| `dist/` | Generated production files, created during builds |

The main content and service definitions currently live in `src/App.svelte`. Visual changes should generally be made in `src/style.css`; contact delivery settings should be managed through `src/lib/contact.ts` or the deployment environment.

The hero illustration is implemented using CSS and SVG rather than separate image assets. Google Fonts are optional, with system-font fallbacks when external font requests are unavailable.

## Configuration

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_WEB3FORMS_ACCESS_KEY` | Public key configured in `src/lib/contact.ts` | Overrides the browser-side form access key. An explicitly empty value disables online submissions. |
| `VITE_BASE_PATH` | `/` | Asset base path for the production build. Set to `/engineersonqueue/` for a GitHub Pages project site. |

Variables prefixed with `VITE_` are exposed to client-side code at build time. **Do not store passwords, private API keys, or other secrets in these variables.** A Web3Forms public access key is designed for browser use but should not be confused with a private account credential.

### Commission inquiries

The commission form submits directly to Web3Forms. It collects the client's name, reply email, optional contact information, requested service, and project details. Requests are delivered to the mailbox associated with the configured access key.

The team's current inquiry address is `engineersonqueue@protonmail.com`.

To configure a different destination, register or update the receiving address through [Web3Forms](https://web3forms.com), verify mailbox ownership, and set the corresponding access key. Updating the visible contact email alone **does not** change where form submissions are delivered.

The form reports success only after a confirmed provider response. Rejected submissions retain entered details so they can be corrected. Network timeouts are treated as **unconfirmed** rather than failed delivery because the request may have reached the provider.

After changing a key or deployment domain, submit a clearly labeled test request through the live site and confirm that it reaches the intended inbox. Web3Forms availability, delivery times, and free-tier limits are outside the site's control.

## Deployment

Production output is generated in `dist/`. The default asset base path is `/`, suitable for deployments at the root of a domain or subdomain.

### Cloudflare Pages

Connect the repository to Cloudflare Pages and use the following configuration:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | Repository root |
| Node.js version | `24` (set `NODE_VERSION=24` if needed) |
| `VITE_BASE_PATH` | Unset, or `/` |

Once Git integration is enabled, pushes to the configured production branch trigger new deployments. Cloudflare provides a `pages.dev` address for the project; a custom domain is optional.

This project is a **Pages** deployment. It does not require a Workers deploy command, Wrangler configuration, backend service, or server-side credentials.

### GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which runs the project checks, builds the site, and deploys updates from `main`.

In repository settings, open **Pages** and select **GitHub Actions** as the deployment source. The workflow sets the following base path for a GitHub Pages project URL:

```bash
VITE_BASE_PATH=/engineersonqueue/ npm run build
```

A custom domain served from the domain root should use `VITE_BASE_PATH=/` instead. Confirm deployment success in the repository's **Actions** tab before treating a release as live.

## Release behavior

Production builds include a `version.json` manifest used to detect newer releases. Open pages check the deployed version on startup, when the tab becomes active, and at one-minute intervals.

When an update is available, the application refreshes with a version query parameter while preserving the current section and other query parameters. Refreshing is deferred if a commission dialog is open or the user is editing a form, reducing the risk of losing entered information.

If a browser continues to serve an older deployment, perform a hard refresh and check the deployed `version.json` file and hosting cache settings.

## Testing and maintenance

Before deploying changes, run `npm run check` and `npm run build`, then inspect the built site using `npm run preview`.

| Area | What to verify |
| --- | --- |
| Responsive layout | Navigation, spacing, typography, and content across mobile and desktop widths |
| Navigation | Internal links, section scrolling, and mobile menu interactions |
| Commission form | Valid submissions, required-field validation, provider rejection, and timeout handling |
| Form configuration | Missing-key fallback and delivery to the expected mailbox |
| Assets | Styles, icons, and fonts on both root-hosted and subpath-hosted builds |
| Releases | Version detection without interrupting an active commission request |
| Content | Accuracy of services, credentials, contact information, and published portfolio work |

Browser-based form tests can intercept network requests to simulate success, failure, and uncertain delivery without sending real inquiries. A production smoke test is still necessary after changes to hosting or form configuration.

### Content updates

Update service descriptions and other website copy in `src/App.svelte`. Publish portfolio examples only when the project details and any required client permissions have been confirmed. Credential descriptions should refer to verifiable qualifications and should not imply certifications or endorsements that have not been established.

## Contributing

Keep changes focused and consistent with the existing Svelte and TypeScript patterns. Check responsive behavior when modifying layout or interactive components. Include a brief description of what changed and how it was verified when opening a pull request.

For changes that affect deployment or form behavior, document any required configuration updates so other maintainers can reproduce the result.
