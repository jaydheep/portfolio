import { useRef } from 'react'

// Small animated "poster" for each product.
function Visual({ kind }) {
  if (kind === 'review') return <div className="vz vz-review">{[70, 45, 90, 60, 82, 52].map((h, i) => <i key={i} style={{ '--h': h + '%', '--d': i * 0.18 + 's' }} />)}<b>★★★★★</b></div>
  if (kind === 'visual') return <div className="vz vz-visual">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
  if (kind === 'gateway') return (
    <div className="vz vz-gw">
      <svg viewBox="0 0 100 100" width="104" height="104" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 8 86 22v28c0 22-16 38-36 44C30 88 14 72 14 50V22Z" stroke="var(--m)" /><path d="m34 52 12 12 22-26" stroke="var(--m)" />
      </svg><span className="scan" />
    </div>)
  return (
    <div className="vz vz-dk">
      <svg viewBox="0 0 240 110" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {[[30, 55, 90, 25], [30, 55, 90, 85], [90, 25, 160, 55], [90, 85, 160, 55], [160, 55, 215, 30], [160, 55, 215, 82]].map((l, i) => <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="rgba(160,150,255,.45)" />)}
        {[[30, 55], [90, 25], [90, 85], [160, 55], [215, 30], [215, 82]].map((n, i) => <circle key={i} cx={n[0]} cy={n[1]} r="7" style={{ animationDelay: i * 0.3 + 's' }} />)}
      </svg>
    </div>)
}

export function ProjectCard({ p }) {
  const ref = useRef(null)
  const move = e => {
    const el = ref.current, r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%')
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateY(-6px)`
  }
  return (
    <a ref={ref} className="pcard" href={p.url} target="_blank" rel="noopener noreferrer"
       onPointerMove={move} onPointerLeave={() => { ref.current.style.transform = '' }} style={{ '--h': p.hue }}>
      <span className="glow" />
      <Visual kind={p.kind} />
      <span className="live"><i />Live</span>
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
