/** Add explicit page ownership without overwriting editorial fields. Dry-run by default. */
import {getCliClient} from 'sanity/cli'
import {mkdir, writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
const client = getCliClient({apiVersion: '2026-09-17'}).withConfig({projectId: '80rpogyy', dataset: 'production', useCdn: false, perspective: 'raw'})
const documents = await client.fetch('*[!(_id in path("_.**"))]')
const source = key => documents.find(d => !d._id.startsWith('drafts.') && d.sourceKey === key)
const background = source('video:/video/stripey-vlc.mp4')
const webm = source('video:/video/stripey-vlc.webm')
const trailer = source('video:/video/trailer-vertical.mp4')
assert.ok(background && webm && trailer, 'Expected imported clips are missing')
// Separate format drafts must be reviewed, not silently retired.
assert.ok(!documents.some(d => d._id === `drafts.${webm._id}`), 'WebM has an editorial draft; reconcile it before consolidating.')
const ref = doc => ({_type: 'reference', _ref: doc._id})
const kinds = {
  homePage: ['opening','trailer','content','chapters','content','content'],
  aboutPage: ['content','content','content','content','content','team','faqs'],
  chaptersPage: ['chapters'], involvementPage: ['content','organizations','content'],
  mediaPage: ['content','trailer','gallery'],
  pressPage: ['content','content','content','team','content','content','content'],
}
const updates = []
for (const doc of documents) {
  const missing = {}
  const changes = {}
  const baseId = doc._id.replace(/^drafts\./, '')
  if (baseId === background._id) {
    if (!doc.webmUrl) missing.webmUrl = webm.url
    if (!doc.purpose) missing.purpose = 'background'
    if (doc.title === 'Landing background · MP4') changes.title = 'Landing background'
  }
  if (baseId === webm._id && !doc.supersededBy) missing.supersededBy = ref(background)
  if (['homePage', 'mediaPage'].includes(doc._type) && !doc.trailer) missing.trailer = ref(trailer)
  if (doc._type === 'homePage') {
    if (!doc.backgroundVideo) missing.backgroundVideo = ref(background)
    if (!doc.openingImages) {
      const images = doc.featuredImages?.length ? doc.featuredImages : doc.sections?.find(s => s.sourceSelector === 'main > :nth-child(1)')?.images
      assert.ok(images?.length, 'No opening images to preserve')
      missing.openingImages = images
    }
  }
  for (const section of doc.sections || []) {
    const index = Number(section.sourceSelector?.match(/nth-child\((\d+)\)/)?.[1]) - 1
    if (!section.kind) missing[`sections[_key=="${section._key}"].kind`] = kinds[doc._type]?.[index] || 'content'
  }
  if (Object.keys(missing).length || Object.keys(changes).length) updates.push({doc, missing, changes})
}
console.log(`${updates.length} documents need additive ownership updates. Existing copy, media and drafts are retained.`)
if (process.argv.includes('--execute') && updates.length) {
  await mkdir('.migration-backups', {recursive: true})
  const backup = `.migration-backups/shared-content-${Date.now()}.ndjson`
  await writeFile(backup, documents.map(d => JSON.stringify(d)).join('\n') + '\n', {flag: 'wx', mode: 0o600})
  console.log(`Recovery snapshot: ${backup}`)
  let tx = client.transaction()
  for (const {doc, missing, changes} of updates) tx = tx.patch(doc._id, p => p.ifRevisionId(doc._rev).setIfMissing(missing).set(changes))
  await tx.commit()
  const after = await client.fetch('*[_id in $ids]', {ids: updates.map(u => u.doc._id)})
  for (const {doc} of updates) {
    const next = after.find(d => d._id === doc._id)
    // Explicitly prove original section content and photograph choices survived.
    for (const key of ['featuredImages', 'url', 'poster']) assert.deepEqual(next[key], doc[key])
    if (doc.sections) assert.deepEqual(next.sections.map(({kind, ...s}) => s), doc.sections.map(({kind, ...s}) => s))
  }
  console.log('Verified: original page copy, selections, clips and posters unchanged.')
}
