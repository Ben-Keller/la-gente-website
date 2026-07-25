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
  environmentalFocus: string;
  productionNote: string;
  relatedOrganization: string;
  relatedOrganizationUrl: string;
  images: { hero: string; portrait: string; landscape: string };
};

export const chapters: Chapter[] = [
  {
    number: 1,
    slug: 'chapter-1-pitukiska',
    title: 'Pitukiska',
    community: 'Pitukiska New Year',
    region: 'Cusco Region',
    elevation: 'Approx. 4,000 m',
    eyebrow: 'Renewal in the high Andes',
    summary: 'A Quechua community in the high Andes gathers for the Andean New Year to celebrate Mother Earth.',
    themes: ['Pachamama', 'Ceremony', 'Agriculture'],
    location: 'Pitukiska, Cusco Region, Peru',
    environmentalFocus: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Traditional calendars, high-altitude agriculture, and seasonal change shape this chapter’s relationship with Pachamama.',
    productionNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The production followed preparations for the Andean New Year across changing mountain light and communal ceremony.',
    relatedOrganization: 'Porvenir Peru',
    relatedOrganizationUrl: 'https://www.porvenirperu.org/english/',
    images: { hero: '/images/recovered/media23.webp', portrait: '/images/recovered/media26.webp', landscape: '/images/recovered/media30.webp' },
  },
  {
    number: 2,
    slug: 'chapter-2-shipibo',
    title: 'Shipibo',
    community: 'Shipibo-Conibo Plant Healers',
    region: 'Peruvian Amazon',
    elevation: 'Approx. 150 m',
    eyebrow: 'Plant knowledge and living tradition',
    summary: 'A Shipibo curandero family builds a school to teach their traditional plant-medicine techniques and songs of healing.',
    themes: ['Plant medicine', 'Knowledge', 'Amazon'],
    location: 'Peruvian Amazon, Peru',
    environmentalFocus: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The chapter considers biodiversity, plant knowledge, and the continuity of healing traditions in a changing rainforest.',
    productionNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Filming centered on family knowledge, songs of healing, and the work of building a place where traditions can be taught.',
    relatedOrganization: 'APECA Peru',
    relatedOrganizationUrl: 'https://apecaperu.org/',
    images: { hero: '/images/gallery/media5.webp', portrait: '/images/gallery/media50.webp', landscape: '/images/gallery/media8.webp' },
  },
  {
    number: 3,
    slug: 'chapter-3-maras',
    title: 'Maras',
    community: 'Maras Salt Pans',
    region: 'Sacred Valley',
    elevation: '3,380 m',
    eyebrow: 'An ancient landscape of salt',
    summary: 'A multigenerational family works ancient salt pools made by their Incan ancestors, producing salt said to cure sickness.',
    themes: ['Salt', 'Heritage', 'Stewardship'],
    location: 'Maras, Sacred Valley, Peru',
    environmentalFocus: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Water, mineral-rich earth, and inherited stewardship sustain an agricultural system shaped across generations.',
    productionNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The crew documented the geometry of the pans and the patient handwork required to guide water and gather salt.',
    relatedOrganization: 'Sacred Valley Salt',
    relatedOrganizationUrl: 'https://sacredvalleysalt.com/',
    images: { hero: '/images/recovered/Saltmines2-1-scaled.webp', portrait: '/images/recovered/media19.webp', landscape: '/images/recovered/media22.webp' },
  },
  {
    number: 4,
    slug: 'chapter-4-floating-islands',
    title: 'Floating Islands',
    community: 'Floating Islands of Lake Titicaca',
    region: 'Lake Titicaca',
    elevation: '3,812 m',
    eyebrow: 'A home made and remade from reeds',
    summary: 'An Uros family living on a floating island of reeds on the highest navigable lake in the world explores their culture.',
    themes: ['Water', 'Totora', 'Adaptation'],
    location: 'Lake Titicaca, Puno Region, Peru',
    environmentalFocus: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Water levels, totora reeds, tourism, and cultural continuity converge on a landscape that must be continually remade.',
    productionNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Filming took place on the lake and among structures built from reeds, following the rhythms of family and water.',
    relatedOrganization: 'Uros Balsero',
    relatedOrganizationUrl: 'https://www.facebook.com/urosbalsero/',
    images: { hero: '/images/recovered/media13.webp', portrait: '/images/recovered/media12.webp', landscape: '/images/recovered/media39.webp' },
  },
  {
    number: 5,
    slug: 'chapter-5-rinconada',
    title: 'La Rinconada',
    community: 'La Rinconada Gold Mine',
    region: 'Puno Region',
    elevation: 'Approx. 5,100 m',
    eyebrow: 'At the highest city on Earth',
    summary: 'In the highest city on Earth, gold miners barter with Mother Earth for protection in the mines and a good yield of gold.',
    themes: ['Gold', 'Labor', 'Altitude'],
    location: 'La Rinconada, Puno Region, Peru',
    environmentalFocus: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Glacial change, mining, labor, and life at extreme altitude frame the environmental stakes of this chapter.',
    productionNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The crew worked at exceptional altitude to document the physical and spiritual negotiations surrounding the mine.',
    relatedOrganization: 'Expedition 5300',
    relatedOrganizationUrl: 'https://expedition5300.com/',
    images: { hero: '/images/recovered/media16.webp', portrait: '/images/recovered/media52.webp', landscape: '/images/recovered/media49.webp' },
  },
  {
    number: 6,
    slug: 'chapter-6-huanchaco-fishermen',
    title: 'Huanchaco Fishermen',
    community: 'The Last Fishermen',
    region: 'Northern Coast',
    elevation: 'Sea level',
    eyebrow: 'A seafaring tradition at the edge',
    summary: 'The last fishermen practicing an ancient fishing method threatened by globalization try to preserve their culture.',
    themes: ['Ocean', 'Fishing', 'Continuity'],
    location: 'Huanchaco, La Libertad Region, Peru',
    environmentalFocus: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Coastal development, ocean health, and globalization place pressure on an ancient relationship between people and sea.',
    productionNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Production followed fishermen from the beach into the Pacific aboard caballitos de totora.',
    relatedOrganization: 'Share The Wave',
    relatedOrganizationUrl: 'https://sharethewave.org/',
    images: { hero: '/images/recovered/media35.webp', portrait: '/images/recovered/media35.webp', landscape: '/images/recovered/main5.webp' },
  },
];

export const chapterBySlug = Object.fromEntries(chapters.map((chapter) => [chapter.slug, chapter]));
