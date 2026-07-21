const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('#')) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function withoutBase(path: string): string {
  if (base && path.startsWith(base)) return path.slice(base.length) || '/';
  return path;
}
