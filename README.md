# La Gente de La Tierra

GitHub Pages repository for the La Gente de La Tierra documentary website.

The production Astro project is in [`website/`](website/). Local migration outputs, source dumps, research screenshots, and the abandoned prototype are intentionally excluded from Git.

## Development

```sh
cd website
npm ci
npm run dev
```

## Production build

```sh
cd website
npm ci
npm run build
```

Pushes to `main` deploy through `.github/workflows/deploy.yml`. In the repository settings, configure **Pages → Source** as **GitHub Actions**. The build includes `public/CNAME` for `lagentedelatierra.com`.
