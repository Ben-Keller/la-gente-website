import {createClient} from '@sanity/client';
import {createImageUrlBuilder} from '@sanity/image-url';
import {defineQuery} from 'groq';
import {toHTML} from '@portabletext/to-html';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

export const client = createClient({projectId: '80rpogyy', dataset: 'production', apiVersion: '2026-09-17', useCdn: false, perspective: 'published', timeout: 30000});
const placement = `photograph->{_id,title,alt,image{asset,crop,hotspot}},alt`;
export const CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{name,alternateName,email,description,productionCompany,releaseLabel,primaryNavigation,footerNavigation,socialLinks,defaultImage{${placement}}},
  "pages": *[_type in ["homePage","aboutPage","chaptersPage","involvementPage","mediaPage","contactPage","pressPage","privacyPage","notFoundPage"]]{_id,route,title,seo{title,description,image{${placement}}},featuredImages[]{${placement}},sections[]{_key,label,heading,eyebrow,body,links,sourceSelector,images[]{${placement}}}},
  "chapters": *[_type == "chapter"] | order(number asc){number,slug,title,community,region,elevation,eyebrow,summary,themes,location,locationDescription,story,environmentalFocus,productionNote,organization->{name,link},hero{${placement}},portrait{${placement}},landscape{${placement}},seo{title,description,image{${placement}}}},
  "organizations": *[_type == "organization"] | order(orderRank asc,order asc,_id asc){_id,name,category,place,location,description,link,linkNote,status,image{${placement}}},
  "people": *[_type == "person"] | order(orderRank asc,order asc,_id asc){_id,name,role,bio,shortBio,portrait{${placement}},teamGroup->{_id,title}},
  "faqs": *[_type == "faq"] | order(orderRank asc,order asc,_id asc){_id,question,answer},
  "photographs": *[_type == "photograph" && gallery == true] | order(orderRank asc,order asc,_id asc){_id,title,caption,alt,credit,image{asset,crop,hotspot,"dimensions":asset->metadata.dimensions}},
  "videos": *[_type == "video"]{sourceKey,title,url,mimeType,poster{${placement}}}
}`);
export const cms = process.env.CMS_SNAPSHOT ? JSON.parse(await readFile(process.env.CMS_SNAPSHOT, 'utf8')) : await client.fetch(CONTENT_QUERY);
if (!cms.settings || cms.pages.length !== 9 || cms.chapters.length !== 6) throw new Error('Incomplete published CMS content: refusing to replace the live site.');
export const contentHash = createHash('sha256').update(JSON.stringify(cms)).digest('hex');
const builder = createImageUrlBuilder(client);
export function imageUrl(placement, width = 1600) {
  const image = placement?.photograph?.image || placement?.image;
  if (!image?.asset?._ref) throw new Error('Missing published photograph reference');
  return builder.image(image).width(width).fit('max').auto('format').quality(85).url();
}
export const plain = blocks => (blocks || []).map(b => (b.children || []).map(c => c.text || '').join('')).join('\n\n');
export function safeLink(href) {
  if (typeof href !== 'string' || !/^(https:\/\/|mailto:|tel:|#|\/(?!\/))/.test(href) || href.includes('\\')) throw new Error(`Invalid CMS link: ${href}`);
  return href;
}
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const rich = blocks => toHTML(blocks || [], {components: {marks: {link: ({value,children}) => `<a href="${escape(safeLink(value.href))}">${children}</a>`}}, onMissingComponent: (_message, details) => {throw new Error(`Unsupported rich text: ${details.type}`)}});
export const pageFor = route => cms.pages.find(p => p.route === route);
