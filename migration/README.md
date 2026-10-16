# Sanity content migration

Target: project `80rpogyy`, public dataset `production`. Source: the current Astro rebuild and its retained optimized media, not WordPress. Only the current English published site is in scope; old drafts, archived WordPress content and revision history are not imported.

## Workflow

1. Build `website` to snapshot exactly what the current source renders.
2. In `studio`, run `npm run migration:prepare`. This makes **no network requests**.
3. Review `migration/reports/preflight.json`, schema validation and the prepared content before approving uploads.
4. After approval, run the resumable import. It creates missing content only; it must not overwrite later editorial changes.
5. Validate document counts, references, media and representative pages in the Studio.
6. Complete frontend bindings, preview and publishing wiring, then compare all 15 canonical routes and their existing aliases before cutover.

## Mapping

| Source | Sanity destination |
|---|---|
| `chapters.ts` | Six `chapter` documents, Portable Text narratives, organization reference, photo placements |
| `organizations.ts` | Ten `organization` documents, approximate geopoints, links and historical notes |
| About team / FAQ markup | Four `person` and seven `faq` documents; inline links preserved |
| Press team blurbs | Distinct `person.shortBio` fields |
| Site identity/navigation | Fixed `siteSettings` singleton |
| Nine non-chapter pages | Dedicated singleton page types with ordered sections and SEO |
| Retained WebP files | `photograph` collection with image assets, aliases, captions and gallery ordering |
| Three optimized videos | `video` documents referencing existing site paths; no Sanity video upload |

Known same-name files in the gallery/recovered folders are variants of a source photograph: select the largest pixel dimensions, retain every source path as an alias. Differently named editorial crops stay distinct. Asset uploads additionally deduplicate by hash. Unknown captions, credits and permissions are never invented.

Singleton IDs are fixed. Other IDs are allocated once in the durable source-key map and reused, never regenerated on retry. Losing `state/document-ids.json` after import requires recovery from Sanity `sourceKey` values before rerunning; do not generate a fresh map against a populated dataset.

`extracted/`, `transformed/`, and `state/` are ignored by Git. Preserve them until import and rollback validation finish. Scripts write atomic checkpoints; source snapshots permit offline review. No credentials belong in these files.

## Cutover guardrails

- Keep the current static GitHub Pages deployment until CMS parity checks pass.
- Preserve October 2026 wording, all six chapters, canonical paths and redirect aliases.
- Keep the desktop video/mobile photo behavior, D3 map and PhotoSwipe gallery.
- No form submissions, public deployment, or wholesale replacement of CMS documents as an incidental test.
- Free plan only; no comments/tasks/scheduling/private datasets or paid integrations.
- Publishing in Sanity is not the same as a successful public deployment; surface both states separately.
