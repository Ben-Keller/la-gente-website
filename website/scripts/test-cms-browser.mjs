import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4329';
const browser = await chromium.launch({headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
await mkdir('.cms/screenshots', {recursive:true});
try {
  for (const width of [1440,390]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const errors=[];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/', '/about/', '/communities/', '/get-involved/', '/media/', '/press-kit/', '/contact-us/', '/privacy/']) {
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,route);
      assert.equal(await page.locator('main h1').count(),1,`${route}: main heading`);
      // Hidden slideshow frames may legitimately remain lazy until their turn.
      // Force loading here so the asset assertion covers those frames as well.
      await page.locator('main img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
      for(let y=0;y<await page.locator('body').evaluate(el=>el.scrollHeight);y+=700) {
        await page.evaluate(y=>window.scrollTo(0,y),y);
        await page.waitForTimeout(80);
      }
      await page.waitForFunction(()=>Array.from(document.querySelectorAll('main img')).every(img=>img.complete), undefined, {timeout:30000});
      const broken=await page.locator('main img').evaluateAll(images=>images.filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src));
      assert.deepEqual(broken,[],`${route}: broken images`);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),true,`${route}: horizontal overflow at ${width}`);
      if(route==='/') {
        assert.equal(await page.locator('.documentary-feature video').count(),1);
        assert.equal(await page.locator('.chapter-grid .chapter-card').count(),6);
      }
      if(route==='/get-involved/') {
        await page.locator('.organization-accordion__trigger').first().click();
        assert.equal(await page.locator('.organization-accordion__trigger').first().getAttribute('aria-expanded'),'true');
      }
      if(['/','/media/','/get-involved/'].includes(route)) await page.screenshot({path:`.cms/screenshots/${width}-${route.replaceAll('/','')||'home'}.png`,fullPage:true});
      console.log(`PASS ${width} ${route}`);
    }
    assert.deepEqual(errors,[],`Browser errors at ${width}`);
    await page.close();
  }
} finally {await browser.close();}
