# Sanity → live website

Project `80rpogyy`, public `production` dataset. The Astro build uses only the `published` perspective, with no Sanity token in the browser or repository. The site remains static on GitHub Pages at https://lagentedelatierra.com.

## Editorial workflow

- Copy, chapter narratives, people, FAQs, organizations, photograph selection/crops/captions, videos and page settings: edit, then **Publish**. Autosaved unfinished drafts are not deployed. No review stages, releases, scheduling or paid features are required.
- Drag order: stored directly by the ordering plugin. Groups: direct-save taxonomy names, edited through a person. Group membership itself is published with the person.
- GitHub checks for changed published content every five minutes and builds only when the content hash differs from the deployed hash. GitHub scheduling can be delayed; it is not an instant webhook. An owner can use **Run workflow** on the deployment workflow for an immediate request.
- GitHub disables scheduled workflows in public repositories after 60 days without repository activity. Re-enable the workflow in Actions if this occurs. For guaranteed prompt delivery, replace polling with an authenticated webhook bridge; do not put a GitHub write token in Studio or the public Sanity dataset.

## Bindings

### Where to edit shared content

- **Home → Images & videos → Opening image & mobile slideshow** owns the loading cover, background-video poster and ordered mobile slideshow. The first image is the desktop cover. Legacy section/slideshow fields are retained but hidden.
- **Home / Media → Images & videos → Trailer** selects a shared video. **Home → Background video** selects one clip with a primary URL and optional WebM format. Video matching no longer depends on migration paths. Background clips require direct playable URLs; trailer links may use YouTube/Vimeo.
- **Videos & trailer** owns the shared source URLs and trailer poster. The old separate WebM document is retained for recovery but hidden from the active list.
- **Filmmaking team** owns biographies and portrait selections. **Photography** owns original photographs and their default framing. Shared-item panels show referencing records and known page uses, with edit links.
- A photograph placement can use **Customize crop for this placement**, which copies only an asset reference and framing, not the file. Use the native crop/focal-point editor. The original stays shared. If the photo is replaced, stale local framing is ignored until reset; validation explains how to reset it.
- Page sections with shared collections show collection shortcuts rather than duplicate image lists. Their headings and introductory copy remain page-specific. New bespoke layouts still require code.
- Publish shared photographs/videos separately from the page that references them. Reference editing changes the shared record; selecting a different reference changes only that placement.

The additive migration is `studio/scripts/consolidate-shared-content.mjs` (dry-run by default). Its `--execute` mode writes a private local recovery snapshot before a revision-guarded transaction and verifies original section copy and media selections are unchanged. Never commit these snapshots.

`src/data/cms.mjs` fetches the published projection. `prepare-cms.mjs` freezes one snapshot for all rendering and validation. Core collections render through Astro components; `apply-cms-pages.mjs` binds imported page sections to their existing designed shells at build time. Section copy, rich text, links, photographs and order are CMS-owned. New sections get a basic text-section shell. Preserve hidden `sourceSelector` values when changing existing sections. New bespoke layouts need code changes, not arbitrary HTML in the CMS.

Gallery order and selection, team order, organization list/map order, shared navigation, page SEO, chapter SEO, slideshow selections, video sources and poster images are bound. Video binaries remain outside Sanity. External YouTube/Vimeo URLs use privacy-friendly click-through links rather than autoplay embeds.

Code-owned elements: form field labels and success/error messages, Web3Forms configuration, the logo/fonts, map terrain and rendering, animation behavior, fixed navigation utility labels, and structural chapter-detail labels. These are not pretend CMS controls. Team groups remain editorial metadata rather than a new visual section layout. The existing hand-designed appearance is retained.

## Build safety and recovery

`npm run build` fetches the snapshot, builds 27 routes, applies page content, validates all local links/assets, and checks CMS text, links, SEO, ordered collections and map parity. Missing critical content or build errors prevent deployment; the old site remains online. `cms-version.json` records the successful snapshot hash and build time, never draft content or credentials.

CI uses the public dataset without a read token. It requires only the existing repository's standard GitHub Pages permissions. No subscription upgrades or additional paid services.

Before destructive CMS deletion, export the dataset. To roll back content, restore/re-publish the previous document version and run the workflow. To roll back this integration, revert its Git commit; the prior file-backed site remains in Git history. Do not run the old migration importer to overwrite team edits.

## Local checks

Run `npm run build`, then `npm run preview -- --port 4329`. `TEST_BASE_URL=http://localhost:4329 node scripts/test-cms-browser.mjs` performs read-only desktop/mobile checks and saves screenshots under ignored `.cms/screenshots`. Install the matching Chromium with `npx playwright install chromium` if necessary. No forms are submitted by these tests.
