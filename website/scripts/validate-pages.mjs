import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const distPath = fileURLToPath(dist);
const base = '/la-gente-website';
const requiredFiles = ['.nojekyll', '404.html', 'index.html', 'robots.txt', 'sitemap-index.xml'];
const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(new URL(file, dist))) failures.push(`Missing required Pages artifact: ${file}`);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(distPath).filter((file) => extname(file) === '.html');
const urlAttribute = /\b(?:href|src|poster)=["']([^"'#]+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(urlAttribute)) {
    const url = match[1];
    if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('data:')) continue;
    if (url.startsWith('/') && !url.startsWith(`${base}/`) && url !== base) {
      failures.push(`${relative(distPath, htmlFile)} contains a root URL without the Pages base: ${url}`);
      continue;
    }
    if (!url.startsWith(`${base}/`)) continue;

    const cleanPath = decodeURIComponent(url.slice(base.length)).split(/[?#]/, 1)[0];
    const target = join(distPath, cleanPath);
    const candidates = [target, join(target, 'index.html')];
    if (!candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile())) {
      failures.push(`${relative(distPath, htmlFile)} references a missing artifact: ${url}`);
    }
  }
}

if (failures.length) {
  console.error(`GitHub Pages validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`GitHub Pages validation passed: ${htmlFiles.length} HTML files checked under ${base}/.`);
