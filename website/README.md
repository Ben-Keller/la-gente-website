# La Gente de La Tierra — rebuild scaffold

Performance-first Astro rebuild of the confirmed public website. This is an editorial scaffold: imagery, quotations, organization details, external links, press materials, and the contact provider remain placeholders until verified.

## Run locally

```sh
npm install
npm run dev
```

Production validation: `npm run build`.

## GitHub Pages deployment

The repository-root workflow at `../.github/workflows/deploy.yml` builds this nested Astro project and deploys it automatically after a push to `main`. It can also be run manually from the Actions tab.

1. Commit the repository root, including this directory and `package-lock.json`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Push to `main` or run **Deploy to GitHub Pages** manually.
4. In **Settings → Pages**, confirm the custom domain is `lagentedelatierra.com` and enable **Enforce HTTPS** after DNS validates.

`public/CNAME` configures the custom domain. Because the site is built for that root domain, no repository-name `base` path is used. If the site will instead live permanently at `username.github.io/repository/`, the Astro `base` setting and every root-relative link must be updated first.

## Confirmed canonical routes

- `/`
- `/about/`
- `/communities/`
- `/get-involved/`
- `/media/`
- `/contact-us/`
- `/chapter-1-pitukiska/`
- `/chapter-2-shipibo/`
- `/chapter-3-maras/`
- `/chapter-4-floating-islands/`
- `/chapter-5-rinconada/`
- `/chapter-6-huanchaco-fishermen/`

The generic chapter routes from the legacy installation redirect to the six confirmed canonical pages.

## Architecture

- Static Astro output with strict TypeScript
- Shared layouts and data-driven chapter cards
- Vanilla CSS and no client JavaScript in the initial scaffold
- Native scrolling, no blocking loader, no scroll hijacking
- Semantic HTML, focus skip link, reduced-motion support, and responsive layouts
- Contact form is intentionally inactive
- Placeholder visuals have explicit aspect ratios to prevent layout shift

## Before production

1. Replace placeholders with the canonical image collection and use Astro's responsive image pipeline.
2. Verify all copy, names, quotes, translations, credits, partner organizations, and outbound links.
3. Select a privacy-conscious form service, anti-spam policy, recipient, and retention policy.
4. Add approved privacy, cookie, accessibility, and copyright language.
5. Add analytics only if required, with consent handling appropriate to launch regions.
6. Configure redirects at the final host and validate every legacy URL.
