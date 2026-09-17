import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {load} from 'cheerio';
import assert from 'node:assert/strict';
import {cms, plain, contentHash, imageUrl} from '../src/data/cms.mjs';
const normalize = value => value.replace(/\s+/g,' ').trim();
for (const page of cms.pages) {
  const file = page.route === '/404.html' ? 'dist/404.html' : join('dist',page.route,'index.html');
  const $ = load(await readFile(file,'utf8'));
  const text = normalize($('main').text());
  for(const section of page.sections || []) {
    if(section.heading) assert.ok(text.includes(normalize(section.heading)), `${page._id}: missing heading ${section.heading}`);
    for(const block of section.body || []) assert.ok(text.includes(normalize(plain([block]))), `${page._id}: missing body copy`);
    for(const link of section.links || []) assert.ok($(`main a`).toArray().some(a => $(a).attr('href')===link.href),`${page._id}: missing link`);
  }
  assert.equal($('head > title').text(), page.seo.title, `${page._id}: SEO title`);
  assert.equal($('template[data-cms-slot]').length,0);
  for (const role of ['trailer', 'backgroundVideo']) {
    if (!page[role]) continue;
    const video = page[role];
    const player = $(`[data-cms-video="${role}"]`);
    // A removed page section intentionally removes its player too.
    if (!player.length) continue;
    if (player.is('a')) assert.equal(player.attr('href'), video.url);
    else {
      assert.deepEqual(player.find('source').map((_, n) => $(n).attr('src')).get(), [video.webmUrl, video.url].filter(Boolean));
      assert.equal(player.attr('poster'), role === 'backgroundVideo' ? imageUrl(page.openingImages[0], 1920) : video.poster ? imageUrl(video.poster) : undefined);
    }
  }
  if (page._id === 'homePage' && $('.home-hero').length) {
    assert.deepEqual(JSON.parse($('.home-hero').attr('data-mobile-images')), page.openingImages.map(p => imageUrl(p, 1920)));
    assert.equal($('.home-hero__poster').first().attr('src'), imageUrl(page.openingImages[0], 1920));
  }
}
const media=load(await readFile('dist/media/index.html','utf8'));
assert.equal(media('#media-gallery li').length,cms.photographs.length);
const about=load(await readFile('dist/about/index.html','utf8'));
assert.deepEqual(about('.team-grid h3').map((_,n)=>about(n).text()).get(),cms.people.map(p=>p.name));
assert.deepEqual(about('.faq-section summary').map((_,n)=>about(n).text()).get(),cms.faqs.map(f=>f.question));
const involved=load(await readFile('dist/get-involved/index.html','utf8'));
assert.deepEqual(involved('.organization-accordion__heading strong').map((_,n)=>involved(n).text()).get(),cms.organizations.map(o=>o.name));
const map=JSON.parse(involved('.involvement-atlas').attr('data-organizations'));
assert.deepEqual(map.map(o=>o.name),cms.organizations.map(o=>o.name));
assert.equal(JSON.parse(await readFile('dist/cms-version.json','utf8')).contentHash,contentHash);
console.log('CMS parity passed: all page copy, links, SEO, ordered collections and map references.');
