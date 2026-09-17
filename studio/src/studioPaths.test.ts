import assert from 'node:assert/strict'
import {test} from 'node:test'
import {pageEditorPath} from './studioPaths'

test('start-page cards target the content tool and stable singleton pane IDs', () => {
  for (const type of ['homePage', 'aboutPage', 'chaptersPage', 'involvementPage', 'mediaPage', 'contactPage', 'pressPage', 'privacyPage', 'notFoundPage']) {
    assert.equal(pageEditorPath('/', type), `/content/pages;${type}`)
    assert.equal(pageEditorPath('/studio/la-gente/', type), `/studio/la-gente/content/pages;${type}`)
    assert.equal(pageEditorPath('/studio/la-gente', type), `/studio/la-gente/content/pages;${type}`)
  }
})
