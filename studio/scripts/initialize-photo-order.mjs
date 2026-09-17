/** Populate missing ranks without changing the existing media selection or its order. */
import {getCliClient} from 'sanity/cli'
import {defineQuery} from 'groq'
import {LexoRank} from 'lexorank'

const client = getCliClient({apiVersion: '2026-09-17'}).withConfig({projectId: '80rpogyy', dataset: 'production', useCdn: false, perspective: 'raw'})
const PHOTO_ORDER_QUERY = defineQuery('*[_type == "photograph"] | order(order asc, _id asc){_id,_rev,order,orderRank,gallery}')
const photos = await client.fetch(PHOTO_ORDER_QUERY)
const ranked = photos.filter(photo => photo.orderRank).map(photo => photo.orderRank).sort()
let last = ranked.length ? LexoRank.parse(ranked.at(-1)) : LexoRank.middle()
const ranks = new Map(photos.filter(photo => photo.orderRank).map(photo => [photo._id.replace(/^drafts\./, ''), photo.orderRank]))
const patches = []
for (const photo of photos) {
  if (photo.orderRank) continue
  const logicalId = photo._id.replace(/^drafts\./, '')
  if (!ranks.has(logicalId)) {last = last.genNext(); ranks.set(logicalId, last.toString())}
  patches.push({id: photo._id, revision: photo._rev, rank: ranks.get(logicalId)})
}
console.log(`Missing ranks: ${patches.length}. Existing ranks and selection flags will be preserved.`)
if (process.argv.includes('--execute') && patches.length) {
  let transaction = client.transaction()
  for (const patch of patches) transaction = transaction.patch(patch.id, p => p.ifRevisionId(patch.revision).setIfMissing({orderRank: patch.rank}))
  await transaction.commit()
  const updated = await client.fetch(PHOTO_ORDER_QUERY)
  if (updated.some(photo => !photo.orderRank)) throw new Error('Some photographs still lack ranks')
  if (!ranked.length) {
    const expected = photos.filter(photo => photo.gallery && !photo._id.startsWith('drafts.')).map(photo => photo._id)
    const actual = updated.filter(photo => photo.gallery && !photo._id.startsWith('drafts.')).sort((a,b) => a.orderRank < b.orderRank ? -1 : a.orderRank > b.orderRank ? 1 : 0).map(photo => photo._id)
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Initial media order verification failed')
    console.log(`Verified: all ${actual.length} selected photographs retain their original sequence.`)
  }
  console.log('Photo ranks initialized.')
}
