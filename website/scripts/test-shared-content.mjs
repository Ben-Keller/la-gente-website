import assert from 'node:assert/strict';
import {mkdtemp, cp, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import {cms, imageUrl} from '../src/data/cms.mjs';
const home = cms.pages.find(p => p._id === 'homePage');
const media = cms.pages.find(p => p._id === 'mediaPage');
assert.ok(home.backgroundVideo?.webmUrl, 'One background record includes WebM');
assert.equal(home.trailer._id, media.trailer._id, 'Initial trailer remains shared');
assert.ok(home.openingImages.length, 'Opening imagery has one owner');
assert.equal(home.sections[0].kind, 'opening');
assert.equal(cms.videos.length, 2, 'Retired format record is not an editable video');
const placement = home.openingImages[0];
const original = imageUrl(placement);
const cropped = {...placement, localFraming: {...placement.photograph.image, crop: {_type:'sanity.imageCrop', left:0.1, right:0.1, top:0.1, bottom:0.1}}};
assert.notEqual(imageUrl(cropped), original, 'Local crop affects the URL');
assert.equal(imageUrl(placement), original, 'Other placements remain unchanged');
const stale = {...cropped, localFraming:{...cropped.localFraming, asset:{_ref:'image-replaced-100x100-jpg'}}};
assert.equal(imageUrl(stale), original, 'Changed shared asset never displays stale local framing');
assert.ok(cms.pages.find(p => p._id === 'aboutPage').sections.some(s => s.kind === 'team'));
console.log('Shared-content tests passed: references, consolidation, opening ownership and crop isolation.');

// Exercise changed editorial values through the real adapter, isolated from production data/dist.
const temp = await mkdtemp(join(tmpdir(), 'la-gente-ownership-'));
try {
  await cp('dist', join(temp, 'dist'), {recursive: true});
  const fixture = structuredClone(cms);
  const h = fixture.pages.find(p => p._id === 'homePage');
  const m = fixture.pages.find(p => p._id === 'mediaPage');
  h.trailer.url = '/video/test-home.mp4';
  m.trailer.url = 'https://vimeo.com/123456';
  h.backgroundVideo.url = '/video/test-background.mp4';
  h.backgroundVideo.webmUrl = '/video/test-background.webm';
  h.openingImages[0] = cropped;
  const snapshot = join(temp, 'fixture.json');
  await writeFile(snapshot, JSON.stringify(fixture));
  execFileSync(process.execPath, [resolve('scripts/apply-cms-pages.mjs')], {cwd: temp, env: {...process.env, CMS_SNAPSHOT: snapshot}, stdio: 'pipe'});
  const renderedHome = load(await readFile(join(temp, 'dist/index.html'), 'utf8'));
  const renderedMedia = load(await readFile(join(temp, 'dist/media/index.html'), 'utf8'));
  assert.equal(renderedHome('[data-cms-video="trailer"] source').attr('src'), h.trailer.url);
  assert.equal(renderedMedia('a[data-cms-video="trailer"]').attr('href'), m.trailer.url);
  assert.equal(renderedHome('.home-hero__poster').first().attr('src'), imageUrl(cropped, 1920));
  assert.equal(renderedHome('[data-cms-video="backgroundVideo"]').attr('poster'), imageUrl(cropped, 1920));
  assert.deepEqual(renderedHome('[data-cms-video="backgroundVideo"] source').map((_,n) => renderedHome(n).attr('src')).get(), [h.backgroundVideo.webmUrl, h.backgroundVideo.url]);
  console.log('Adapter mutation tests passed: independent page selections, both clip formats, external trailer and local opening crop.');
} finally {await rm(temp, {recursive: true, force: true});}
