/** Read-only source extraction. This script never contacts Sanity. */
import {readFile, writeFile, mkdir, rename, readdir} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash, randomUUID} from 'node:crypto'
import {load} from 'cheerio'
import sharp from 'sharp'
import {chapters} from '../../website/src/data/chapters'
import {organizations} from '../../website/src/data/organizations'
import {SITE, primaryNavigation, footerNavigation, socialLinks} from '../../website/src/data/site'
import {galleryIds, galleryCaptions} from '../../website/src/data/gallery'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const migration = path.join(root, 'migration')
const publicDir = path.join(root, 'website/public')
const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
const clean = (value: string) => value.replace(/\s+/g, ' ').trim()
for (const name of ['state', 'reports', 'extracted', 'transformed']) await mkdir(path.join(migration, name), {recursive: true})
async function atomic(file: string, value: unknown) {
  const temp = `${file}.tmp`
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`)
  await rename(temp, file)
}
const mapPath = path.join(migration, 'state/document-ids.json')
let ids: Record<string, string> = {}
try {ids = JSON.parse(await readFile(mapPath, 'utf8'))} catch (error) {if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error}
// IDs are allocated once, durably recorded, then reused for every retry.
async function id(sourceKey: string) {
  if (!ids[sourceKey]) {ids[sourceKey] = randomUUID(); await atomic(mapPath, ids)}
  return ids[sourceKey]
}
const reference = (_ref: string) => ({_type: 'reference', _ref})
const key = (value: string) => hash(value).slice(0, 16)
const paragraphs = (values: string | string[]) => (Array.isArray(values) ? values : [values]).filter(Boolean).map((text, index) => ({_type: 'block', _key: key(`${index}:${text}`), style: 'normal', markDefs: [], children: [{_type: 'span', _key: 'text', text, marks: []}]}))

// Preserve inline links and emphasis; rich text is never imported as raw HTML.
function portableText(html: string) {
  const $ = load(html, {}, false)
  const blocks: any[] = []
  $('p, h3, h4, blockquote, li').each((i, element) => {
    if ($(element).parents('p, h3, h4, blockquote, li').length) return
    const children: any[] = [], markDefs: any[] = []
    function walk(node: any, marks: string[] = []) {
      if (node.type === 'text') {if (node.data) children.push({_type: 'span', _key: `s${children.length}`, text: node.data.replace(/\s+/g, ' '), marks}); return}
      if (node.name === 'br') {children.push({_type: 'span', _key: `s${children.length}`, text: '\n', marks}); return}
      const next = [...marks]
      if (['strong', 'b'].includes(node.name)) next.push('strong')
      if (['em', 'i'].includes(node.name)) next.push('em')
      if (node.name === 'a' && node.attribs?.href) {
        const _key = `link${markDefs.length}`
        markDefs.push({_key, _type: 'link', href: node.attribs.href}); next.push(_key)
      }
      for (const child of node.children || []) walk(child, next)
    }
    walk(element)
    if (children.length) blocks.push({_type: 'block', _key: `b${i}`, style: ['h3', 'h4'].includes(element.tagName) ? 'h3' : element.tagName === 'blockquote' ? 'blockquote' : 'normal', ...(element.tagName === 'li' ? {listItem: $(element).parent().is('ol') ? 'number' : 'bullet', level: 1} : {}), markDefs, children})
  })
  return blocks
}

const issues: {severity: string; source: string; message: string}[] = []
const documents: any[] = []
const assets: any[] = []
const photoByPath = new Map<string, string>()
const photoByName = new Map<string, {id: string; asset: any}>()
async function files(dir: string): Promise<string[]> {
  const result: string[] = []
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...await files(full))
    else if (/\.webp$/i.test(entry.name)) result.push(full)
  }
  return result.sort()
}
const sourceImages = []
for (const file of await files(path.join(publicDir, 'images'))) {
  if (file.includes(`${path.sep}maps${path.sep}`)) continue // Terrain is a code-owned map texture, not editorial photography.
  const data = await readFile(file), metadata = await sharp(data).metadata()
  const sourcePath = `/${path.relative(publicDir, file).split(path.sep).join('/')}`
  sourceImages.push({sourcePath, name: path.basename(file, '.webp'), sha256: hash(data), bytes: data.length, width: metadata.width!, height: metadata.height!})
}
// A gallery/recovered pair with the same original filename is one known source photograph.
// Keep distinct named crops (for example hero-poster) as separate editorial assets.
for (const image of sourceImages) {
  let photo = photoByName.get(image.name)
  if (!photo) {
    const photoId = await id(`photograph:${image.name}`)
    const asset = {...image, paths: [image.sourcePath]}
    photo = {id: photoId, asset}; photoByName.set(image.name, photo); assets.push(asset)
  } else {
    photo.asset.paths.push(image.sourcePath)
    if (image.width * image.height > photo.asset.width * photo.asset.height) Object.assign(photo.asset, image)
  }
  photoByPath.set(image.sourcePath, photo.id)
}
for (const [name, photo] of photoByName) {
  const caption = galleryCaptions[name]
  documents.push({_id: photo.id, _type: 'photograph', sourceKey: `photograph:${name}`, title: caption || name.replaceAll('-', ' '), ...(caption ? {caption, alt: caption} : {}), image: {_type: 'image', asset: {$asset: photo.asset.sha256}}, sourcePaths: photo.asset.paths, gallery: galleryIds.includes(name), order: galleryIds.indexOf(name) >= 0 ? galleryIds.indexOf(name) : 1000})
  if (!caption) issues.push({severity: 'editorial', source: name, message: 'No verified caption/alternative text; review visually. No credit was invented.'})
}
function placement(sourcePath: string, alt?: string) {
  const photoId = photoByPath.get(sourcePath)
  if (!photoId) throw new Error(`Missing photograph: ${sourcePath}`)
  return {_type: 'imagePlacement', photograph: reference(photoId), ...(alt ? {alt} : {})}
}
for (const [index, org] of organizations.entries()) {
  documents.push({_id: await id(`organization:${org.name}`), _type: 'organization', sourceKey: `organization:${org.name}`, name: org.name, category: org.type, place: org.place, location: {_type: 'geopoint', lng: org.coordinates[0], lat: org.coordinates[1]}, description: paragraphs(org.description), image: placement(org.image), link: {_type: 'siteLink', label: org.action, href: org.url}, ...(org.linkNote ? {linkNote: org.linkNote} : {}), status: index === 0 ? 'historical' : 'current', order: index})
}
for (const chapter of chapters) {
  const orgId = ids[`organization:${chapter.relatedOrganization}`]
  if (!orgId) throw new Error(`Unresolved chapter organization: ${chapter.relatedOrganization}`)
  documents.push({_id: await id(`chapter:${chapter.slug}`), _type: 'chapter', sourceKey: `chapter:${chapter.slug}`, number: chapter.number, title: chapter.title, community: chapter.community, slug: {_type: 'slug', current: chapter.slug}, eyebrow: chapter.eyebrow, summary: chapter.summary, themes: chapter.themes, region: chapter.region, elevation: chapter.elevation, location: chapter.location, locationDescription: paragraphs(chapter.locationDescription), story: paragraphs(chapter.story), environmentalFocus: paragraphs(chapter.environmentalFocus), productionNote: paragraphs(chapter.productionNote), hero: placement(chapter.images.hero), portrait: placement(chapter.images.portrait), landscape: placement(chapter.images.landscape), organization: reference(orgId)})
}
const aboutHtml = await readFile(path.join(root, 'website/dist/about/index.html'), 'utf8')
const about = load(aboutHtml)
const press = load(await readFile(path.join(root, 'website/dist/press-kit/index.html'), 'utf8'))
for (const [index, member] of about('.team-grid article').toArray().entries()) {
  const el = about(member), name = clean(el.find('h3').text())
  const short = press('.press-columns article').filter((_, element) => clean(press(element).find('h2').text()) === name).find('p')
  documents.push({_id: await id(`person:${name}`), _type: 'person', sourceKey: `person:${name}`, name, role: clean(el.find('.team-role').text()), portrait: placement(el.find('img').attr('src')!, el.find('img').attr('alt')), bio: portableText(el.find('p').not('.team-role').toArray().map(p => about.html(p)).join('')), ...(short.length ? {shortBio: portableText(press.html(short))} : {}), order: index})
}
for (const [index, element] of about('.faq-section details').toArray().entries()) {
  const el = about(element), question = clean(el.find('summary').text())
  documents.push({_id: await id(`faq:${index}`), _type: 'faq', sourceKey: `faq:${index}`, question, answer: portableText(el.find('p').toArray().map(p => about.html(p)).join('')), order: index})
}
const pageDefinitions = [
  ['homePage', 'Home', '/'], ['aboutPage', 'About', '/about/'], ['chaptersPage', 'Chapters', '/communities/'], ['involvementPage', 'Get involved', '/get-involved/'], ['mediaPage', 'Media', '/media/'], ['contactPage', 'Contact', '/contact-us/'], ['pressPage', 'Press kit', '/press-kit/'], ['privacyPage', 'Privacy', '/privacy/'], ['notFoundPage', 'Not found', '/404.html'],
]
const snapshots: any[] = []
for (const [type, title, route] of pageDefinitions) {
  const file = route === '/404.html' ? '404.html' : `${route.slice(1)}index.html`
  const html = await readFile(path.join(root, 'website/dist', file), 'utf8')
  const $ = load(html)
  $('br').replaceWith(' ')
  snapshots.push({route, html, sha256: hash(html)})
  const sections: any[] = []
  $('main').children('header,section,div,aside,article').each((index, element) => {
    const el = $(element).clone()
    // These are separately modelled collections, not duplicate page copy.
    el.find('.team-grid, .faq-section details, details, .chapter-grid, .chapter-story, .press-columns, .organization-accordion, .organization-list, .involvement-map, #media-gallery, script, style, form').remove()
    const heading = clean(el.find('h1,h2').first().text()), eyebrow = clean(el.find('.eyebrow').first().text())
    const links = el.find('a').toArray().filter(a => !$(a).closest('p,li').length).map((a, i) => ({_type: 'siteLink', _key: `l${i}`, label: clean($(a).text()) || $(a).attr('aria-label') || 'Open link', href: $(a).attr('href')})).filter(a => a.href)
    const imagePaths = [...new Set(el.find('img').toArray().map(img => $(img).attr('src')).filter((src): src is string => !!src && photoByPath.has(src)))]
    el.find('.eyebrow').remove()
    el.find('h1,h2').first().remove()
    el.find('h1,h2').each((_, heading) => {$(heading).replaceWith($('<h3>').text($(heading).text()))})
    const body = portableText(el.html() || '')
    if (!heading && !eyebrow && !body.length && !links.length && !imagePaths.length) return
    sections.push({_type: 'contentSection', _key: `section${index}`, label: heading || eyebrow || `Section ${index + 1}`, heading, eyebrow, body, links, images: imagePaths.map((src, i) => ({...placement(src), _key: `image${i}`})), sourceSelector: `main > :nth-child(${index + 1})`})
  })
  documents.push({_id: type, _type: type, sourceKey: `page:${route}`, title, route, seo: {_type: 'seo', title: $('title').text(), description: $('meta[name="description"]').attr('content') || ''}, sections})
}
const links = (values: readonly {label: string; href: string}[]) => values.map((item, i) => ({_type: 'siteLink', _key: `link${i}`, ...item}))
documents.push({_id: 'siteSettings', _type: 'siteSettings', sourceKey: 'site:identity', ...SITE, defaultImage: placement(SITE.defaultImage), releaseLabel: 'Coming October 2026', primaryNavigation: links(primaryNavigation), footerNavigation: links(footerNavigation), socialLinks: links(socialLinks)})
for (const [name, url, mimeType] of [['Landing background · WebM', '/video/stripey-vlc.webm', 'video/webm'], ['Landing background · MP4', '/video/stripey-vlc.mp4', 'video/mp4'], ['Trailer', '/video/trailer-vertical.mp4', 'video/mp4']]) {
  const data = await readFile(path.join(publicDir, url))
  documents.push({_id: await id(`video:${url}`), _type: 'video', sourceKey: `video:${url}`, title: name, url, mimeType, poster: placement(name === 'Trailer' ? '/images/gallery/media23.webp' : SITE.defaultImage)})
  snapshots.push({video: url, bytes: data.length, sha256: hash(data)})
}
const allIds = new Set(documents.map(doc => doc._id))
function validate(value: any, source: string) {
  if (Array.isArray(value)) {
    const keys = value.filter(item => item && typeof item === 'object').map(item => item._key)
    if (keys.some(k => !k) || keys.length !== new Set(keys).size) throw new Error(`Missing/duplicate array keys in ${source}`)
    value.forEach(item => validate(item, source)); return
  }
  if (!value || typeof value !== 'object') return
  if (value._ref && !allIds.has(value._ref)) throw new Error(`Unresolved reference in ${source}: ${value._ref}`)
  if (value.href && !/^(https:\/\/|mailto:|tel:|\/|#)/.test(value.href)) throw new Error(`Unsafe link in ${source}: ${value.href}`)
  Object.values(value).forEach(item => validate(item, source))
}
for (const document of documents) validate(document, document.sourceKey)
const counts = Object.fromEntries([...new Set(documents.map(d => d._type))].map(type => [type, documents.filter(d => d._type === type).length]))
if (counts.chapter !== 6 || counts.organization !== 10 || counts.person !== 4 || counts.faq !== 7) throw new Error(`Unexpected source counts: ${JSON.stringify(counts)}`)
issues.push({severity: 'integration', source: 'forms', message: 'Contact/newsletter labels and client-side status strings remain in source; require dedicated form settings and frontend wiring before cutover.'})
issues.push({severity: 'integration', source: 'pages', message: 'Extracted page sections need frontend field mapping and visual parity review. Do not switch production builds to these documents yet.'})
const report = {preparedAt: new Date().toISOString(), projectId: '80rpogyy', dataset: 'production', remoteWrites: false, counts, documents: documents.length, sourceImageFiles: sourceImages.length, selectedImageAssets: assets.length, selectedBytes: assets.reduce((sum, a) => sum + a.bytes, 0), galleryPhotographs: documents.filter(d => d._type === 'photograph' && d.gallery).length, issues}
await atomic(path.join(migration, 'extracted/source-snapshot.json'), {chapters, organizations, site: SITE, sourceImages, pages: snapshots})
await atomic(path.join(migration, 'transformed/import-plan.json'), {projectId: '80rpogyy', dataset: 'production', assets, documents})
await atomic(path.join(migration, 'reports/preflight.json'), report)
console.log(JSON.stringify(report, null, 2))
