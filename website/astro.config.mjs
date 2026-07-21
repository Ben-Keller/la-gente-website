import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lagentedelatierra.com',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
});
