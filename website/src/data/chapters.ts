export type Chapter = {
  number: number;
  slug: string;
  title: string;
  community: string;
  region: string;
  elevation: string;
  eyebrow: string;
  summary: string;
  themes: string[];
  location: string;
  locationDescription: string;
  story: string[];
  environmentalFocus: string;
  productionNote: string;
  relatedOrganization: string;
  relatedOrganizationUrl: string;
  images: { hero: string; portrait: string; landscape: string };
};


import {cms, imageUrl, plain, safeLink} from './cms.mjs';
export const chapters: Chapter[] = cms.chapters.map((chapter: any) => ({
  ...chapter, slug: chapter.slug.current,
  story: (chapter.story || []).map((block: any) => plain([block])),
  locationDescription: plain(chapter.locationDescription),
  environmentalFocus: plain(chapter.environmentalFocus), productionNote: plain(chapter.productionNote),
  relatedOrganization: chapter.organization?.name || '', relatedOrganizationUrl: safeLink(chapter.organization?.link?.href),
  images: {hero: imageUrl(chapter.hero), portrait: imageUrl(chapter.portrait), landscape: imageUrl(chapter.landscape)},
}));
export const chapterBySlug = Object.fromEntries(chapters.map((chapter) => [chapter.slug, chapter]));
