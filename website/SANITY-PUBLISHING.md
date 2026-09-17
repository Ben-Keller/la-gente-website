# Sanity → live website

Project `80rpogyy`, public `production` dataset. The Astro build uses only the `published` perspective, with no Sanity token in the browser or repository. The site remains static on GitHub Pages at https://lagentedelatierra.com.

## Editorial workflow

- Copy, chapter narratives, people, FAQs, organizations, photograph selection/crops/captions, videos and page settings: edit, then **Publish**. Autosaved unfinished drafts are not deployed. No review stages, releases, scheduling or paid features are required.
- Drag order: stored directly by the ordering plugin. Groups: direct-save taxonomy names, edited through a person. Group membership itself is published with the person.
- GitHub checks for changed published content every five minutes and builds only when the content hash differs from the deployed hash. GitHub scheduling can be delayed; it is not an instant webhook. An owner can use **Run workflow** on the deployment workflow for an immediate request.
- GitHub disables scheduled workflows in public repositories after 60 days without repository activity. Re-enable the workflow in Actions if this occurs. For guaranteed prompt delivery, replace polling with an authenticated webhook bridge; do not put a GitHub write token in Studio or the public Sanity dataset.

## Bindings

`src/data/cms.mjs` fetches the published projection. `prepare-cms.mjs` freezes one snapshot for all rendering and validation. Core collections render through Astro components; `apply-cms-pages.mjs` binds imported page sections to their existing designed shells at build time. Section copy, rich text, links, photographs and order are CMS-owned. New sections get a basic text-section shell. Preserve hidden `sourceSelector` values when changing existing sections. New bespoke layouts need code changes, not arbitrary HTML in the CMS.

Gallery order and selection, team order, organization list/map order, shared navigation, page SEO, chapter SEO, slideshow selections, video sources and poster images are bound. Video binaries remain outside Sanity. External YouTube/Vimeo URLs use privacy-friendly click-through links rather than autoplay embeds.

Code-owned elements: form field labels and success/error messages, Web3Forms configuration, the logo/fonts, map terrain and rendering, animation behavior, fixed navigation utility labels, and structural chapter-detail labels. These are not pretend CMS controls. Team groups remain editorial metadata rather than a new visual section layout. The existing hand-designed appearance is retained.

## Build safety and recovery

`npm run build` fetches the snapshot, builds 27 routes, applies page content, validates all local links/assets, and checks CMS text, links, SEO, ordered collections and map parity. Missing critical content or build errors prevent deployment; the old site remains online. `cms-version.json` records the successful snapshot hash and build time, never draft content or credentials.

CI uses the public dataset without a read token. It requires only the existing repository's standard GitHub Pages permissions. No subscription upgrades or additional paid services.

Before destructive CMS deletion, export the dataset. To roll back content, restore/re-publish the previous document version and run the workflow. To roll back this integration, revert its Git commit; the prior file-backed site remains in Git history. Do not run the old migration importer to overwrite team edits.

## Local checks

Run `npm run build`, then `npm run preview -- --port 4329`. `TEST_BASE_URL=http://localhost:4329 node scripts/test-cms-browser.mjs` performs read-only desktop/mobile checks and saves screenshots under ignored `.cms/screenshots`. Install the matching Chromium with `npx playwright install chromium` if necessary. No forms are submitted by these tests.
