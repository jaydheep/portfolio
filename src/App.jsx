import { useState, useEffect } from 'react'
import Neural from './Neural.jsx'
import { ProjectCard, SpotCard } from './Cards.jsx'
import { Rag, Gateway, Typed } from './Demos.jsx'
import { projects, automation, skills, jobs } from './data.js'

const K = t => <span className="k">{t}</span>
const S = t => <span className="s">{t}</span>
const json = [
  '{',
  <>  {K('"status"')}: <span className="ok">200</span>,</>,
  <>  {K('"name"')}: {S('"Jaydheep R"')},</>,
  <>  {K('"role"')}: {S('"AI Developer"')},</>,
  <>  {K('"location"')}: {S('"Chennai, India"')},</>,
  <>  {K('"experience_years"')}: 4,</>,
  <>  {K('"shipped"')}: [{S('"ReviewGenX"')}, {S('"VisualGenX"')}, {S('"AI Gateway"')}, {S('"DK Platform"')}],</>,
  <>  {K('"ai"')}: [{S('"LLM integration"')}, {S('"RAG"')}, {S('"guardrails"')}],</>,
  <>  {K('"open_to_work"')}: true</>,
  '}',
]

const nav = ['about', 'experience', 'projects', 'automation', 'skills', 'contact']

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme) }, [theme])

  return (
    <>
      <header className="nav"><div className="wrap bar">
        <a className="logo" href="#top">Jaydheep R</a>
        <nav aria-label="Main"><ul>{nav.map(n => <li key={n}><a href={'#' + n}>{n[0].toUpperCase() + n.slice(1)}</a></li>)}</ul></nav>
        <button className="toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Switch colour theme">{theme === 'dark' ? 'Light' : 'Dark'}</button>
      </div></header>

      <main id="top">
        <div className="hero">
          <Neural />
          <div className="wrap herogrid">
            <div>
              <h1>Jaydheep R<span className="grad">builds backends that think.</span></h1>
              <p className="lead">AI developer in Chennai with 4+ years of Python experience. I ship LLM products, RAG features, an AI gateway that keeps prompts safe, and automation that replaces manual work.</p>
              <div className="cta">
                <a className="btn primary" href="#projects">See live products</a>
                <a className="btn" href="/Jaydheep_Professional_Resume.pdf" download>Download resume</a>
              </div>
            </div>
            <div className="term" aria-label="Sample API response describing Jaydheep">
              <div className="tbar"><i /><i /><i /><b>GET</b> /developers/jaydheep</div>
              <Typed lines={json} />
            </div>
          </div>
        </div>

        <section id="about"><div className="wrap about">
          <div>
            <h2>Backend first, AI where it helps.</h2>
            <p className="sub">I design logic-heavy services, REST APIs and background pipelines on MongoDB, and plug LLMs and retrieval (RAG) into them so teams get answers from their own data.</p>
            <p className="muted">I like work where the data keeps changing shape: configurable reports, XML-to-PDF documents and Pandas clean-up of large datasets. I care about performance and reliability as much as features.</p>
          </div>
          <div className="stats">
            {[['4+', 'years building backend and automation'], ['4', 'live AI products and platforms'], ['RAG', 'LLM retrieval shipped to production'], ['3', 'languages: English, Tamil, Telugu']].map(([a, b]) =>
              <SpotCard key={b} className="stat"><strong>{a}</strong><span>{b}</span></SpotCard>)}
          </div>
        </div></section>

        <section id="experience"><div className="wrap">
          <h2>Experience</h2>
          <p className="sub">Where I’ve worked, newest first.</p>
          <div className="tl">
            {jobs.map(j => <div className="job" key={j.role}><h3>{j.role}</h3><div className="when">{j.when}</div><ul>{j.points.map(p => <li key={p}>{p}</li>)}</ul></div>)}
          </div>
        </div></section>

        <section id="projects"><div className="wrap">
          <h2>Live products</h2>
          <p className="sub">Real applications I built. Click any card to open the live site.</p>
          <div className="pgrid">{projects.map(p => <ProjectCard key={p.name} p={p} />)}</div>

          <SpotCard className="proj">
            <h3>AI-based backend service system</h3>
            <div className="tags">{['Python', 'Flask', 'FastAPI', 'Django', 'MongoDB', 'Pandas', 'RAG'].map(t => <span key={t}>{t}</span>)}</div>
            <ul>
              <li>Scalable backend applications and RESTful APIs with MongoDB data services.</li>
              <li>AI/LLM models and RAG solutions in production for intelligent data retrieval.</li>
              <li>Configurable reports and visualisation that adapt to changing data structures.</li>
            </ul>
            <Rag />
          </SpotCard>

          <SpotCard className="proj">
            <h3>AI Gateway</h3>
            <div className="tags">{['Python', 'LLM security', 'Prompt injection', 'Data protection'].map(t => <span key={t}>{t}</span>)}</div>
            <ul>
              <li>A gateway between applications and the model that inspects each prompt before it goes out.</li>
              <li>Blocks prompt-injection attempts and stops sensitive data from reaching the model.</li>
            </ul>
            <Gateway />
          </SpotCard>
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
        </div></section>

        <section id="education"><div className="wrap">
          <h2>Education</h2>
          <div className="edu">
            <div><b>Bachelor of Commerce (IT), Nehru Arts and Science College, Coimbatore</b><span>2019 – 2022</span></div>
            <div><b>Higher Secondary Certificate, TSA Higher Secondary School, Coimbatore</b><span>2019</span></div>
            <div><b>SSLC, TSA Higher Secondary School, Coimbatore</b><span>2017</span></div>
          </div>
        </div></section>

        <section id="contact"><div className="wrap">
          <h2 className="big">Have a backend or AI project in mind?</h2>
          <a className="mail" href="mailto:jaydheeprsk@gmail.com">jaydheeprsk@gmail.com</a>
          <p className="muted" style={{ marginTop: 14 }}>Based in Chennai, India. Happy to chat in English, Tamil or Telugu.</p>
        </div></section>
      </main>
      <footer><div className="wrap">© 2026 Jaydheep R</div></footer>
    </>
  )
}
