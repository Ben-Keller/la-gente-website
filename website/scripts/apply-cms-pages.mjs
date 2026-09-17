/** Build-time adapter for the migrated page sections. Keeps the hand-designed shells
 * and animation hooks; CMS owns section order, copy, links and photograph placements.
 */
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {load} from 'cheerio';
import {cms, imageUrl, rich, safeLink, contentHash} from '../src/data/cms.mjs';

const layouts = {homePage: 6, aboutPage: 7, chaptersPage: 1, involvementPage: 3, mediaPage: 3, contactPage: 2, pressPage: 7, privacyPage: 2, notFoundPage: 1};
const protectedContent = '.team-grid,details,.chapter-grid,.chapter-story,.press-columns,.organization-accordion,.organization-list,.involvement-map,#media-gallery,script,style,form';
const report = {contentHash, builtAt: new Date().toISOString(), pages: [], chapters: cms.chapters.length, organizations: cms.organizations.length, people: cms.people.length, photographs: cms.photographs.length};
function applySection($, root, section) {
  const editable = selector => root.find(selector).filter((_, node) => !$(node).closest(protectedContent).length);
  const heading = editable('h1,h2').first();
  const eyebrow = editable('.eyebrow').first();
  // Capture body targets before changing any content or heading text.
  const body = editable('p,h1,h2,h3,blockquote,ul,ol').filter((_, node) => node !== heading[0] && !$(node).is('.eyebrow') && !$(node).parentsUntil(root).filter('blockquote,ul,ol').length);
  const links = editable('a').filter((_, node) => !$(node).closest('p,li').length).toArray();
  heading.text(section.heading || '');
  eyebrow.text(section.eyebrow || '');
  const rendered = load(`<div>${rich(section.body)}</div>`)('div').first().children().toArray();
  const oldBody = body.toArray();
  const appendTo = oldBody.length ? $(oldBody.at(-1)).parent() : root;
  for (let i = 0; i < Math.max(oldBody.length, rendered.length); i++) {
    const target = oldBody[i] && $(oldBody[i]);
    const replacement = rendered[i];
    if (!replacement) {target?.remove(); continue;}
    if (target) {
      // Keep typography classes and scoped-style attributes of the designed slot.
      if (replacement.name !== 'p' && !(replacement.name === 'h3' && /^h[123]$/.test(target[0].name))) target[0].name = replacement.name;
      const fragment = load(replacement);
      target.html(fragment(replacement).html() || '');
    } else appendTo.append(replacement);
  }
  (section.links || []).forEach((link, i) => {
    const target = links[i] ? $(links[i]) : $('<a class="text-link"></a>').appendTo(root);
    const decorations = target.children('.direction-mark,.external-link-mark').clone();
    target.attr('href', safeLink(link.href)).text(link.label).append(decorations);
  });
  links.slice((section.links || []).length).forEach(node => $(node).remove());
  const images = editable('img').toArray();
  (section.images || []).forEach((placement, i) => {
    const target = images[i] ? $(images[i]) : $('<img loading="lazy" decoding="async">').appendTo(root);
    target.attr('src', imageUrl(placement)).attr('alt', placement.alt ?? placement.photograph?.alt ?? '').removeAttr('srcset');
  });
  images.slice((section.images || []).length).forEach(node => $(node).remove());
}

for (const page of cms.pages) {
  const file = page.route === '/404.html' ? 'dist/404.html' : join('dist', page.route, 'index.html');
  const $ = load(await readFile(file, 'utf8'));
  if (page.seo?.title) {$('head > title').text(page.seo.title); $('meta[property="og:title"]').attr('content', page.seo.title);}
  if (page.seo?.description) $('meta[name="description"],meta[property="og:description"]').attr('content', page.seo.description);
  if (page.seo?.image) $('meta[property="og:image"]').attr('content', imageUrl(page.seo.image));
  const shells = new Map();
  const slots = [];
  for (let i = 0; i < layouts[page._id]; i++) {
    // Import indices count semantic sections, not Astro's inline script/style nodes.
    const root = $('main').children('header,section,div,aside,article').eq(i);
    if (!root.length) throw new Error(`Missing layout slot ${page._id}:${i}`);
    shells.set(`main > :nth-child(${i + 1})`, root);
  }
  // Replace original slots with markers before inserting the reordered sections.
  for (const root of shells.values()) {const slot = $('<template data-cms-slot></template>'); root.before(slot); root.remove(); slots.push(slot);}
  const used = new Set();
  for (const [i, section] of (page.sections || []).entries()) {
    if (section.sourceSelector && used.has(section.sourceSelector)) throw new Error(`Duplicate section shell in ${page._id}`);
    const root = shells.get(section.sourceSelector) || $('<section class="content-section page-shell"><p class="eyebrow"></p><h2></h2></section>');
    used.add(section.sourceSelector);
    applySection($, root, section);
    if (slots[i]) slots[i].before(root); else $('main').append(root);
  }
  slots.forEach(slot => slot.remove());
  if (page._id === 'homePage') {
    if (page.featuredImages?.length) {
      const urls = page.featuredImages.map(p => imageUrl(p, 1920));
      $('.home-hero').attr('data-mobile-images', JSON.stringify(urls));
      $('.home-hero__poster').attr('src', urls[0]);
      $('.home-hero__poster--alternate').attr('src', urls[1] || urls[0]);
    } else {
      const urls = $('.home-hero__poster').map((_, el) => $(el).attr('src')).get();
      $('.home-hero').attr('data-mobile-images', JSON.stringify(urls));
    }
    $('.release-strip .eyebrow').text(cms.settings.releaseLabel);
  }
  await writeFile(file, $.html());
  report.pages.push({id: page._id, route: page.route, sections: page.sections?.length || 0});
}

async function files(dir) {return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(entry => entry.isDirectory() ? files(join(dir,entry.name)) : join(dir,entry.name)))).flat();}
for (const file of (await files('dist')).filter(path => path.endsWith('.html'))) {
  const $ = load(await readFile(file,'utf8'));
  for (const video of cms.videos) {
    const sourcePath = video.sourceKey?.replace(/^video:/,'');
    if (!sourcePath) continue;
    $(`source[src="${sourcePath}"]`).each((_, source) => {
      const parent = $(source).parent('video');
      const url = safeLink(video.url);
      if (/youtube\.com|youtu\.be|vimeo\.com/.test(new URL(url, 'https://lagentedelatierra.com').hostname)) {
        // Privacy-friendly click-through for external players; do not autoplay embeds.
        const link = $('<a class="button" target="_blank" rel="noreferrer"></a>').attr('href',url).text(video.title);
        parent.replaceWith(link);
      } else {
        $(source).attr('src',url).attr('type',video.mimeType || 'video/mp4');
        if (video.poster) parent.attr('poster',imageUrl(video.poster));
      }
    });
  }
  await writeFile(file,$.html());
}
await writeFile('dist/cms-version.json', JSON.stringify(report,null,2));
console.log(`Applied Sanity page content: ${report.pages.length} pages; snapshot ${contentHash}`);
