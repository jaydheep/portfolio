import { useEffect, useRef, useState } from 'react'

const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches

export function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

// Headline "decodes" from random characters into the real text once on load.
export function useScramble(text, delay = 500, duration = 1400) {
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (reduced()) return
    const glyphs = '!<>-_\\/[]{}=+*^?#01'
    let raf, t0
    const id = setTimeout(function run() {
      const tick = now => {
        t0 = t0 || now
        const p = Math.min((now - t0) / duration, 1)
        const keep = Math.floor(p * text.length)
        setOut(text.split('').map((ch, i) => (ch === ' ' || i < keep ? ch : glyphs[Math.floor(Math.random() * glyphs.length)])).join(''))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [text, delay, duration])
  return out
}

export function Counter({ to, suffix = '' }) {
  const [ref, seen] = useInView(0.5)
  const [v, setV] = useState(reduced() ? to : 0)
  useEffect(() => {
    if (!seen || reduced()) return setV(to)
    let raf, t0
    const tick = now => {
      t0 = t0 || now
      const p = Math.min((now - t0) / 1400, 1)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <strong ref={ref}>{v}{suffix}</strong>
}

export function Reveal({ children, delay = 0, className = '' }) {
  const [ref, seen] = useInView(0.12)
  return <div ref={ref} className={'rv ' + (seen ? 'in ' : '') + className} style={{ transitionDelay: delay + 'ms' }}>{children}</div>
}
