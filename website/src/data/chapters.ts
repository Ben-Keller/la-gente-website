export type Chapter = {
  number: number;
  slug: string;
  title: string;
  community: string;
  region: string;
  eyebrow: string;
  summary: string;
  themes: string[];
  images: { hero: string; portrait: string; landscape: string };
};

export const chapters: Chapter[] = [
  {
    number: 1,
    slug: 'chapter-1-pitukiska',
    title: 'Pitukiska',
    community: 'Pitukiska New Year',
    region: 'Cusco Region',
    eyebrow: 'Renewal in the high Andes',
    summary: 'A Quechua community in the high Andes gathers for the Andean New Year to celebrate Mother Earth.',
    themes: ['Pachamama', 'Ceremony', 'Agriculture'],
    images: { hero: '/images/recovered/media23.webp', portrait: '/images/recovered/media26.webp', landscape: '/images/recovered/media30.webp' },
  },
  {
    number: 2,
    slug: 'chapter-2-shipibo',
    title: 'Shipibo',
    community: 'Shipibo-Conibo Plant Healers',
    region: 'Peruvian Amazon',
    eyebrow: 'Plant knowledge and living tradition',
    summary: 'A Shipibo curandero family builds a school to teach their traditional plant-medicine techniques and songs of healing.',
    themes: ['Plant medicine', 'Knowledge', 'Amazon'],
    images: { hero: '/images/gallery/media5.webp', portrait: '/images/gallery/media50.webp', landscape: '/images/gallery/media8.webp' },
  },
  {
    number: 3,
    slug: 'chapter-3-maras',
    title: 'Maras',
    community: 'Maras Salt Pans',
    region: 'Sacred Valley',
    eyebrow: 'An ancient landscape of salt',
    summary: 'A multigenerational family works ancient salt pools made by their Incan ancestors, producing salt said to cure sickness.',
    themes: ['Salt', 'Heritage', 'Stewardship'],
    images: { hero: '/images/recovered/Saltmines2-1-scaled.webp', portrait: '/images/recovered/media19.webp', landscape: '/images/recovered/media22.webp' },
  },
  {
    number: 4,
    slug: 'chapter-4-floating-islands',
    title: 'Floating Islands',
    community: 'Floating Islands of Lake Titicaca',
    region: 'Lake Titicaca',
    eyebrow: 'A home made and remade from reeds',
    summary: 'An Uros family living on a floating island of reeds on the highest navigable lake in the world explores their culture.',
    themes: ['Water', 'Totora', 'Adaptation'],
    images: { hero: '/images/recovered/media13.webp', portrait: '/images/recovered/media12.webp', landscape: '/images/recovered/media39.webp' },
  },
  {
    number: 5,
    slug: 'chapter-5-rinconada',
    title: 'La Rinconada',
    community: 'La Rinconada Gold Mine',
    region: 'Puno Region',
    eyebrow: 'At the highest city on Earth',
    summary: 'In the highest city on Earth, gold miners barter with Mother Earth for protection in the mines and a good yield of gold.',
    themes: ['Gold', 'Labor', 'Altitude'],
    images: { hero: '/images/recovered/media16.webp', portrait: '/images/recovered/media52.webp', landscape: '/images/recovered/media49.webp' },
  },
  {
    number: 6,
    slug: 'chapter-6-huanchaco-fishermen',
    title: 'Huanchaco Fishermen',
    community: 'The Last Fishermen',
    region: 'Northern Coast',
    eyebrow: 'A seafaring tradition at the edge',
    summary: 'The last fishermen practicing an ancient fishing method threatened by globalization try to preserve their culture.',
    themes: ['Ocean', 'Fishing', 'Continuity'],
    images: { hero: '/images/recovered/media35.webp', portrait: '/images/recovered/media35.webp', landscape: '/images/recovered/main5.webp' },
  },
];

export const chapterBySlug = Object.fromEntries(chapters.map((chapter) => [chapter.slug, chapter]));
