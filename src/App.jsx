import { useState, useEffect, useRef } from 'react'
import Orb from './Orb.jsx'
import Portrait from './Portrait.jsx'
import ContactModal from './ContactModal.jsx'
import { ProjectCard, SpotCard } from './Cards.jsx'
import { Rag, Gateway, Typed } from './Demos.jsx'
import { Counter, Reveal, useInView, useScramble } from './hooks.jsx'
import { projects, automation, skills, jobs, marquee } from './data.js'

const K = t => <span className="k">{t}</span>
const S = t => <span className="s">{t}</span>
const json = [
  '{',
  <>  {K('"status"')}: <span className="ok">200</span>,</>,
  <>  {K('"name"')}: {S('"Jaydheep R"')},</>,
  <>  {K('"role"')}: {S('"AI Developer"')},</>,
  <>  {K('"location"')}: {S('"Chennai, India"')},</>,
  <>  {K('"shipped"')}: [{S('"ReviewGenX"')}, {S('"VisualGenX"')}, {S('"AI Gateway"')}, {S('"DK Platform"')}],</>,
  <>  {K('"ai"')}: [{S('"LLM integration"')}, {S('"RAG"')}, {S('"guardrails"')}],</>,
  <>  {K('"open_to_work"')}: true</>,
  '}',
]

const nav = ['about', 'projects', 'experience', 'automation', 'skills', 'contact']
const EMAIL = 'jaydheeprsk@gmail.com'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [active, setActive] = useState('')
  const [copied, setCopied] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const bar = useRef(null), glow = useRef(null)
  const [termRef, termSeen] = useInView(0.4)
  const tagline = useScramble('builds backends that think.')

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme) }, [theme])

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    nav.forEach(n => { const el = document.getElementById(n); el && io.observe(el) })
    const scroll = () => { const h = document.documentElement; bar.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})` }
    const move = e => { glow.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)` }
    const fine = matchMedia('(pointer:fine)').matches
    addEventListener('scroll', scroll, { passive: true }); if (fine) addEventListener('pointermove', move)
    return () => { io.disconnect(); removeEventListener('scroll', scroll); removeEventListener('pointermove', move) }
  }, [])

  const copy = () => navigator.clipboard?.writeText(EMAIL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })

  return (
    <>
      <div className="progress" ref={bar} />
      <div className="cursor-glow" ref={glow} aria-hidden="true" />
      <header className="nav"><div className="pill">
        <a className="logo" href="#top">Jaydheep<b>.</b></a>
        <nav aria-label="Main"><ul>{nav.map(n => <li key={n}><a href={'#' + n} className={active === n ? 'on' : ''}>{n[0].toUpperCase() + n.slice(1)}</a></li>)}</ul></nav>
        <button className="toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Switch colour theme">{theme === 'dark' ? 'Light' : 'Dark'}</button>
      </div></header>

      <main id="top">
        <div className="hero"><div className="wrap herogrid">
          <div>
            <span className="status"><i />Open to work · Chennai</span>
            <h1>Jaydheep R<span className="grad" aria-label="builds backends that think.">{tagline}</span></h1>
            <p className="lead">AI developer with 4+ years of Python experience. I ship LLM products, RAG features, an AI gateway that keeps prompts safe, and automation that replaces manual work.</p>
            <div className="cta">
              <a className="btn primary" href="#projects">See live products</a>
              <a className="btn" href={import.meta.env.BASE_URL + 'Jaydheep_Professional_Resume.pdf'} download>Download resume</a>
            </div>
          </div>
          <div className="stage"><Orb /><Portrait /></div>
        </div></div>

        <div className="marquee" aria-hidden="true"><div className="track">{[...marquee, ...marquee].map((m, i) => <span key={i}>{m}</span>)}</div></div>

        <section id="about"><div className="wrap">
          <div className="about">
            <div>
              <h2>Backend first, AI where it helps.</h2>
              <p className="sub">I design logic-heavy services, REST APIs and background pipelines on MongoDB, and plug LLMs and retrieval (RAG) into them so teams get answers from their own data.</p>
              <p className="muted">I like work where the data keeps changing shape: configurable reports, XML-to-PDF documents and Pandas clean-up of large datasets. I care about performance and reliability as much as features.</p>
            </div>
            <div className="term" ref={termRef} aria-label="Sample API response describing Jaydheep">
              <div className="tbar"><i /><i /><i /><b>GET</b> /developers/jaydheep</div>
              <Typed lines={json} start={termSeen} />
            </div>
          </div>
          <div className="stats">
            {[[4, '+', 'years building backend and automation'], [4, '', 'live AI products and platforms'], [3, '', 'Python frameworks in production'], [null, 'RAG', 'LLM retrieval shipped to production']].map(([n, suf, label]) =>
              <SpotCard key={label} className="stat">{n === null ? <strong>{suf}</strong> : <Counter to={n} suffix={suf} />}<span>{label}</span></SpotCard>)}
          </div>
        </div></section>

        <section id="projects"><div className="wrap">
          <h2>Live products</h2>
          <p className="sub">Real applications I built. Click any card to open the live site.</p>
          <div className="pgrid">
            {projects.map((p, i) => <Reveal key={p.name} delay={i * 90}><ProjectCard p={p} /></Reveal>)}
          </div>
          <Reveal>
            <div className="more"><b>+ More automation applications</b><span>Document generators, report builders and data pipelines that replaced manual work.</span></div>
          </Reveal>

          <h3 className="lab">How it works under the hood</h3>
          <Reveal><SpotCard className="proj">
            <h3>AI-based backend service system</h3>
            <div className="tags">{['Python', 'Flask', 'FastAPI', 'Django', 'MongoDB', 'Pandas', 'RAG'].map(t => <span key={t}>{t}</span>)}</div>
            <ul>
              <li>Scalable backend applications and RESTful APIs with MongoDB data services.</li>
              <li>AI/LLM models and RAG solutions in production for intelligent data retrieval.</li>
              <li>Configurable reports and visualisation that adapt to changing data structures.</li>
            </ul>
            <Rag />
          </SpotCard></Reveal>
          <Reveal><SpotCard className="proj">
            <h3>AI Gateway</h3>
            <div className="tags">{['Python', 'LLM security', 'Prompt injection', 'Data protection'].map(t => <span key={t}>{t}</span>)}</div>
            <ul>
              <li>A gateway between applications and the model that inspects each prompt before it goes out.</li>
              <li>Blocks prompt-injection attempts and stops sensitive data from reaching the model.</li>
            </ul>
            <Gateway />
          </SpotCard></Reveal>
        </div></section>

        <section id="experience"><div className="wrap">
          <h2>Experience</h2>
          <p className="sub">Where I’ve worked, newest first.</p>
          <div className="tl">
            {jobs.map(j => <div className="job" key={j.role}><h3>{j.role}</h3><div className="when">{j.when}</div><ul>{j.points.map(p => <li key={p}>{p}</li>)}</ul></div>)}
          </div>
        </div></section>

        <section id="automation"><div className="wrap">
          <h2>Automation</h2>
          <p className="sub">Manual work I turned into code.</p>
          <div className="skills">{automation.map(([a, b]) => <SpotCard key={a} className="skill"><h3>{a}</h3><div className="d">{b}</div></SpotCard>)}</div>
        </div></section>

        <section id="skills"><div className="wrap">
          <h2>Skills</h2>
          <p className="sub">The tools I reach for.</p>
          <div className="skills">{skills.map(([h, list]) => <SpotCard key={h} className="skill"><h3>{h}</h3><p>{list.map(s => <span key={s}>{s}</span>)}</p></SpotCard>)}</div>
          <h3 className="lab">Education</h3>
          <div className="edu">
            <div><b>Bachelor of Commerce (IT), Nehru Arts and Science College, Coimbatore</b><span>2019 – 2022</span></div>
            <div><b>Higher Secondary Certificate, TSA Higher Secondary School, Coimbatore</b><span>2019</span></div>
            <div><b>SSLC, TSA Higher Secondary School, Coimbatore</b><span>2017</span></div>
          </div>
        </div></section>

        <section id="contact"><div className="wrap">
          <h2 className="big">Have a backend or <span className="grad2">AI project</span> in mind?</h2>
          <div className="cta">
            <button className="btn primary" type="button" onClick={() => setContactOpen(true)}>Email me</button>
            <button className="btn" type="button" onClick={copy}>{copied ? 'Copied ✓' : EMAIL}</button>
          </div>
          <p className="muted" style={{ marginTop: 18 }}>Based in Chennai, India. Happy to chat in English or Tamil.</p>
        </div></section>
      </main>

      <footer><div className="wrap foot">
        <span>© 2026 Jaydheep R</span>
      </div></footer>

      {contactOpen && <ContactModal email={EMAIL} onClose={() => setContactOpen(false)} />}
    </>
  )
}
