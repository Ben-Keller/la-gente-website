export interface Organization {
  type: string;
  name: string;
  place: string;
  coordinates: [number, number];
  image: string;
  description: string;
  action: string;
  url: string;
  linkNote?: string;
}

export const organizations: Organization[] = [
  { type:'Past community initiative', name:'Covid Relief Effort in Iquitos', place:'Iquitos · Loreto', coordinates:[-73.25,-3.75], image:'/images/gallery/media8.webp', description:'During the COVID-19 emergency, friends of the project in Iquitos organized support for food and medicine for vulnerable young people and elders. This listing preserves that community effort; contact the filmmakers for information about the initiative.', action:'Ask about this initiative', url:'mailto:aestheticvoyagerfilms@gmail.com?subject=Iquitos%20community%20initiative', linkNote:'Historical initiative; no active donation campaign is being promoted here.' },
  { type:'Non-profit social enterprise', name:'Threads of Peru', place:'Cusco · Cusco Region', coordinates:[-71.97,-13.52], image:'/images/recovered/media26.webp', description:'Threads of Peru connects the world to handmade treasures of the Andes, helping strengthen ancient craft techniques and empower artisans.', action:'Visit Threads of Peru', url:'https://threadsofperu.com/' },
  { type:'Aid organization · NGO', name:'Porvenir Peru', place:'Cusco Region', coordinates:[-72.45,-13.32], image:'/images/gallery/media34.webp', description:'Registered in Switzerland and Peru, Porvenir Peru supports Indigenous mountain communities in the Andean region of Cusco.', action:'Visit Porvenir Peru', url:'https://www.porvenirperu.org/english/home/' },
  { type:'Conservation organization', name:'Nature and Culture International', place:'Northern Peru', coordinates:[-78.52,-7.15], image:'/images/gallery/media2.webp', description:'Nature and Culture International protects ecosystems and biodiversity, empowers Indigenous communities, and fights climate change.', action:'Visit Nature and Culture', url:'https://www.natureandculture.org/' },
  { type:'Non-profit organization', name:'APECA Peru', place:'Peruvian Amazon', coordinates:[-74.32,-5.15], image:'/images/gallery/main7.webp', description:'APECA has worked with Amazonian communities on public-health training, midwife education, reforestation, clean water, and sanitation. Its work connects community education with conservation and everyday health needs.', action:'View organization profile', url:'https://www.idealist.org/en/nonprofit/66144473ca144200a4a2f8d24656c031-apeca-peru-association-promoting-education-conservation-in-peru-woodland-hills', linkNote:'Organization profile on Idealist; confirm current programs directly before making plans.' },
  { type:'Preservation foundation', name:'Ayahuasca Foundation', place:'Iquitos Region', coordinates:[-72.82,-4.42], image:'/images/gallery/media5.webp', description:'Learn about the foundation’s work connected with Shipibo plant knowledge and educational programs in the Peruvian Amazon.', action:'Visit Ayahuasca Foundation', url:'https://www.ayahuascafoundation.org/' },
  { type:'Family business', name:'Uros Balsero', place:'Lake Titicaca · Puno', coordinates:[-69.98,-15.84], image:'/images/recovered/media13.webp', description:'Learn about Luis’s family tourism business on the floating islands of Lake Titicaca.', action:'View Uros Balsero listing', url:'https://www.tripadvisor.com/Hotel_Review-g298442-d12789366-Reviews-Uros_Balsero-Puno_Puno_Region.html', linkNote:'External listing on Tripadvisor; confirm availability with the family before travelling.' },
  { type:'Non-profit organization', name:'Expedition 5300', place:'La Rinconada · Puno', coordinates:[-69.45,-14.63], image:'/images/recovered/media16.webp', description:'Expedition 5300 supports work related to miner health at the La Rinconada gold mine.', action:'Visit Expedition 5300', url:'https://expedition5300.com/' },
  { type:'Non-profit organization', name:'Share The Wave', place:'Huanchaco · La Libertad', coordinates:[-79.12,-8.08], image:'/images/recovered/media35.webp', description:'Share The Wave supports ecological conservation in Huanchaco, home of the caballitos de totora.', action:'Visit Share The Wave', url:'https://www.sharethewave.org/' },
  { type:'Artisanal salt', name:'Sacred Valley Salt', place:'Maras · Sacred Valley', coordinates:[-72.16,-13.33], image:'/images/recovered/Saltmines2-1-scaled.webp', description:'Sacred Valley Salt is collected by hand in Peru’s Sacred Valley. Learn about the salt and the locally owned cooperatives and independent producers behind it through Sacred Valley Trading Co.', action:'Visit Sacred Valley Trading Co.', url:'https://sacredvalleytradingco.com/' },
];
