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
    locationDescription: 'High in the Cusco region, Pitukiska and its neighboring communities are connected by paths through an agricultural mountain landscape. The celebration moves from the community to the ridges that mark its boundaries.',
    story: [
      'On August 1, Pitukiska welcomes neighboring communities for a celebration honoring Pachamama, Mother Earth. For families whose livelihoods depend on cultivation, the new agricultural cycle is a time to give thanks and express hopes for the year ahead.',
      'The celebration begins with t’iki pallay: a journey to gather wildflowers for the ceremony. Participants then follow the mountain boundaries in the linderaje, dancing and calling out as they move along the ridges. At a high point, offerings of coca leaves and other natural goods express gratitude for health and safety, and hopes for plentiful crops.',
    ],
    environmentalFocus: 'Agriculture and ceremony follow the rhythms of the land. The chapter explores a relationship with Pachamama expressed through seasonal traditions, shared work, and knowledge carried between generations.',
    productionNote: 'Wildflower gathering, music, ridge walking, and offerings bring the surrounding communities together. The landscape is not simply a backdrop: it is part of the celebration itself.',
    relatedOrganization: 'Porvenir Peru',
    relatedOrganizationUrl: 'https://www.porvenirperu.org/english/home/',
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
    locationDescription: 'The story takes place outside Iquitos, in the northeastern Peruvian Amazon. Rivers connect the city with surrounding communities and shape travel through the region.',
    story: [
      'Three Shipibo-Conibo brothers, practitioners of traditional plant medicine, moved to a small plot of land outside Iquitos to build a school. Their goal was to share the techniques and songs of healing that are part of their family’s knowledge.',
      'The chapter offers an intimate view of that ambition: a place where knowledge can be taught and traditions can continue. Through their accounts and songs, the family shares a relationship with the forest that connects plants, learning, and spiritual life.',
    ],
    environmentalFocus: 'The forest is both a living environment and a source of knowledge. The chapter explores the connections between plant diversity, cultural continuity, and the work of passing traditions to others.',
    productionNote: 'Family accounts and songs give a personal perspective on the school and the knowledge its founders hope to share. Healing practices are presented through the experiences and beliefs of the people featured.',
    relatedOrganization: 'Ayahuasca Foundation',
    relatedOrganizationUrl: 'https://www.ayahuascafoundation.org/',
    images: { hero: '/images/gallery/media5.webp', portrait: '/images/gallery/media46.webp', landscape: '/images/gallery/media8.webp' },
  },
  {
    number: 3,
    slug: 'chapter-3-maras',
    title: 'Maras',
    community: 'Maras Salt Pans',
    region: 'Sacred Valley',
    elevation: '3,380 m',
    eyebrow: 'An ancient landscape of salt',
    summary: 'A multigenerational family tends the salt pools of Maras, sharing the skilled work and inherited knowledge behind this distinctive landscape.',
    themes: ['Salt', 'Heritage', 'Stewardship'],
    location: 'Maras, Sacred Valley, Peru',
    locationDescription: 'The Salineras de Maras occupy a steep valley in Peru’s Sacred Valley. Mineral-rich spring water is directed through a network of channels into terraced evaporation pools.',
    story: [
      'Across the slopes of Maras, thousands of salt pools catch the light in shades of white, pink, and brown. Spring water flows through intricate channels, filling the shallow ponds before the sun leaves salt behind.',
      'For the family featured in this chapter, this landscape is a place of work and inherited knowledge. Tending the pools and gathering salt by hand connects daily life to a system sustained across generations—a meeting of water, mineral-rich earth, and human care.',
    ],
    environmentalFocus: 'Water, sunlight, and careful maintenance sustain the salt pans. The chapter explores a livelihood that depends on the physical landscape and the knowledge needed to work with it.',
    productionNote: 'The geometry of the terraces gives way to the details of everyday work: guiding water, tending a pool, and collecting salt. Family accounts bring a human scale to this expansive landscape.',
    relatedOrganization: 'Sacred Valley Salt',
    relatedOrganizationUrl: 'https://sacredvalleytradingco.com/',
    images: { hero: '/images/recovered/Saltmines2-1-scaled.webp', portrait: '/images/recovered/media19.webp', landscape: '/images/recovered/Saltmines2-1-scaled.webp' },
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
    locationDescription: 'On Lake Titicaca near Puno, totora reeds provide material for floating islands, homes, and boats. Water shapes the routes and routines of the family featured in this chapter.',
    story: [
      'On the floating islands of Lake Titicaca, home is built from the reeds that grow around it. The Uros have developed skills in weaving and maintaining islands, boats, and houses, living with the lake as an everyday presence.',
      'Luis and his family share their world through fishing, travel by boat, and life on the island. Their story offers a personal perspective on a place often seen through tourism, revealing the work and knowledge involved in sustaining a home on the water.',
    ],
    environmentalFocus: 'Life on the islands depends on continuing care for reed structures and a close relationship with the lake. Family traditions, livelihoods, and adaptation meet in a landscape that must be maintained over time.',
    productionNote: 'Time with Luis and his family follows the rhythms of the lake, from fishing trips to everyday journeys between boats and islands.',
    relatedOrganization: 'Uros Balsero',
    relatedOrganizationUrl: 'https://www.tripadvisor.com/Hotel_Review-g298442-d12789366-Reviews-Uros_Balsero-Puno_Puno_Region.html',
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
    locationDescription: 'La Rinconada is a gold-mining settlement high in the mountains of Peru’s Puno region. The city sits beneath a glaciated landscape, where daily life and work take place at extreme altitude.',
    story: [
      'In La Rinconada, the search for gold shapes the city and the lives of those who work around its mines. Mining organizations work different sites, while others search through discarded rock for traces of gold left behind.',
      'The people featured describe more than the physical demands of this work. Beliefs about Mother Earth and protection in the mines are part of their relationship with a landscape that offers a livelihood while exposing them to uncertainty. The chapter brings these spiritual and material worlds together.',
    ],
    environmentalFocus: 'Extraction, labor, and life at altitude are closely connected here. The chapter considers a relationship with the Earth shaped by what people seek beneath its surface and the conditions in which they live.',
    productionNote: 'Accounts from the mining community sit alongside views of the settlement and surrounding mountains, revealing the scale of the landscape and the daily search for a successful yield.',
    relatedOrganization: 'Expedition 5300',
    relatedOrganizationUrl: 'https://expedition5300.com/',
    images: { hero: '/images/recovered/media16.webp', portrait: '/images/recovered/media52.webp', landscape: '/images/recovered/main5.webp' },
  },
  {
    number: 6,
    slug: 'chapter-6-huanchaco-fishermen',
    title: 'Huanchaco Fishermen',
    community: 'The Last Fishermen',
    region: 'Northern Coast',
    elevation: 'Sea level',
    eyebrow: 'A seafaring tradition at the edge',
    summary: 'Fishermen in Huanchaco share a tradition of working at sea in caballitos de totora and their hopes for passing that knowledge to another generation.',
    themes: ['Ocean', 'Fishing', 'Continuity'],
    location: 'Huanchaco, La Libertad Region, Peru',
    locationDescription: 'Huanchaco lies on Peru’s northern Pacific coast. The beach and ocean are connected to nearby reed-growing areas that supply totora for traditional fishing craft.',
    story: [
      'In Huanchaco, fishermen cultivate, cut, and dry totora reeds before shaping them into caballitos de totora—“little horses of reed.” These craft carry a living connection between the coast, the plants that grow there, and the knowledge needed to fish at sea.',
      'The fishermen describe pressures on that way of life: competition from industrial fishing, coastal erosion affecting reed-growing areas, and younger generations choosing different livelihoods. Their story asks what it takes to sustain a tradition when both the environment and the world of work are changing.',
    ],
    environmentalFocus: 'Fishing and reed cultivation depend on one another. Caring for the coast means considering both the ocean and the wetland plants that make this practice possible.',
    productionNote: 'From working with reeds to setting out from the shore, the chapter follows a fishing practice sustained by skill and experience. The fishermen’s accounts place cultural continuity at the center of the story.',
    relatedOrganization: 'Share The Wave',
    relatedOrganizationUrl: 'https://www.sharethewave.org/',
    images: { hero: '/images/recovered/media35.webp', portrait: '/images/recovered/media35.webp', landscape: '/images/gallery/InkaDogRuins.webp' },
  },
];

export const chapterBySlug = Object.fromEntries(chapters.map((chapter) => [chapter.slug, chapter]));
