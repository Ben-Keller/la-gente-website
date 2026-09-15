import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lagentedelatierra.com',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap({
    filter: (page) => ![
      '/home/',
      '/watch/',
      '/chapter-1/',
      '/chapter-2/',
      '/chapter-2-maras/',
      '/chapter-3/',
      '/chapter-3-shipibo/',
      '/chapter-4/',
      '/chapter-4-last-fishermen/',
      '/chapter-5/',
      '/chapter-6/',
      '/chapter-6-floating-islands/',
    ].some((legacy) => new URL(page).pathname.endsWith(legacy)),
  })],
});
