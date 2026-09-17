import {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {StateLink} from 'sanity/router'
export {BrandLogo} from './BrandLogo'
import hero from '../static/brand/hero.webp'
import team from '../static/brand/team.webp'
import mountains from '../static/brand/mountains.webp'
import peru from '../static/brand/peru.webp'
import river from '../static/brand/river.webp'


type Summary = {chapters: number; organizations: number; photographs: number; drafts: number}
const sections = [
  {id: 'pages', title: 'Pages', description: 'Page copy, layout sections and SEO', cover: hero},
  {id: 'site-identity', title: 'Site identity & navigation', description: 'Brand, contact details and shared links', cover: mountains},
  {id: 'chapter', title: 'The six chapters', description: 'Community stories and chapter photography', cover: mountains},
  {id: 'organization-order', title: 'Organizations & map', description: 'Listings, map locations and page order', cover: peru},
  {id: 'team', title: 'Filmmaking team', description: 'Biographies, portraits and member order', cover: team},
  {id: 'faq', title: 'Questions & answers', description: 'Shared frequently asked questions', cover: river},
  {id: 'photography', title: 'Photography', description: 'All photographs and Media selection', cover: river},
  {id: 'video', title: 'Videos & trailer', description: 'Video links, clips and poster images', cover: hero},
]
export function Dashboard() {
  const client = useClient({apiVersion: '2026-09-17'})
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    const refresh = () => client.fetch<Summary>(`{
      "chapters": count(*[_type == "chapter" && !(_id in path("drafts.**"))]),
      "organizations": count(*[_type == "organization" && !(_id in path("drafts.**"))]),
      "photographs": count(*[_type == "photograph" && !(_id in path("drafts.**"))]),
      "drafts": count(*[_id in path("drafts.**")])
    }`, {}, {perspective: 'raw'}).then(result => {if (active) {setSummary(result); setError('')}}).catch(() => {if (active) setError('Content counts could not be refreshed. Your editing tools remain available.')})
    void refresh()
    const interval = setInterval(refresh, 30000)
    return () => {active = false; clearInterval(interval)}
  }, [client])
  return <main className="lg-dashboard">
    <header className="lg-welcome">
      <div className="lg-welcome-copy"><span className="lg-kicker">Aesthetic Voyager Films · Editorial workspace</span>
        <h1>La Gente de la Tierra</h1><p>Six communities. Stories connected to the Earth.</p>
        <a href="https://lagentedelatierra.com" target="_blank" rel="noreferrer">Open the live website <span aria-hidden>→</span></a>
      </div>
    </header>
    <section className="lg-stats" aria-label="Content overview">
      {(['chapters', 'organizations', 'photographs', 'drafts'] as const).map(key => <div key={key}><strong>{summary?.[key] ?? '—'}</strong><span>{key}</span></div>)}
    </section>
    {error && <p role="status">{error}</p>}
    <section className="lg-section"><div className="lg-section-title"><h2>Your editorial workspace</h2><p>Choose a section to manage its content.</p></div>
      <div className="lg-page-grid">{sections.map(section => <StateLink key={section.id} state={{panes: [[{id: section.id}]]}} className="lg-page-card">
        <div className="lg-page-cover" style={{backgroundImage: `linear-gradient(0deg, #101411b3, transparent), url(${section.cover})`}}><span>{section.title}</span></div>
        <div className="lg-page-meta"><span>{section.description}</span><span aria-hidden>→</span></div>
      </StateLink>)}</div>
    </section>
    <section className="lg-guidance">
      <div><span className="lg-kicker">01 · Edit with confidence</span><h2>One story, wherever it appears.</h2><p>Edit chapters, organizations, team members and photographs in their shared collections. Use the image crop and focal-point controls to keep people and landscapes framed well.</p></div>
      <div><span className="lg-kicker">02 · Publishing</span><h2>Edit. Publish. Go live.</h2><p>Your edits save while you work. Click Publish when ready. GitHub checks published content every five minutes and deploys changes after validation; scheduled runs can be delayed. Ordering changes and group names save directly. A failed build leaves the previous website online.</p><a href="https://github.com/Ben-Keller/la-gente-website/actions/workflows/deploy.yml" target="_blank" rel="noreferrer">Deployment status / run now →</a></div>
      <div><span className="lg-kicker">03 · Free plan</span><h2>Simple, shared stewardship.</h2><p>This workspace uses Free-plan features only. Keep confidential notes and form submissions out of the public dataset. Do not enable paid add-ons or depend on temporary trial features.</p></div>
    </section>
  </main>
}
