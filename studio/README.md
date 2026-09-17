# La Gente de la Tierra · Editorial Studio

Studio: https://la-gente-de-la-tierra.sanity.studio/

Project: `80rpogyy` · dataset: `production` · owner: Ben Keller organization.

## Status

The branded Studio and schemas are deployed. The approved collection was imported and verified on 2026-09-17: 100 documents and 60 image assets. Team members can now edit this content in Sanity. The website now builds from published Sanity content. See `../website/SANITY-PUBLISHING.md` for deployment timing, scope, validation and recovery.

## Local commands

Use Node 22.12 or newer. Run `npm ci` in this directory.

- `npm run dev` — local Studio
- `npm run check` — TypeScript checks
- `npm run build` — production Studio build
- `npm run typegen` — extract schema and generate TypeScript types
- `npm run migration:prepare` — offline source snapshot, transformation and validation; build `../website` first
- `npm run migration:dry-run` — show upload scope without network writes
- `npm run migration:import` — **only after explicit content-upload approval**; authenticated CLI import
- `npm run migration:verify` — read-back comparison, reference checks, image hashes/dimensions and CDN checks
- `npm run deploy` — deploy this Studio, not the public website

## For the team

Sign in using the account invited to this Sanity project. The Start here page has direct links to the nine page documents. The Edit website tool also exposes chapters, organizations and map locations, biographies, FAQs, the photo collection and videos.

Photographs are reused by reference. Update the crop/focal point on the source photograph; an individual placement can override its alternative text. Unknown credits and captions are flagged for review, not filled with guesses.

Photography has two views: **All photographs** and **Media selection**. Toggle “Include in the Media gallery” in a photograph's Details tab to include or remove it. In Media selection, drag photos to change their sequence. The existing 48-photo selection was preserved when ordering was initialized. The numeric import-order field is retained privately for provenance; `orderRank` now controls editorial ordering. The public gallery now uses `orderRank` and the published selection.

Free-plan-compatible features only. Comments, tasks, scheduled drafts and releases are explicitly disabled. Free editors require Administrator access; do not invite team members without agreeing their role. The dataset is public: store only publishable website content, never private correspondence or API tokens.

## Page-editor shortcuts

Each page editor includes an **Also on this page** panel above its fields. Media links to Media selection, All photographs and Videos; Chapters links to the six chapter stories and photographs; About links to the team, FAQs and photographs; Get involved links to organizations and photographs. Home and Press kit include their relevant shared collections, while Contact, Privacy and Not found link to shared site identity. These are Studio-router links, not duplicated content or external website links. Browser Back returns to the page editor.

## Organization page order

**Organizations & map** displays one saved sequence with drag handles. Drag rows to change editorial page order; there are no alternative sort, reset-order, or debug-increment controls. The initial sequence is preserved from the imported website data. The original numeric order remains hidden for provenance. The public site uses this same `orderRank` sequence for the list and map.

## Team sorting and grouping

**Filmmaking team** opens directly to the drag-sortable member list, with no grouping submenu. Choose, create or edit a **Team group** only within each member's Story & copy tab. Existing ranks and group assignments are preserved. Groups are optional, and renaming a referenced group updates its label for all assigned members. Publish group and member edits when ready. The About page shortcut also opens the member list directly; there is no separate group shortcut.

The public site sorts people by `orderRank`. Group names save directly and remain optional editorial metadata; membership edits publish with the person.

## Publishing connection

Published content is fetched once per build. GitHub checks every five minutes for changed published content, then builds, validates and deploys. Runs may be delayed by GitHub; use the workflow’s Run workflow button for a manual request. Failed builds leave the last successful site online. Draft copy remains private to the editorial workflow until Publish (the dataset itself is public; never store confidential content). Read `../website/SANITY-PUBLISHING.md` for exact bindings, code-owned elements and schedule limitations.
