import { useEffect, useRef } from 'react'
import src from './portraitData.js'
import './portrait.css'

// Scroll-linked "dust" disintegration: the photo is cut into tiles that peel away in a diagonal wave
// and drift off as glowing particles. Scroll back up and the photo re-forms.
const G = 22, START = 0.015
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const rng = seed => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

export default function Portrait() {
  const box = useRef(null), base = useRef(null), cv = useRef(null), ring = useRef(null), plate = useRef(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const c = cv.current, x = c.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2)
    const img = new Image()
    let S = 0, mask = null, tiles = [], raf = 0, loaded = false

    const setup = () => {
      S = box.current.clientWidth
      if (!S || !loaded) return
      c.width = c.height = Math.round(S * 3 * dpr)
      mask = document.createElement('canvas')
      mask.width = mask.height = Math.round(S * dpr)
      const m = mask.getContext('2d')
      m.beginPath(); m.arc(mask.width / 2, mask.height / 2, mask.width / 2, 0, Math.PI * 2); m.clip()
      m.drawImage(img, 0, 0, mask.width, mask.height)
      const r = rng(11), t = S / G
      tiles = []
      for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
        const cx = (i + 0.5) * t, cy = (j + 0.5) * t
        if (Math.hypot(cx - S / 2, cy - S / 2) > S / 2 + t * 0.7) continue
        tiles.push({
          i, j, cx, cy,
          delay: ((i + (G - j)) / (2 * G)) * 0.5 + r() * 0.1,
          ang: -Math.PI / 4 + (r() - 0.5) * 1.6,
          dist: (70 + r() * 230) * (S / 246),
          spin: (r() - 0.5) * 5,
          warm: r() < 0.45,
        })
      }
    }

    const draw = () => {
      raf = 0
      const p = clamp(scrollY / (innerHeight * 0.8))
      const dust = p > START && p < 1 && !!mask
      base.current.style.visibility = p > START && mask ? 'hidden' : 'visible'
      c.style.visibility = dust ? 'visible' : 'hidden'
      ring.current.style.opacity = 1 - clamp(p * 6)
      plate.current.style.opacity = 1 - clamp(p * 5)
      if (!dust) return
      x.setTransform(1, 0, 0, 1, 0, 0)
      x.clearRect(0, 0, c.width, c.height)
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      const t = S / G, k = S / 246
      for (const o of tiles) {
        const q = clamp((p - START - o.delay) / 0.42), e = q * q
        const px = S + o.cx + Math.cos(o.ang) * o.dist * e
        const py = S + o.cy + Math.sin(o.ang) * o.dist * e - 40 * k * e
        const sc = 1 - 0.85 * e, size = t * sc + 0.6
        x.save()
        x.translate(px, py)
        x.rotate(o.spin * e)
        x.globalAlpha = 1 - Math.pow(q, 1.4)
        x.drawImage(mask, o.i * t * dpr, o.j * t * dpr, t * dpr, t * dpr, -size / 2, -size / 2, size, size)
        if (q > 0) {
          x.globalCompositeOperation = 'lighter'
          x.globalAlpha = Math.sin(q * Math.PI) * 0.9
          x.fillStyle = o.warm ? '#ff4fd8' : '#3dffc0'
          x.fillRect(-size / 2, -size / 2, size, size)
        }
        x.restore()
      }
    }

    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const onResize = () => { setup(); schedule() }
    img.onload = () => { loaded = true; setup(); schedule() }
    img.src = src
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', schedule); removeEventListener('resize', onResize) }
  }, [])

  return (
    <div className="portrait" ref={box}>
      <div className="intro">
        <span className="ring" ref={ring} aria-hidden="true" />
        <img ref={base} className="photo" src={src} alt="Jaydheep R" width="720" height="720" />
        <canvas ref={cv} className="dust" aria-hidden="true" />
      </div>
      <span className="plate" ref={plate}><b>Jaydheep R</b>AI Developer</span>
    </div>
  )
}
