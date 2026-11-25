import { useEffect, useRef } from 'react'

// 3D point-sphere of "neurons" + orbiting tech labels. Reacts to the cursor.
const LABELS = ['Python', 'FastAPI', 'Flask', 'Django', 'RAG', 'LLM', 'MongoDB', 'Pandas']

export default function Orb() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion:reduce)').matches
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const N = 200, P = []
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; P.push([Math.cos(th) * r, y, Math.sin(th) * r]) }
    let S = 0, raf, rx = 0.3, ry = 0, tx = 0.3, mx = 0, t = 0
    const resize = () => { S = c.clientWidth; c.width = S * dpr; c.height = S * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const rot = ([px, py, pz], ax, ay) => {
      const x1 = px * Math.cos(ay) + pz * Math.sin(ay), z1 = -px * Math.sin(ay) + pz * Math.cos(ay)
      return [x1, py * Math.cos(ax) - z1 * Math.sin(ax), py * Math.sin(ax) + z1 * Math.cos(ax)]
    }
    const mix = k => `${Math.round(139 + (61 - 139) * k)},${Math.round(92 + (255 - 92) * k)},${Math.round(255 + (192 - 255) * k)}`
    const label = (k, front) => {
      const a = t * 0.006 + (k * Math.PI * 2) / LABELS.length
      const [px, py, pz] = rot([Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5], 0.55, 0)
      if ((pz > 0) !== front) return
      const sc = 1 / (1 - pz * 0.3), cx = S / 2, R = S * 0.3
      x.font = `500 ${Math.round(S * 0.034 * sc)}px JetBrains Mono, monospace`
      x.textAlign = 'center'
      x.fillStyle = `rgba(${pz > 0 ? '255,79,216' : '200,190,255'},${0.35 + (pz + 1) * 0.33})`
      x.fillText(LABELS[k], cx + px * R * sc, cx + py * R * sc)
    }
    const draw = () => {
      const cx = S / 2, R = S * 0.3
      x.clearRect(0, 0, S, S)
      const g = x.createRadialGradient(cx, cx, 0, cx, cx, R * 1.5)
      g.addColorStop(0, 'rgba(139,92,255,.30)'); g.addColorStop(.6, 'rgba(255,79,216,.10)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.fillRect(0, 0, S, S)
      if (!still) { t++; ry += 0.004 + mx * 0.012 }
      rx += (tx - rx) * 0.05
      LABELS.forEach((_, k) => label(k, false))
      const q = P.map(p => { const r = rot(p, rx, ry), sc = 1 / (1 - r[2] * 0.35); return { r, sx: cx + r[0] * R * sc, sy: cx + r[1] * R * sc, sc } })
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = q[i].r, b = q[j].r, d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
        if (d < 0.15) { x.strokeStyle = `rgba(${mix((a[2] + b[2]) / 4 + 0.5)},${(1 - d / 0.15) * 0.4 * (0.4 + (a[2] + b[2] + 2) / 4)})`; x.beginPath(); x.moveTo(q[i].sx, q[i].sy); x.lineTo(q[j].sx, q[j].sy); x.stroke() }
      }
      q.forEach(p => { x.fillStyle = `rgba(${mix((p.r[2] + 1) / 2)},${0.35 + (p.r[2] + 1) * 0.32})`; x.beginPath(); x.arc(p.sx, p.sy, (0.9 + (p.r[2] + 1) * 1.2) * (S / 520 + 0.5), 0, 6.3); x.fill() })
      LABELS.forEach((_, k) => label(k, true))
      raf = requestAnimationFrame(draw)
    }
    const move = e => {
      const r = c.getBoundingClientRect()
      mx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (innerWidth / 2)))
      tx = 0.3 + Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (innerHeight / 2))) * 0.5
    }
    resize(); draw()
    addEventListener('resize', resize); addEventListener('pointermove', move)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move) }
  }, [])
  return <canvas ref={ref} className="orb" role="img" aria-label="Rotating 3D network of neurons with orbiting tech names: Python, FastAPI, Flask, Django, RAG, LLM, MongoDB, Pandas" />
}
