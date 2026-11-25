import { showcase } from './showcase.js'
import { Reveal } from './hooks.jsx'
import './showcase.css'

function Card({ p }) {
  return (
    <a className="sc-card" href={p.url} target="_blank" rel="noopener noreferrer" style={{ '--h': p.hue ?? 200 }}>
      <span className="sc-cover" aria-hidden="true"><b>{p.name.slice(0, 1)}</b></span>
      <span className="sc-body">
        <h3>{p.name}</h3>
        {p.blurb && <p>{p.blurb}</p>}
        {p.stack && <span className="stack" style={{ padding: 0 }}>{p.stack.map(s => <i key={s}>{s}</i>)}</span>}
        <span className="visit" style={{ padding: 0 }}>Open <b>↗</b></span>
      </span>
    </a>
  )
}

export default function Showcase() {
  return (
    <section id="showcase"><div className="wrap">
      <h2>Showcase</h2>
      <p className="sub">Side builds and experiments, each one a click away.</p>

      {showcase.length > 0 ? (
        <div className="sc-grid">{showcase.map((p, i) => <Reveal key={p.name} delay={i * 80}><Card p={p} /></Reveal>)}</div>
      ) : (
        <>
          <div className="sc-grid" aria-hidden="true">
            {[0, 1, 2].map(i => (
              <div className="sc-slot" key={i} style={{ '--d': i * 0.9 + 's' }}>
                <div className="sc-ph"><span>+</span></div>
                <div className="sc-lines"><i /><i /></div>
              </div>
            ))}
          </div>
          <p className="sc-note"><i />Empty for now. New builds will show up here as soon as they are ready.</p>
        </>
      )}
    </div></section>
  )
}
