import {defineConfig} from 'sanity'
import {createElement} from 'react'
import {DefaultStart} from './src/DefaultStart'
import {structureTool} from 'sanity/structure'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './src/structure'
import {BrandLogo} from './src/BrandLogo'
import './src/brand.css'

export default defineConfig({
  name: 'la-gente',
  title: 'La Gente de la Tierra',

  projectId: '80rpogyy',
  dataset: 'production',
  tasks: {enabled: false},
  scheduledDrafts: {enabled: false},
  releases: {enabled: false},

  icon: BrandLogo,
  studio: {components: {logo: BrandLogo}},
  plugins: [structureTool({name: 'content', title: 'Edit website', structure})],
  tools: tools => tools.map(tool => tool.name === 'content' ? {
    ...tool,
    component: props => createElement(DefaultStart, {children: createElement(tool.component, props)}),
  } : tool),
  document: {
    comments: {enabled: false},
    newDocumentOptions: options => options.filter(item => !singletonTypes.has(item.templateId)),
    actions: (actions, context) => singletonTypes.has(context.schemaType)
      ? actions.filter(action => !['delete', 'duplicate', 'unpublish'].includes(action.action || ''))
      : actions,
  },

  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(template => !singletonTypes.has(template.schemaType)),
  },
})
