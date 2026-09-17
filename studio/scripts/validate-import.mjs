/** Read back the approved import and verify content, references, and CDN assets. */
import {readFile, writeFile, rename} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {isDeepStrictEqual} from 'node:util'
import {createHash} from 'node:crypto'
import {getCliClient} from 'sanity/cli'
import {defineQuery} from 'groq'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const plan = JSON.parse(await readFile(path.join(root, 'migration/transformed/import-plan.json'), 'utf8'))
const control = JSON.parse(await readFile(path.join(root, 'migration/state/import-control.json'), 'utf8'))
if (plan.projectId !== '80rpogyy' || plan.dataset !== 'production') throw new Error('Unexpected validation destination')
const client = getCliClient({apiVersion: '2026-09-17'}).withConfig({projectId: plan.projectId, dataset: plan.dataset, useCdn: false, perspective: 'raw'})
// Whole imported documents are needed here for exact migration parity, not a frontend query.
const DOCUMENTS_QUERY = defineQuery('*[_id in $ids]{...}')
const ASSETS_QUERY = defineQuery('*[_id in $ids]{_id,url,size,sha1hash,metadata{dimensions}}')
const docs = await client.fetch(DOCUMENTS_QUERY, {ids: plan.documents.map(doc => doc._id)})
const assets = await client.fetch(ASSETS_QUERY, {ids: Object.values(control.assets)})
const byId = new Map(docs.map(doc => [doc._id, doc]))
const assetsById = new Map(assets.map(asset => [asset._id, asset]))
const errors = [], editsPreserved = []
let referenceCount = 0, blockCount = 0
const expectedValue = value => {
  if (Array.isArray(value)) return value.map(expectedValue)
  if (!value || typeof value !== 'object') return value
  if (value.$asset) return {_type: 'reference', _ref: control.assets[value.$asset]}
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, expectedValue(child)]))
}
function inspect(value, source) {
  if (Array.isArray(value)) {value.forEach(item => inspect(item, source)); return}
  if (!value || typeof value !== 'object') return
  if (value._ref) {
    referenceCount++
    if (!byId.has(value._ref) && !assetsById.has(value._ref)) errors.push(`${source}: unresolved reference ${value._ref}`)
  }
  if (value._type === 'block') {
    blockCount++
    if (!Array.isArray(value.children) || value.children.some(child => child._type !== 'span' || typeof child.text !== 'string')) errors.push(`${source}: invalid Portable Text block`)
  }
  Object.values(value).forEach(child => inspect(child, source))
}
for (const expected of plan.documents) {
  const actual = byId.get(expected._id)
  if (!actual) {errors.push(`Missing document: ${expected.sourceKey}`); continue}
  for (const [field, value] of Object.entries(expectedValue(expected))) {
    if (!isDeepStrictEqual(value, actual[field])) {
      const message = `${expected.sourceKey}.${field}: differs from approved source`
      if (control.documents[expected._id] === 'preserved-existing') editsPreserved.push(message)
      else errors.push(message)
    }
  }
  inspect(actual, expected.sourceKey)
}
let verifiedAssets = 0
for (const asset of plan.assets) {
  const actual = assetsById.get(control.assets[asset.sha256])
  if (!actual) {errors.push(`Missing asset: ${asset.sourcePath}`); continue}
  const file = await readFile(path.join(root, 'website/public', asset.sourcePath))
  const sha1 = createHash('sha1').update(file).digest('hex')
  if (actual.sha1hash !== sha1 || actual.size !== asset.bytes) errors.push(`Asset bytes differ: ${asset.sourcePath}`)
  if (actual.metadata?.dimensions?.width !== asset.width || actual.metadata?.dimensions?.height !== asset.height) errors.push(`Asset dimensions differ: ${asset.sourcePath}`)
  if (!actual.url?.startsWith(`https://cdn.sanity.io/images/${plan.projectId}/${plan.dataset}/`)) {errors.push(`Unexpected asset host: ${asset.sourcePath}`); continue}
  try {
    const response = await fetch(actual.url, {method: 'HEAD', signal: AbortSignal.timeout(15000)})
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) errors.push(`CDN unavailable: ${asset.sourcePath} (${response.status})`)
    else verifiedAssets++
  } catch {errors.push(`CDN request failed: ${asset.sourcePath}`)}
  if (verifiedAssets % 10 === 0) console.log(`Verified ${verifiedAssets}/${plan.assets.length} CDN images`)
}
const chapterDocs = docs.filter(doc => doc._type === 'chapter').sort((a,b) => a.number - b.number)
if (chapterDocs.map(doc => doc.number).join(',') !== '1,2,3,4,5,6') errors.push('Chapter sequence mismatch')
const routes = docs.filter(doc => doc.route).map(doc => doc.route).concat(chapterDocs.map(doc => `/${doc.slug.current}/`))
if (routes.length !== 15 || new Set(routes).size !== 15) errors.push('Canonical route coverage mismatch')
if (byId.get('siteSettings')?.releaseLabel !== 'Coming October 2026') errors.push('Release label needs review')
const report = {checkedAt: new Date().toISOString(), projectId: plan.projectId, dataset: plan.dataset, documents: docs.length, expectedDocuments: plan.documents.length, assets: assets.length, cdnImagesVerified: verifiedAssets, referencesChecked: referenceCount, portableTextBlocksChecked: blockCount, canonicalRoutes: routes, galleryPhotographs: docs.filter(doc => doc._type === 'photograph' && doc.gallery).length, counts: Object.fromEntries([...new Set(docs.map(doc => doc._type))].map(type => [type, docs.filter(doc => doc._type === type).length])), editsPreserved, errors, passed: errors.length === 0}
const output = path.join(root, 'migration/reports/import-verification.json')
await writeFile(`${output}.tmp`, JSON.stringify(report, null, 2) + '\n'); await rename(`${output}.tmp`, output)
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exitCode = 1
