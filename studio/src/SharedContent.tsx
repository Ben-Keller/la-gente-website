import {useEffect, useState} from 'react'
import {type ObjectInputProps, type ReferenceInputProps, useClient, set, unset} from 'sanity'
import {IntentLink, StateLink} from 'sanity/router'

type Usage = {_id: string; _type: string; title?: string; name?: string; parents?: Usage[]}
const implicitPages: Record<string, string[]> = {
  person: ['About', 'Press kit'], chapter: ['Home', 'Chapters', 'Chapter detail'],
  organization: ['Get involved', 'Related chapter'], faq: ['About'], siteSettings: ['All pages'],
}
// Retained migration fields must not report a photograph as still in active use.
const activeReference = (id: string) => `references(${id}) && !defined(supersededBy) && select(
  _type match "*Page" => (${id} in openingImages[].photograph._ref || ${id} == seo.image.photograph._ref || ${id} == trailer._ref || ${id} == backgroundVideo._ref || ${id} in sections[!(kind in ["opening","team","chapters","faqs","organizations","gallery"])].images[].photograph._ref),
  _type == "video" => purpose != "background" && poster.photograph._ref == ${id},
  true
)`

export function SharedContent(props: ObjectInputProps) {
  const client = useClient({apiVersion: '2026-09-17'})
  const id = String(props.value?._id || '').replace(/^drafts\./, '')
  const [uses, setUses] = useState<Usage[]>([])
  const [status, setStatus] = useState('Checking usage…')
  useEffect(() => {
    if (!id) return
    let active = true
    const refresh = () => client.fetch<Usage[]>(`*[${activeReference('$id')}]{_id,_type,title,name,"parents": *[${activeReference('^._id')}]{_id,_type,title,name}}`, {id}, {perspective: 'raw'})
      .then(items => {if (active) {setUses(items); setStatus(items.length ? '' : 'No explicit references yet.')}})
      .catch(() => {if (active) setStatus('Usage could not be loaded. Retry by reopening this item.')})
    refresh()
    let timer: ReturnType<typeof setTimeout>
    const subscription = client.listen('*[!(_id in path("_.**"))]', {}, {includeResult: false}).subscribe({next: () => {clearTimeout(timer); timer = setTimeout(refresh, 500)}, error: () => {}})
    return () => {active = false; clearTimeout(timer); subscription.unsubscribe()}
  }, [client, id])
  const pages = new Set(implicitPages[props.schemaType.name] || [])
  if (props.schemaType.name === 'photograph' && props.value?.gallery) pages.add('Media gallery')
  const unique = new Map<string, Usage>()
  for (const use of uses) for (const item of [use, ...(use.parents || [])]) {
    unique.set(item._id.replace(/^drafts\./, ''), item)
    for (const page of implicitPages[item._type] || []) pages.add(page)
    if (item._type.endsWith('Page')) pages.add(item.title || item._type)
  }
  return <>
    <aside className="lg-page-shortcuts">
      <h2>Shared item · affects all uses</h2>
      <p>Publishing changes here updates every linked placement. To change only one placement, choose a different item or use its local crop. Publish this item separately from its page.</p>
      {pages.size > 0 && <p><strong>Used on:</strong> {[...pages].join(', ')}</p>}
      {status && <p role="status">{status}</p>}
      <div>{[...unique].map(([key, item]) => <IntentLink key={key} intent="edit" params={{id: key, type: item._type}}>{item.title || item.name || item._type}{item._id.startsWith('drafts.') ? ' (draft)' : ''}</IntentLink>)}</div>
    </aside>
    {props.renderDefault(props)}
  </>
}

export function VideoReferenceInput(props: ReferenceInputProps) {
  return <>
    {props.renderDefault(props)}
    {props.value?._ref && <div className="lg-page-shortcuts"><p>Changing this selection affects only this page. Editing the shared video affects every page that selects it.</p><IntentLink intent="edit" params={{id: props.value._ref, type: 'video'}}>Edit shared item—affects all uses</IntentLink></div>}
  </>
}

export function PlacementInput(props: ObjectInputProps) {
  const client = useClient({apiVersion: '2026-09-17'})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const photograph = props.value?.photograph as {_ref?: string} | undefined
  async function createCrop() {
    if (!photograph?._ref) return
    setBusy(true); setError('')
    try {
      const image = await client.fetch('*[_id == $id][0].image', {id: photograph._ref}, {perspective: 'published'})
      if (!image?.asset) throw new Error('Publish the selected photograph first.')
      props.onChange(set(image, ['localFraming']))
    } catch (e) {setError(e instanceof Error ? e.message : 'Could not prepare local crop.')}
    finally {setBusy(false)}
  }
  return <>
    <p>Choosing a photograph changes only this placement. Opening its shared record and editing it affects all uses.</p>
    {props.renderDefault(props)}
    {photograph?._ref && <div className="lg-page-shortcuts">
      <IntentLink intent="edit" params={{id: photograph._ref, type: 'photograph'}}>Edit shared item—affects all uses</IntentLink>
      <p>Local framing uses the same original file, without creating a duplicate photograph.</p>
      <button type="button" disabled={busy || props.readOnly} onClick={createCrop}>{busy ? 'Preparing…' : props.value?.localFraming ? 'Reset local crop from shared photograph' : 'Customize crop for this placement'}</button>
      {props.value?.localFraming && <button type="button" disabled={props.readOnly} onClick={() => props.onChange(unset(['localFraming']))}>Use shared crop instead</button>}
      {error && <p role="alert">{error}</p>}
    </div>}
  </>
}

const destinations: Record<string, {label: string; panes: string[]}> = {
  team: {label: 'Edit team members & portraits', panes: ['team']},
  chapters: {label: 'Edit the six chapters', panes: ['chapter']},
  faqs: {label: 'Edit questions & answers', panes: ['faq']},
  organizations: {label: 'Edit organizations & map', panes: ['organization-order']},
  gallery: {label: 'Edit gallery selection & order', panes: ['photography', 'media-selection']},
  trailer: {label: 'Edit shared videos', panes: ['video']},
}
export function SectionInput(props: ObjectInputProps) {
  const kind = String(props.value?.kind || 'content')
  const target = destinations[kind]
  return <>
    {target && <aside className="lg-page-shortcuts"><p>This section controls its introduction. Shared items are edited in their collection{kind === 'trailer' ? '; choose the video in this page’s Images & videos tab' : ''}.</p><StateLink state={{panes: target.panes.map(id => [{id}])}}>{target.label}</StateLink></aside>}
    {kind === 'opening' && <p>In the Images & videos tab, choose Opening image & mobile slideshow and Background video. The first image is also the loading poster.</p>}
    {props.renderDefault(props)}
  </>
}
