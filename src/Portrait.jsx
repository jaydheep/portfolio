import { useEffect, useMemo, useRef } from 'react'

// Photo that cracks and shatters like glass as you scroll down (scroll-linked, so it also re-forms on the way back up).
const IMPACT = [50, 44]
const rng = seed => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

function build() {
  const r = rng(7), C = 6, R = 6, pts = []
  for (let j = 0; j <= R; j++) for (let i = 0; i <= C; i++) {
    const edge = i === 0 || j === 0 || i === C || j === R
    pts.push([(i / C) * 100 + (edge ? 0 : (r() - 0.5) * 11), (j / R) * 100 + (edge ? 0 : (r() - 0.5) * 11)])
  }
  const at = (i, j) => pts[j * (C + 1) + i], shards = []
  const add = tri => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
    if (Math.hypot(cx - 50, cy - 50) > 66) return
    const dx = cx - IMPACT[0], dy = cy - IMPACT[1], d = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) + (r() - 0.5) * 0.7, sp = 160 + r() * 300
    shards.push({
      poly: 'polygon(' + tri.map(p => p[0].toFixed(1) + '% ' + p[1].toFixed(1) + '%').join(',') + ')',
      origin: cx.toFixed(1) + '% ' + cy.toFixed(1) + '%',
      delay: Math.min(d / 75, 1) * 0.4,
      x: Math.cos(ang) * sp, y: Math.sin(ang) * sp + 380 + r() * 520,
      rot: (r() < 0.5 ? -1 : 1) * (35 + r() * 150),
      shine: Math.round(r() * 360),
    })
  }
  for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
    const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1)
    if (r() < 0.5) { add([a, b, c]); add([a, c, d]) } else { add([a, b, d]); add([b, c, d]) }
  }
  const cracks = Array.from({ length: 11 }, (_, k) => {
    const a = (k / 11) * Math.PI * 2 + (r() - 0.5) * 0.4
    let x = IMPACT[0], y = IMPACT[1], d = 'M' + x + ' ' + y
    for (let s = 0; s < 6; s++) { const len = 9 + r() * 10; x += Math.cos(a + (r() - 0.5) * 0.7) * len; y += Math.sin(a + (r() - 0.5) * 0.7) * len; d += 'L' + x.toFixed(1) + ' ' + y.toFixed(1) }
    return d
  })
  return { shards, cracks }
}

export default function Portrait({ src }) {
  const { shards, cracks } = useMemo(build, [])
  const box = useRef(null), base = useRef(null), wrap = useRef(null), crack = useRef(null), plate = useRef(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const kids = [...wrap.current.children]
    let raf = 0
    const update = () => {
      raf = 0
      const p = Math.max(0, Math.min(1, scrollY / (innerHeight * 0.8)))
      const broken = p > 0.06, live = broken && p < 1
      box.current.classList.toggle('breaking', live)
      base.current.style.visibility = broken ? 'hidden' : 'visible'
      wrap.current.style.visibility = live ? 'visible' : 'hidden'
      crack.current.style.opacity = broken ? 0 : Math.min(p / 0.05, 1)
      crack.current.style.setProperty('--o', 1 - Math.min(p / 0.05, 1))
      plate.current.style.opacity = Math.max(0, 1 - p * 5)
      box.current.style.setProperty('--g', Math.min(Math.max((p - 0.06) * 10, 0), 1))
      if (!live) return
      kids.forEach((el, i) => {
        const s = shards[i]
        const q = Math.max(0, Math.min(1, (p - 0.06 - s.delay) / 0.5)), e = q * q
        el.style.transform = `translate3d(${s.x * e}px,${s.y * e}px,0) rotate(${s.rot * e}deg) scale(${1 - 0.3 * e})`
        el.style.opacity = 1 - Math.max(0, (q - 0.55) / 0.45)
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll) }
  }, [shards])

  return (
    <div className="portrait" ref={box}>
      <div className="intro">
        <span className="ring" aria-hidden="true" />
        <img ref={base} className="photo" src={src} alt="Jaydheep R" width="720" height="720" />
        <svg ref={crack} className="cracks" viewBox="0 0 100 100" aria-hidden="true">
          {cracks.map((d, i) => <path key={i} d={d} pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 'var(--o,1)' }} />)}
        </svg>
        <div className="shards" ref={wrap} aria-hidden="true">
          {shards.map((s, i) => (
            <div key={i} className="shard" style={{ clipPath: s.poly, WebkitClipPath: s.poly, transformOrigin: s.origin, backgroundImage: `url(${src})` }}>
              <i style={{ background: `linear-gradient(${s.shine}deg,rgba(255,255,255,.55),rgba(255,255,255,0) 45%,rgba(140,120,255,.35))` }} />
            </div>
          ))}
        </div>
      </div>
      <span className="plate" ref={plate}><b>Jaydheep R</b>AI Developer</span>
    </div>
  )
}
