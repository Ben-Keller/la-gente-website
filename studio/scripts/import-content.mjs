/** Explicit opt-in, single-worker importer. Run only after reviewing the preflight. */
import {readFile, writeFile, rename, appendFile, mkdir, open, unlink} from 'node:fs/promises'
import {createReadStream} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash} from 'node:crypto'
import {getCliClient} from 'sanity/cli'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const stateDir = path.join(root, 'migration/state')
const planText = await readFile(path.join(root, 'migration/transformed/import-plan.json'), 'utf8')
const plan = JSON.parse(planText)
const sha256 = value => createHash('sha256').update(value).digest('hex')
if (plan.projectId !== '80rpogyy' || plan.dataset !== 'production') throw new Error('Unexpected import destination. Refusing to continue.')
if (!process.argv.includes('--execute')) {
  console.log(`DRY RUN: ${plan.assets.length} assets and ${plan.documents.length} documents prepared for ${plan.projectId}/${plan.dataset}. No writes performed.`)
  console.log('Review migration/reports/preflight.json, then explicitly approve the upload before using --execute.')
  process.exit(0)
}
await mkdir(stateDir, {recursive: true})
const lockPath = path.join(stateDir, 'import.lock')
let lock
try {lock = await open(lockPath, 'wx')} catch {throw new Error('Import lock exists. Confirm no importer is running before removing migration/state/import.lock.')}
await lock.writeFile(JSON.stringify({pid: process.pid, started: new Date().toISOString()}))
const statePath = path.join(stateDir, 'import-control.json')
let control = {planHash: sha256(planText), assets: {}, documents: {}, status: 'ready', updatedAt: ''}
let stopping = false
process.on('SIGINT', () => {stopping = true})
process.on('SIGTERM', () => {stopping = true})
async function save() {
  control.updatedAt = new Date().toISOString()
  await writeFile(`${statePath}.tmp`, JSON.stringify(control, null, 2))
  await rename(`${statePath}.tmp`, statePath)
}
async function log(event, details = {}) {
  const entry = {time: new Date().toISOString(), event, ...details}
  await appendFile(path.join(stateDir, 'import.jsonl'), `${JSON.stringify(entry)}\n`)
  console.log(JSON.stringify(entry))
}
try {
  try {
    const previous = JSON.parse(await readFile(statePath, 'utf8'))
    if (previous.planHash !== sha256(planText)) throw new Error('Import plan changed after execution began. Review/reset the checkpoint intentionally before continuing.')
    control = previous
  } catch (error) {if (error.code !== 'ENOENT') throw error}
  const client = getCliClient({apiVersion: '2026-09-17'}).withConfig({projectId: plan.projectId, dataset: plan.dataset, useCdn: false, perspective: 'raw'})
  // Recover/check source identity before any write; never silently duplicate imported content.
  const existing = await client.fetch('*[defined(sourceKey)]{_id,sourceKey}')
  for (const doc of plan.documents) {
    const matches = existing.filter(item => item.sourceKey === doc.sourceKey)
    if (matches.some(item => item._id.replace(/^drafts\./, '') !== doc._id)) throw new Error(`Source identity conflict: ${doc.sourceKey}. Recover the original ID map before importing.`)
    if (matches.length) control.documents[doc._id] = 'preserved-existing'
  }
  control.status = 'uploading-assets'; await save()
  for (const asset of plan.assets) {
    if (stopping) break
    if (control.assets[asset.sha256]) continue
    const file = path.resolve(root, 'website/public', `.${asset.sourcePath}`)
    const allowedRoot = path.resolve(root, 'website/public') + path.sep
    if (!file.startsWith(allowedRoot)) throw new Error('Unsafe source asset path')
    if (sha256(await readFile(file)) !== asset.sha256) throw new Error(`Source changed: ${asset.sourcePath}. Regenerate and review the preflight.`)
    await log('asset-start', {source: asset.sourcePath, bytes: asset.bytes})
    const uploaded = await client.assets.upload('image', createReadStream(file), {filename: path.basename(file), contentType: 'image/webp'})
    control.assets[asset.sha256] = uploaded._id
    await save(); await log('asset-complete', {source: asset.sourcePath, completed: Object.keys(control.assets).length, total: plan.assets.length})
  }
  function resolve(value) {
    if (Array.isArray(value)) return value.map(resolve)
    if (!value || typeof value !== 'object') return value
    if (value.$asset) {
      const _ref = control.assets[value.$asset]
      if (!_ref) throw new Error(`Missing uploaded asset ${value.$asset}`)
      return {_type: 'reference', _ref}
    }
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolve(child)]))
  }
  if (!stopping) {
    control.status = 'creating-documents'; await save()
    for (const document of plan.documents) {
      if (stopping) break
      if (control.documents[document._id]) continue
      await client.createIfNotExists(resolve(document))
      control.documents[document._id] = 'created'
      await save(); await log('document-complete', {source: document.sourceKey, completed: Object.keys(control.documents).length, total: plan.documents.length})
    }
  }
  if (!stopping) {
    const result = await client.fetch('*[_id in $ids]{_id,_type}', {ids: plan.documents.map(doc => doc._id)})
    if (result.length !== plan.documents.length) throw new Error(`Post-import count mismatch: ${result.length}/${plan.documents.length}`)
  }
  control.status = stopping ? 'stopped' : 'complete'; await save(); await log(control.status)
} catch (error) {
  control.status = 'failed'; await save(); await log('failed', {message: error.message}); process.exitCode = 1
} finally {
  await lock.close(); await unlink(lockPath)
}
