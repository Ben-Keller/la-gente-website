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

import {cms, imageUrl, plain, safeLink} from './cms.mjs';
export const organizations: Organization[] = cms.organizations.map((org: any) => ({
  name: org.name, type: org.category, place: org.place,
  coordinates: [org.location.lng, org.location.lat], image: imageUrl(org.image, 900),
  description: plain(org.description), action: org.link.label, url: safeLink(org.link.href), linkNote: org.linkNote,
}));
