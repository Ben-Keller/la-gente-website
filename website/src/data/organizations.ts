export interface Organization {
  type: string;
  name: string;
  place: string;
  coordinates: [number, number];
  image: string;
  description: string;
  action: string;
  url: string;
}

export const organizations: Organization[] = [
  { type:'Community fundraiser', name:'Covid Relief Effort in Iquitos', place:'Iquitos · Loreto', coordinates:[-73.25,-3.75], image:'/images/gallery/media8.webp', description:'The Amazon region was hit hard by COVID-19. Friends of the project in Iquitos led an effort to provide food and medicine to vulnerable youth and elders facing limited government support and access to resources.', action:'Find current Iquitos fundraisers', url:'https://www.gofundme.com/s?q=iquitos%20peru%20relief' },
  { type:'Non-profit social enterprise', name:'Threads of Peru', place:'Cusco · Cusco Region', coordinates:[-71.97,-13.52], image:'/images/recovered/media26.webp', description:'Threads of Peru connects the world to handmade treasures of the Andes, helping strengthen ancient craft techniques and empower artisans.', action:'Visit Threads of Peru', url:'https://threadsofperu.com/' },
  { type:'Aid organization · NGO', name:'Porvenir Peru', place:'Cusco Region', coordinates:[-72.45,-13.32], image:'/images/recovered/media30.webp', description:'Registered in Switzerland and Peru, Porvenir Peru supports Indigenous mountain communities in the Andean region of Cusco.', action:'Visit Porvenir Peru', url:'https://www.porvenirperu.org/english/' },
  { type:'Conservation organization', name:'Nature and Culture International', place:'Northern Peru', coordinates:[-78.52,-7.15], image:'/images/recovered/GI-Main.webp', description:'Nature and Culture International protects ecosystems and biodiversity, empowers Indigenous communities, and fights climate change.', action:'Visit Nature and Culture', url:'https://www.natureandculture.org/' },
  { type:'Non-profit organization', name:'APECA Peru', place:'Peruvian Amazon', coordinates:[-74.32,-5.15], image:'/images/gallery/media50.webp', description:'APECA works with Indigenous communities along the Amazon on public-health training, midwife education, reforestation, clean water, and sanitation in cooperation with local natural-medicine practices.', action:'Visit APECA Peru', url:'https://apecaperu.org/' },
  { type:'Preservation foundation', name:'Ayahuasca Foundation', place:'Iquitos Region', coordinates:[-72.82,-4.42], image:'/images/gallery/media5.webp', description:'The Ayahuasca Foundation offers opportunities to learn from the Inka Kenan Shipibo community in the Amazon through organized retreats.', action:'Visit Ayahuasca Foundation', url:'https://www.ayahuasca-foundation.org/' },
  { type:'Family business', name:'Uros Balsero', place:'Lake Titicaca · Puno', coordinates:[-69.98,-15.84], image:'/images/recovered/media13.webp', description:'Visit the floating islands of Lake Titicaca and support the tourism business of the family of Luis, Uros Balsero.', action:'Find Uros Balsero', url:'https://www.facebook.com/urosbalsero/' },
  { type:'Non-profit organization', name:'Expedition 5300', place:'La Rinconada · Puno', coordinates:[-69.45,-14.63], image:'/images/recovered/media16.webp', description:'Expedition 5300 supports work related to miner health at the La Rinconada gold mine.', action:'Visit Expedition 5300', url:'https://expedition5300.com/' },
  { type:'Non-profit organization', name:'Share The Wave', place:'Huanchaco · La Libertad', coordinates:[-79.12,-8.08], image:'/images/recovered/media35.webp', description:'Share The Wave supports ecological conservation in Huanchaco, home of the caballitos de totora.', action:'Visit Share The Wave', url:'https://sharethewave.org/' },
  { type:'Peruvian owned', name:'Sacred Valley Salt', place:'Maras · Sacred Valley', coordinates:[-72.16,-13.33], image:'/images/recovered/Saltmines2-1-scaled.webp', description:'Sacred Valley Salt is collected by hand in Peru’s Sacred Valley of the Incas, as it has been for the past millennium. Its products are made by locally owned and operated cooperatives and independent small businesses.', action:'Visit Sacred Valley Salt', url:'https://sacredvalleysalt.com/' },
];
