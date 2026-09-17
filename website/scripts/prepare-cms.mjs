import {mkdir, writeFile} from 'node:fs/promises';
import {cms, contentHash} from '../src/data/cms.mjs';
await mkdir('.cms', {recursive: true});
await writeFile('.cms/content.json', JSON.stringify(cms));
console.log(`Published Sanity snapshot: ${contentHash}`);
