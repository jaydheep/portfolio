import { useRef, useState } from 'react'
import { showcase } from './showcase.js'
import { Reveal } from './hooks.jsx'
import './showcase.css'

const LIMIT = 5 // cards shown in the grid, the rest go behind the "More builds" button

function Card({ p }) {
  return (
    <a className="sc-card" href={p.url} target="_blank" rel="noopener noreferrer" style={{ '--h': p.hue ?? 200 }}>
      <span className="sc-cover" aria-hidden="true"><b className={p.icon ? 'ic' : undefined}>{p.icon || p.name.slice(0, 1)}</b></span>
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
  const [open, setOpen] = useState(false)
  const rail = useRef(null)
  const first = showcase.slice(0, LIMIT), rest = showcase.slice(LIMIT)
  const nudge = d => rail.current && rail.current.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="showcase"><div className="wrap">
      <h2>Showcase</h2>
      <p className="sub">Side builds and experiments, each one a click away.</p>

      {showcase.length > 0 ? (
        <>
          <div className="sc-grid">{first.map((p, i) => <Reveal key={p.name} delay={i * 80}><Card p={p} /></Reveal>)}</div>

          {rest.length > 0 && (
            <>
              <div className="sc-more">
                <button type="button" className="sc-morebtn" aria-expanded={open} aria-controls="sc-rail" onClick={() => setOpen(!open)}>
                  <span>{open ? 'Show less' : 'More builds'}</span>
                  {!open && <em>+{rest.length}</em>}
                  <b aria-hidden="true">↓</b>
                </button>
              </div>

              <div className={'sc-collapse' + (open ? ' open' : '')}>
                <div className="sc-inner" id="sc-rail">
                  <div className="sc-railbar">
                    <span>Swipe or use the arrows</span>
                    <div className="sc-arrows">
                      <button type="button" aria-label="Scroll left" onClick={() => nudge(-1)}>‹</button>
                      <button type="button" aria-label="Scroll right" onClick={() => nudge(1)}>›</button>
                    </div>
                  </div>
                  <div className="sc-rail" ref={rail} tabIndex="0" aria-label="More builds, scrolls sideways">
                    {rest.map(p => <div className="sc-slide" key={p.name}><Card p={p} /></div>)}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
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
