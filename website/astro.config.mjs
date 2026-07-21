import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lagentedelatierra.com',
  base: '/la-gente-website',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
});
