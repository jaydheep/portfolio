import { useEffect, useRef, useState } from 'react'
import portrait from './portraitData.js'
import './contact.css'

// The form posts to /api/contact (a Vercel function, see api/contact.js) which emails you through Gmail.
// The visitor never leaves the site.
const TOPICS = ['AI / LLM project', 'Backend / API', 'Automation', 'Job opportunity', 'Something else']

export default function ContactModal({ onClose, email }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', topic: TOPICS[0], message: '', website: '' })
  const [err, setErr] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | fail
  const [failCode, setFailCode] = useState('')
  const dlg = useRef(null), first = useRef(null), closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => first.current && first.current.focus(), 80)
    const key = e => {
      if (e.key === 'Escape') return closeRef.current()
      if (e.key !== 'Tab') return
      const els = [...dlg.current.querySelectorAll('button,input:not([tabindex="-1"]),textarea,a[href]')].filter(el => !el.disabled)
      if (!els.length) return
      const a = els[0], z = els[els.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    addEventListener('keydown', key)
    return () => { clearTimeout(t); removeEventListener('keydown', key); document.body.style.overflow = ''; opener && opener.focus && opener.focus() }
  }, [])

  const set = k => e => { setF({ ...f, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: '' }) }

  const validate = () => {
    const e = {}
    if (f.name.trim().length < 2) e.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email so I can reply'
    if (f.message.trim().length < 10) e.message = 'Tell me a little more (at least 10 characters)'
    setErr(e)
    return !Object.keys(e).length
  }

  const submit = async ev => {
    ev.preventDefault()
    if (!validate()) return
    setState('sending')
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 20000) // never hang on "Sending" forever
    let code = ''
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), topic: f.topic, message: f.message.trim(), website: f.website }),
        signal: ctl.signal,
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) { clearTimeout(timer); return setState('done') }
      code = data.error ? data.error + (data.code ? ' ' + data.code : '') : 'http_' + res.status
    } catch (e) { code = e && e.name === 'AbortError' ? 'timeout' : 'network' }
    clearTimeout(timer)
    setFailCode(code)
    setState('fail')
  }

  return (
    <div className="cm-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cm" role="dialog" aria-modal="true" aria-labelledby="cm-title" ref={dlg}>
        <button className="cm-x" type="button" onClick={onClose} aria-label="Close">×</button>

        {state === 'done' ? (
          <div className="cm-done" role="status">
            <svg viewBox="0 0 80 80" width="96" height="96" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle className="cm-c" cx="40" cy="40" r="34" pathLength="1" stroke="var(--m)" />
              <path className="cm-t" d="M26 41l10 10 19-22" pathLength="1" stroke="var(--m)" />
            </svg>
            <h3 id="cm-title">Message sent</h3>
            <p>Thanks {f.name.trim().split(' ')[0]}! I’ll reply to {f.email.trim()} soon.</p>
            <button className="btn primary" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form noValidate onSubmit={submit}>
            <div className="cm-head">
              <span className="cm-av"><img src={portrait} alt="" width="54" height="54" /></span>
              <div>
                <h3 id="cm-title">Let’s build something</h3>
                <p><i />Open to work · Chennai</p>
              </div>
            </div>

            <div className="cm-grid">
              <div className="cm-field">
                <label htmlFor="cm-name">Your name</label>
                <input id="cm-name" ref={first} value={f.name} onChange={set('name')} autoComplete="name" placeholder="Priya Sharma" aria-invalid={!!err.name} aria-describedby={err.name ? 'cm-name-e' : undefined} />
                {err.name && <span className="cm-err" id="cm-name-e">{err.name}</span>}
              </div>
              <div className="cm-field">
                <label htmlFor="cm-email">Your email</label>
                <input id="cm-email" type="email" value={f.email} onChange={set('email')} autoComplete="email" placeholder="you@company.com" aria-invalid={!!err.email} aria-describedby={err.email ? 'cm-email-e' : undefined} />
                {err.email && <span className="cm-err" id="cm-email-e">{err.email}</span>}
              </div>
            </div>

            <div className="cm-field">
              <label htmlFor="cm-phone">Phone <em>(optional)</em></label>
              <input id="cm-phone" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91 98765 43210" />
            </div>

            <div className="cm-field">
              <span className="cm-lab" id="cm-topic">What is this about?</span>
              <div className="cm-chips" role="group" aria-labelledby="cm-topic">
                {TOPICS.map(t => <button key={t} type="button" aria-pressed={f.topic === t} onClick={() => setF({ ...f, topic: t })}>{t}</button>)}
              </div>
            </div>

            <div className="cm-field">
              <label htmlFor="cm-msg">Your message</label>
              <textarea id="cm-msg" rows="4" value={f.message} onChange={set('message')} placeholder="Tell me about the project, the problem and the timeline." aria-invalid={!!err.message} aria-describedby={err.message ? 'cm-msg-e' : undefined} />
              {err.message && <span className="cm-err" id="cm-msg-e">{err.message}</span>}
            </div>

            <input className="cm-hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} name="website" />

            {state === 'fail' && (
              <p className="cm-fail" role="alert">
                Couldn’t send that right now. Please try again in a moment, or write to {email}.
                <small style={{ display: 'block', marginTop: 6, opacity: 0.7, fontFamily: 'var(--mono)', fontSize: '.75rem' }}>Error code: {failCode}</small>
              </p>
            )}

            <button className="cm-send" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? <><span className="cm-spin" />Sending</> : <>Send message
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg></>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
