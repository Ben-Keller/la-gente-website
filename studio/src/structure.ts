import type {Component, StructureResolver} from 'sanity/structure'
import {pageDefinitions} from '../schemaTypes'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {Dashboard} from './Dashboard'
import {HomeIcon} from '@sanity/icons/Home'

// Keep the plugin's document routing and drag behavior, but not its reset/debug menu.
const organizationList = (S: Parameters<StructureResolver>[0], context: Parameters<StructureResolver>[1]) => {
  const item = orderableDocumentListDeskItem({type: 'organization', title: 'Organizations & map', id: 'organization-order', S, context})
  const pane = item.child as Component
  return {...item, child: {...pane, menuItems: pane.menuItems?.filter(menu => menu.action !== 'resetOrder' && menu.action !== 'showIncrements')}}
}

export const structure: StructureResolver = (S, context) => S.list().title('La Gente · Website').items([
  S.listItem().id('start').title('Start here').icon(HomeIcon).child(S.component().id('start').title('Start here').component(Dashboard)),
  S.listItem().id('pages').title('Pages').child(S.list().title('Website pages').items(pageDefinitions.map(([type, title]) =>
    S.listItem().id(type).title(title).child(S.document().schemaType(type).documentId(type).title(title)),
  ))),
  S.listItem().id('site-identity').title('Site identity & navigation').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
  S.documentTypeListItem('chapter').title('The six chapters'),
  organizationList(S, context),
  orderableDocumentListDeskItem({type: 'person', title: 'Filmmaking team', id: 'team', S, context}),
  S.documentTypeListItem('faq').title('Questions & answers'),
  S.listItem().id('photography').title('Photography').child(S.list().title('Photography').items([
    S.documentTypeListItem('photograph').title('All photographs'),
    orderableDocumentListDeskItem({type: 'photograph', title: 'Media selection', id: 'media-selection', filter: 'gallery == true', createIntent: false, S, context}),
  ])),
  S.documentTypeListItem('video').title('Videos & trailer'),
])
