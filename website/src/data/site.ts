import {cms, imageUrl, safeLink} from './cms.mjs';
export const SITE = {...cms.settings, defaultImage: imageUrl(cms.settings.defaultImage)};
const links = (items: any[]) => items.map(({label, href}) => ({label, href: safeLink(href)}));
export const primaryNavigation = links(cms.settings.primaryNavigation);
export const footerNavigation = links(cms.settings.footerNavigation);
export const socialLinks = links(cms.settings.socialLinks);
