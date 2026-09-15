# La Gente de La Tierra

Performance-first Astro website for the six-part documentary series. It is statically generated and hosted by GitHub Pages at `https://lagentedelatierra.com/`, with Cloudflare DNS.

## Run locally

```sh
npm install
npm run dev
```

Production validation: `npm run build`. The build automatically runs `scripts/validate-pages.mjs`, which checks required Pages artifacts, base-prefixed URLs, and referenced local files.

## GitHub Pages deployment

The repository workflow builds this Astro project and deploys it automatically after a push to `main`. It can also be run manually from the Actions tab.

1. Commit the repository root, including this directory and `package-lock.json`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Push to `main` or run **Deploy to GitHub Pages** manually.
4. The production URL is `https://lagentedelatierra.com/`. Set this custom domain in GitHub Pages settings; the Actions deployment does not require a CNAME file. Cloudflare's root records must point only to GitHub Pages, with `www` pointing to `ben-keller.github.io`.

The GitHub Pages base path is centralized in `astro.config.mjs`; internal URLs and assets use `withBase()` from `src/utils/paths.ts`.

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

- `src/layouts/` contains the shared document and chapter shells.
- `src/components/` contains reusable site chrome, forms, chapter UI, map UI, and organization accordions.
- `src/data/` is the source of truth for chapters, organizations, navigation, social links, and site metadata.
- `src/scripts/` contains isolated client controllers for the homepage hero, site header, organization accordions, and D3 map.
- `src/pages/` composes routes from those shared pieces and retains legacy redirect routes for compatibility.
- `src/styles/global.css` contains the visual system and responsive rules; component class names remain stable across the refactor.
- `public/` contains canonical static media, fonts, map terrain, favicons, robots metadata, and video.
- The contact and newsletter forms use Web3Forms; the public access key is supplied through `PUBLIC_WEB3FORMS_ACCESS_KEY`.
- Semantic HTML, keyboard controls, skip navigation, responsive layouts, reduced-motion behavior, canonical metadata, structured data, robots, and sitemap output are included.

## Before production

1. Verify final release dates, YouTube URLs, press downloads, image captions, and rights.
2. Review partner-organization descriptions, locations, and outbound links periodically.
3. Replace remaining editorial and legal placeholders with approved language.
4. Confirm Web3Forms recipient settings and test both forms after deployment.
5. Add analytics only if required, with consent handling appropriate to launch regions.
6. If moving to a custom domain, update `site` and `base` in `astro.config.mjs` and add the final `CNAME`.
