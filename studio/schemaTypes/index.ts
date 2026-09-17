import {defineArrayMember, defineField, defineType} from 'sanity'
import {PageShortcuts} from '../src/PageShortcuts'
import {SharedContent, PlacementInput, SectionInput, VideoReferenceInput} from '../src/SharedContent'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {ImageIcon} from '@sanity/icons/Image'
import {UserIcon} from '@sanity/icons/User'
import {PlayIcon} from '@sanity/icons/Play'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {CogIcon} from '@sanity/icons/Cog'
import {PinIcon} from '@sanity/icons/Pin'

const groups = [{name: 'content', title: 'Story & copy', default: true}, {name: 'media', title: 'Images & videos'}, {name: 'details', title: 'Details & relationships'}]
const source = defineField({name: 'sourceKey', title: 'Migration source', type: 'string', readOnly: true, group: 'details'})
const text = (name: string, title: string, required = false) => defineField({name, title, type: 'string', group: 'content', validation: r => required ? r.required() : r})
const prose = (name: string, title: string) => defineField({name, title, type: 'richText', group: 'content'})
const picture = (name: string, title: string) => defineField({name, title, type: 'imagePlacement', group: 'media'})
const ref = (name: string, title: string, type: string) => defineField({name, title, type: 'reference', to: [{type}], group: 'details'})
const order = defineField({name: 'order', title: 'Display order', type: 'number', group: 'details', validation: r => r.integer().min(0)})
const link = defineType({name: 'siteLink', title: 'Link', type: 'object', icon: DocumentTextIcon, fields: [
  defineField({name: 'label', type: 'string', title: 'Label', validation: r => r.required()}),
  defineField({name: 'href', type: 'url', title: 'Destination', validation: r => r.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}).custom(value => {
    // Sanity resolves hash-only links against an HTTP base during URI validation.
    // Permit that internal resolution, but not actual insecure external URLs.
    if (!value) return true
    if (/^(https:\/\/|mailto:|tel:|#|\/(?!\/))/.test(value) && !value.includes('\\')) return true
    return 'Use an HTTPS URL, email/telephone link, site path, or #section anchor.'
  })}),
]})
const richText = defineType({name: 'richText', title: 'Text', type: 'array', of: [defineArrayMember({type: 'block', styles: [{title: 'Paragraph', value: 'normal'}, {title: 'Small heading', value: 'h3'}, {title: 'Quote', value: 'blockquote'}], lists: [{title: 'Bulleted list', value: 'bullet'}, {title: 'Numbered list', value: 'number'}], marks: {decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}], annotations: [defineArrayMember({name: 'link', type: 'object', title: 'Link', fields: [defineField({name: 'href', type: 'url', validation: r => r.uri({allowRelative: true, scheme: ['https', 'mailto', 'tel']})})]})]}})]})
const imagePlacement = defineType({name: 'imagePlacement', title: 'Photograph placement', type: 'object', icon: ImageIcon, components: {input: PlacementInput}, fields: [
  defineField({name: 'photograph', title: 'Choose from the collection', type: 'reference', to: [{type: 'photograph'}], validation: r => r.required()}),
  defineField({name: 'alt', title: 'Alternative text for this placement', type: 'string', description: 'Describe the image’s purpose here. Leave empty to use the photograph’s description.'}),
  defineField({name: 'localFraming', title: 'Crop & focal point for this placement only', type: 'image', options: {hotspot: true}, hidden: ({value}) => !value, description: 'Edit crop/focal point, not the file. If the shared photograph is replaced, its new crop is used until you reset local framing.', validation: r => r.custom(async (value, context) => {
    if (!value?.asset?._ref) return true
    const parent = context.parent as {photograph?: {_ref?: string}}
    if (!parent?.photograph?._ref) return 'Choose a photograph first.'
    const asset = await context.getClient({apiVersion: '2026-09-17'}).fetch('*[_id == $id][0].image.asset._ref', {id: parent.photograph._ref})
    return asset === value.asset._ref || 'The shared photograph changed. Reset local crop or use shared crop instead.'
  })}),
], preview: {select: {title: 'photograph.title', media: 'photograph.image'}}})
const seo = defineType({name: 'seo', title: 'Search & sharing', type: 'object', icon: DocumentTextIcon, fields: [
  defineField({name: 'title', title: 'Search title', type: 'string', validation: r => r.max(70).warning()}),
  defineField({name: 'description', title: 'Search description', type: 'text', rows: 3, validation: r => r.max(180).warning()}),
  defineField({name: 'image', title: 'Sharing photograph', type: 'imagePlacement'}),
]})
const photograph = defineType({name: 'photograph', title: 'Photograph', type: 'document', icon: ImageIcon, components: {input: SharedContent}, groups, orderings: [orderRankOrdering], fields: [
  orderRankField({type: 'photograph'}),
  text('title', 'Collection title', true),
  defineField({name: 'image', title: 'Image / crop / focal point', type: 'image', group: 'media', options: {hotspot: true}, validation: r => r.required()}),
  text('alt', 'Alternative text'), text('caption', 'Caption'), text('credit', 'Photographer credit'),
  defineField({name: 'rights', title: 'Usage notes', type: 'text', group: 'details', description: 'Only publishable information: this dataset is public. Never invent a credit or permission.'}),
  ref('chapter', 'Associated chapter', 'chapter'),
  defineField({name: 'gallery', title: 'Include in the Media gallery', type: 'boolean', group: 'details', initialValue: false, description: 'Reorder selected photos by dragging them in Photography → Media selection.'}),
  {...order, hidden: true, readOnly: true, description: 'Original imported sequence. Media selection now uses drag-and-drop orderRank.'},
  defineField({name: 'sourcePaths', title: 'Original website paths', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'details', readOnly: true}), source,
], preview: {select: {title: 'title', subtitle: 'caption', media: 'image'}}})
const chapter = defineType({name: 'chapter', title: 'Chapter', type: 'document', icon: DocumentTextIcon, groups, fields: [
  defineField({name: 'number', title: 'Chapter number', type: 'number', group: 'details', validation: r => r.required().integer().min(1).max(6)}),
  text('title', 'Short title', true), text('community', 'Full chapter title', true), text('eyebrow', 'Introductory line'),
  defineField({name: 'slug', title: 'Existing route', type: 'slug', group: 'details', readOnly: true, description: 'Preserved for existing links and search results.', validation: r => r.required()}),
  text('summary', 'Chapter introduction', true), prose('story', 'Narrative'), prose('environmentalFocus', 'Environmental focus'), prose('productionNote', 'Behind the chapter'),
  text('region', 'Region'), text('elevation', 'Elevation'), text('location', 'Location'), prose('locationDescription', 'About the location'),
  defineField({name: 'themes', title: 'Themes', type: 'array', group: 'details', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
  picture('hero', 'Hero photograph'), picture('portrait', 'Portrait photograph'), picture('landscape', 'Landscape photograph'),
  ref('organization', 'Related organization', 'organization'), defineField({name: 'seo', type: 'seo', group: 'details'}), source,
], orderings: [{title: 'Chapter order', name: 'chapterOrder', by: [{field: 'number', direction: 'asc'}]}], preview: {select: {title: 'community', number: 'number', media: 'hero.photograph.image'}, prepare: ({title, number, media}) => ({title, subtitle: `Chapter ${String(number ?? '').padStart(2, '0')}`, media})}})
const organization = defineType({name: 'organization', title: 'Organization', type: 'document', icon: PinIcon, groups, fields: [
  orderRankField({type: 'organization'}),
  text('name', 'Name', true), text('category', 'Organization type'), text('place', 'Location label'), prose('description', 'About the organization'),
  defineField({name: 'location', title: 'Map location', type: 'geopoint', group: 'details', description: 'Approximate location, not a street address.', validation: r => r.required()}),
  picture('image', 'Map thumbnail and story photograph'), defineField({name: 'link', title: 'Organization link', type: 'siteLink', group: 'content'}),
  text('linkNote', 'Link / historical context note'),
  defineField({name: 'status', title: 'Initiative status', type: 'string', group: 'details', options: {list: [{title: 'Current listing', value: 'current'}, {title: 'Historical initiative', value: 'historical'}], layout: 'radio'}, initialValue: 'current'}),
  {...order, hidden: true, readOnly: true, description: 'Original imported page sequence. Drag organizations in the list to edit their order.'}, source,
], preview: {select: {title: 'name', subtitle: 'place', media: 'image.photograph.image'}}})
const teamGroup = defineType({name: 'teamGroup', title: 'Team group', type: 'document', liveEdit: true, icon: UserIcon, fields: [
  defineField({name: 'title', title: 'Group name', type: 'string', validation: r => r.required()}),
], preview: {select: {title: 'title'}}})
const person = defineType({name: 'person', title: 'Team member', type: 'document', icon: UserIcon, groups, orderings: [orderRankOrdering], fields: [
  orderRankField({type: 'person'}), text('name', 'Name', true), text('role', 'Role'),
  defineField({name: 'teamGroup', title: 'Team group', type: 'reference', to: [{type: 'teamGroup'}], group: 'content', description: 'Choose, create or edit a group here. Leave empty for no group. Drag-sort members directly in the Filmmaking team list.'}),
  prose('bio', 'Full biography'), prose('shortBio', 'Press biography'), picture('portrait', 'Portrait'),
  {...order, hidden: true, readOnly: true}, source,
], preview: {select: {title: 'name', subtitle: 'role', media: 'portrait.photograph.image'}}})
const faq = defineType({name: 'faq', title: 'Frequently asked question', type: 'document', icon: HelpCircleIcon, groups, orderings: [orderRankOrdering], fields: [orderRankField({type: 'faq'}), text('question', 'Question', true), prose('answer', 'Answer'), {...order, hidden: true, readOnly: true}, source], preview: {select: {title: 'question'}}})
const video = defineType({name: 'video', title: 'Video', type: 'document', icon: PlayIcon, components: {input: SharedContent}, groups, fields: [
  text('title', 'Title', true),
  defineField({name: 'url', title: 'Video URL or existing site path', type: 'url', group: 'content', description: 'Use existing optimized clips or YouTube/Vimeo URLs. Video uploads to Sanity are disabled.', validation: r => r.required().uri({allowRelative: true, scheme: ['https']})}),
  defineField({name: 'webmUrl', title: 'Alternative WebM format (optional)', type: 'url', group: 'content', description: 'The same clip in WebM, not a second video record.', validation: r => r.uri({allowRelative: true, scheme: ['https']})}),
  text('mimeType', 'Primary format'),
  defineField({name: 'purpose', title: 'Purpose', type: 'string', group: 'details', options: {list: [{title: 'Background clip (opening image is controlled on Home)', value: 'background'}, {title: 'Trailer or other video', value: 'video'}]}, initialValue: 'video'}),
  {...picture('poster', 'Default poster'), hidden: ({document}) => document?.purpose === 'background', description: 'Shared by all uses of this video. The Home background uses the first Opening image instead.'},
  defineField({name: 'supersededBy', type: 'reference', to: [{type: 'video'}], hidden: true, readOnly: true}), source,
], preview: {select: {title: 'title', subtitle: 'url'}}})
const section = defineType({name: 'contentSection', title: 'Page section', type: 'object', icon: DocumentTextIcon, components: {input: SectionInput}, fields: [
  defineField({name: 'kind', title: 'Section purpose', type: 'string', readOnly: true, hidden: true}),
  defineField({name: 'label', title: 'Editor label', type: 'string', validation: r => r.required()}),
  defineField({name: 'heading', title: 'Heading', type: 'string'}), defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
  defineField({name: 'body', title: 'Copy', type: 'richText'}),
  defineField({name: 'links', title: 'Calls to action', type: 'array', of: [defineArrayMember({type: 'siteLink'})]}),
  defineField({name: 'images', title: 'Photographs in this section', type: 'array', of: [defineArrayMember({type: 'imagePlacement'})], hidden: ({parent}) => ['opening', 'team', 'chapters', 'faqs', 'organizations', 'gallery'].includes(parent?.kind), readOnly: ({parent}) => ['opening', 'team', 'chapters', 'faqs', 'organizations', 'gallery'].includes(parent?.kind)}),
  defineField({name: 'sourceSelector', title: 'Source section', type: 'string', readOnly: true, hidden: true}),
], preview: {select: {title: 'label', subtitle: 'heading'}}})
export const pageDefinitions = [
  ['homePage', 'Home', '/'], ['aboutPage', 'About', '/about/'], ['chaptersPage', 'Chapters', '/communities/'],
  ['involvementPage', 'Get involved', '/get-involved/'], ['mediaPage', 'Media', '/media/'], ['contactPage', 'Contact', '/contact-us/'],
  ['pressPage', 'Press kit', '/press-kit/'], ['privacyPage', 'Privacy', '/privacy/'], ['notFoundPage', 'Not found', '/404.html'],
] as const
const pages = pageDefinitions.map(([name, title, route]) => defineType({name, title, type: 'document', icon: DocumentTextIcon, components: {input: PageShortcuts}, groups, fields: [
  text('title', 'Page name', true), defineField({name: 'route', title: 'Website route', type: 'string', group: 'details', readOnly: true, initialValue: route}),
  defineField({name: 'seo', type: 'seo', group: 'details'}),
  defineField({name: 'sections', title: 'Sections in page order', type: 'array', group: 'content', of: [defineArrayMember({type: 'contentSection'})], description: 'Shared chapter, organization and team stories are edited in their own collections.'}),
  ...(name === 'homePage' ? [defineField({name: 'openingImages', title: 'Opening image & mobile slideshow', type: 'array', group: 'media', of: [defineArrayMember({type: 'imagePlacement'})], description: 'First image: desktop loading cover and video poster. Mobile: all images rotate in this order, with no video. Drag to reorder.', validation: r => r.required().min(1)})] : []),
  ...(['homePage', 'mediaPage'].includes(name) ? [defineField({name: 'trailer', title: 'Trailer · shared video', type: 'reference', to: [{type: 'video'}], components: {input: VideoReferenceInput}, group: 'media', options: {filter: '!defined(supersededBy)'}, description: 'Video selection for this page. Edit the selected shared video to update its source/poster everywhere.', validation: r => r.required()})] : []),
  ...(name === 'homePage' ? [defineField({name: 'backgroundVideo', title: 'Background video · shared clip', type: 'reference', to: [{type: 'video'}], components: {input: VideoReferenceInput}, group: 'media', options: {filter: '!defined(supersededBy) && purpose == "background"'}, description: 'Desktop only. Both formats belong to one video. Its loading poster comes from Opening image above.', validation: r => r.required()})] : []),
  defineField({name: 'featuredImages', title: 'Legacy slideshow selection', type: 'array', group: 'media', hidden: true, readOnly: true, deprecated: {reason: 'Use Opening image & mobile slideshow on Home.'}, of: [defineArrayMember({type: 'imagePlacement'})]}), source,
], preview: {select: {title: 'title'}, prepare: ({title: t}) => ({title: t || title, subtitle: route})}}))
const siteSettings = defineType({name: 'siteSettings', title: 'Site identity & navigation', type: 'document', icon: CogIcon, groups, fields: [
  text('name', 'Website title', true), text('alternateName', 'English title'), text('description', 'Default description'), text('productionCompany', 'Production company'),
  defineField({name: 'email', title: 'Public contact email', type: 'string', group: 'content', validation: r => r.required().email()}),
  text('releaseLabel', 'Release timing', true), picture('defaultImage', 'Default sharing photograph'),
  ...['primaryNavigation', 'footerNavigation', 'socialLinks'].map(name => defineField({name, title: {primaryNavigation: 'Header navigation', footerNavigation: 'Footer navigation', socialLinks: 'Social links'}[name], type: 'array', group: 'content', of: [defineArrayMember({type: 'siteLink'})]})), source,
], preview: {prepare: () => ({title: 'Site identity & navigation', subtitle: 'Shared across the website'})}})
export const singletonTypes = new Set<string>(['siteSettings', ...pageDefinitions.map(([name]) => name)])
export const schemaTypes = [link, richText, imagePlacement, seo, section, siteSettings, ...pages, photograph, chapter, organization, teamGroup, person, faq, video]
