export const SITE = {
  name: 'La Gente de La Tierra',
  alternateName: 'The People of the Earth',
  email: 'aestheticvoyagerfilms@gmail.com',
  description: 'A six-part documentary series exploring relationships between communities and the natural world across Peru.',
  productionCompany: 'Aesthetic Voyager Films',
  defaultImage: '/images/hero-poster.webp',
} as const;

export const primaryNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Chapters', href: '/communities/' },
  { label: 'Get involved', href: '/get-involved/' },
  { label: 'Media', href: '/media/' },
] as const;

export const footerNavigation = [
  ...primaryNavigation.slice(1),
  { label: 'Watch & release', href: '/watch/' },
  { label: 'Contact', href: '/contact-us/' },
  { label: 'Privacy', href: '/privacy/' },
] as const;

export const socialLinks = [
  { label: 'Email', href: `mailto:${SITE.email}` },
  { label: 'Instagram', href: 'https://www.instagram.com/lagentedelatierra/' },
  { label: 'Facebook', href: 'https://www.facebook.com/lagentedelatierra/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@lagentedelatierra' },
  { label: 'Vimeo', href: 'https://vimeo.com/' },
] as const;
