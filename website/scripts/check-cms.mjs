import {appendFile} from 'node:fs/promises';
import {contentHash} from '../src/data/cms.mjs';
let previous;
const response = await fetch('https://lagentedelatierra.com/cms-version.json', {signal: AbortSignal.timeout(20000), cache: 'no-store'});
if (response.ok) previous = (await response.json()).contentHash;
else if (response.status !== 404) throw new Error(`Live version check failed: ${response.status}`);
const changed = previous !== contentHash;
console.log(changed ? 'Published content changed; build required.' : 'Published content unchanged.');
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
