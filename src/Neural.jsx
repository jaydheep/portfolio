import { useEffect, useRef } from 'react'

// Particle network that reacts to the cursor: the hero's one big moment.
export default function Neural() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion:reduce)').matches
    let w, h, raf, pts = [], m = { x: -999, y: -999 }
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(110, (w * h) / 13000))
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }))
    }
    const draw = () => {
      x.clearRect(0, 0, w, h)
      for (const p of pts) {
        if (!still) { p.x += p.vx; p.y += p.vy }
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy)
        if (d < 120 && !still) { p.x += dx / d * 1.6; p.y += dy / d * 1.6 }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 130) { x.strokeStyle = `rgba(110,160,255,${(1 - d / 130) * .35})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke() }
        }
        const dm = Math.hypot(a.x - m.x, a.y - m.y)
        if (dm < 170) { x.strokeStyle = `rgba(45,226,200,${(1 - dm / 170) * .7})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(m.x, m.y); x.stroke() }
        x.fillStyle = dm < 170 ? '#2de2c8' : '#8aa8ff'; x.beginPath(); x.arc(a.x, a.y, 1.8, 0, 6.3); x.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    const move = e => { const r = c.getBoundingClientRect(); m = { x: e.clientX - r.left, y: e.clientY - r.top } }
    const leave = () => (m = { x: -999, y: -999 })
    resize(); draw()
    addEventListener('resize', resize); addEventListener('pointermove', move); addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move); removeEventListener('pointerleave', leave) }
  }, [])
  return <canvas ref={ref} className="neural" aria-hidden="true" />
}
