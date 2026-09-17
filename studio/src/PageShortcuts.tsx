import type {ObjectInputProps} from 'sanity'
import {StateLink} from 'sanity/router'

type Shortcut = {label: string; panes: string[]}
const photos: Shortcut = {label: 'All photographs', panes: ['photography', 'photograph']}
const selection: Shortcut = {label: 'Media selection · reorder gallery', panes: ['photography', 'media-selection']}
const chapters: Shortcut = {label: 'The six chapters', panes: ['chapter']}
const team: Shortcut = {label: 'Filmmaking team', panes: ['team']}
const videos: Shortcut = {label: 'Videos & trailer', panes: ['video']}
const organizations: Shortcut = {label: 'Organizations & map', panes: ['organization-order']}
const identity: Shortcut = {label: 'Site identity & navigation', panes: ['site-identity']}

export const pageShortcuts: Record<string, Shortcut[]> = {
  homePage: [chapters, videos, photos, identity],
  aboutPage: [team, {label: 'Questions & answers', panes: ['faq']}, photos],
  chaptersPage: [chapters, photos],
  involvementPage: [organizations, photos],
  mediaPage: [selection, photos, videos],
  contactPage: [identity],
  pressPage: [team, photos, videos, identity],
  privacyPage: [identity],
  notFoundPage: [identity],
}

export function PageShortcuts(props: ObjectInputProps) {
  const links = pageShortcuts[props.schemaType.name] || []
  return <>
    <nav className="lg-page-shortcuts" aria-label="Related content editors">
      <h2>Also on this page</h2>
      <p>Edit shared content in its collection. Page-specific copy stays below.</p>
      <div>{links.map(link => <StateLink key={link.label} state={{panes: link.panes.map(id => [{id}])}}>
        {link.label} <span aria-hidden="true">→</span>
      </StateLink>)}</div>
    </nav>
    {props.renderDefault(props)}
  </>
}
