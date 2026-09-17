/** Add missing team/organization/FAQ ranks, preserving imported order and editorial fields. */
import {getCliClient} from 'sanity/cli'
import {LexoRank} from 'lexorank'

const client = getCliClient({apiVersion: '2026-09-17'}).withConfig({projectId: '80rpogyy', dataset: 'production', useCdn: false, perspective: 'raw'})
const type = process.argv.includes('--faqs') ? 'faq' : process.argv.includes('--organizations') ? 'organization' : 'person'
const query = '*[_type == $type] | order(order asc, _id asc){_id,_rev,orderRank}'
const people = await client.fetch(query, {type})
const ranked = people.filter(p => p.orderRank)
let last = ranked.length ? LexoRank.parse(ranked.map(p => p.orderRank).sort().at(-1)) : LexoRank.middle()
const ranks = new Map(ranked.map(p => [p._id.replace(/^drafts\./, ''), p.orderRank]))
const missing = people.filter(p => !p.orderRank)
console.log(`${type} documents missing ranks: ${missing.length}`)
if (process.argv.includes('--execute') && missing.length) {
  let transaction = client.transaction()
  for (const person of missing) {
    const id = person._id.replace(/^drafts\./, '')
    if (!ranks.has(id)) {last = last.genNext(); ranks.set(id, last.toString())}
    transaction = transaction.patch(person._id, p => p.ifRevisionId(person._rev).setIfMissing({orderRank: ranks.get(id)}))
  }
  await transaction.commit()
  const updated = await client.fetch(query, {type})
  if (updated.some(p => !p.orderRank)) throw new Error('Missing ranks after initialization')
  if (!ranked.length) {
    const expected = people.filter(p => !p._id.startsWith('drafts.')).map(p => p._id)
    const actual = updated.filter(p => !p._id.startsWith('drafts.')).sort((a,b) => a.orderRank.localeCompare(b.orderRank)).map(p => p._id)
    if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error('Sequence changed unexpectedly')
  }
  console.log(`Verified ${updated.length} ${type} ranks; existing sequence preserved. No other content changed.`)
}
