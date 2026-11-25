import { useRef } from 'react'

// 3D tilt + cursor spotlight. Whole card is a link to the live app.
export function ProjectCard({ p }) {
  const ref = useRef(null)
  const move = e => {
    const el = ref.current, r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%')
    el.style.transform = `perspective(900px) rotateY(${(px - .5) * 12}deg) rotateX(${(.5 - py) * 12}deg) translateY(-6px)`
  }
  const reset = () => { ref.current.style.transform = '' }
  return (
    <a ref={ref} className="pcard" href={p.url} target="_blank" rel="noopener noreferrer"
       onPointerMove={move} onPointerLeave={reset} style={{ '--h': p.hue }}>
      <span className="glow" />
      <span className="ptag">{p.tag}</span>
      <h3>{p.name}</h3>
      <p>{p.blurb}</p>
      <span className="stack">{p.stack.map(s => <i key={s}>{s}</i>)}</span>
      <span className="visit">Open live app <b>↗</b></span>
    </a>
  )
}

export function SpotCard({ children, className = '' }) {
  const set = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }
  return <div className={'spot ' + className} onPointerMove={set}>{children}</div>
}
