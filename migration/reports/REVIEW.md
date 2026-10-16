# Import review checkpoint · 2026-09-17

Update: the user approved this import, and it completed on 2026-09-17. The live website is unchanged. The deployed Studio now contains the imported collection. The original review scope is retained below for provenance.

## Prepared upload

- 60 image assets, 8,307,382 bytes (about 8.3 MB)
- 100 documents: 60 photographs, 10 organizations, 6 chapters, 4 people, 7 FAQs, 9 pages, 1 site settings document, 3 video references
- 48 photographs remain selected for the Media gallery
- 75 editorial image files consolidated into 60 selections; original local files are retained
- Map texture and optimized videos remain in the website repository
- Only current English website content; no WordPress archives or unpublished material

## Validation performed

- Existing website build and GitHub Pages validator: passed, 27 HTML files including aliases
- Studio TypeScript check and production build: passed
- Schema extraction and TypeGen: passed
- Offline asset/reference/array-key checks: passed
- Source count checks (chapters, organizations, people, FAQs): passed
- Repeat preparation: byte-identical import plan and IDs
- Import command default: dry run with no writes

## Editorial and integration review

Dependency review: `npm audit --omit=dev` reports 14 advisories (12 moderate, 2 high) in the installed Sanity/CLI dependency graph, including YAML/TOML parser dependencies. No forced major downgrade was applied. Review upstream-compatible fixes and browser-bundle exposure before declaring the full system production-ready.

35 photographs lack verified collection-level caption/alternative text. Existing descriptive text is preserved where available; credits are not invented. Individual placement alt text can still be present. Review these in the Studio's photo review lists after upload.

Page sections are a content starting point, not a finished renderer contract. Form labels/status messages remain source-owned pending their dedicated bindings. Do not point the live build at these documents until mapping and visual parity are verified. The imported schema/data model will be refined alongside frontend integration without overwriting team edits.

## Approval and execution

Approved and executed in `80rpogyy/production`. Existing documents are preserved, not replaced. The importer records progress atomically, logs each completed file/document, and supports stopping/restarting with the same plan. This upload did not deploy the public website.

Results: 100/100 documents matched the prepared source, 60/60 image assets matched source hashes and dimensions and were accessible on the CDN, 113 references resolved, 91 Portable Text blocks checked, all 15 canonical route values preserved, and 48 photographs selected for the gallery. Sanity's document validation returned no errors or warnings after correcting the schema's handling of `#trailer` links. A second import run completed without any asset uploads or document creations. See `import-verification.json` for the machine-readable results.
