// Vercel serverless function: receives the contact form and emails it through Gmail.
// Needs two environment variables in Vercel: GMAIL_USER and GMAIL_APP_PASSWORD (optional: CONTACT_TO).
import nodemailer from 'nodemailer'

const clean = v => String(v ?? '').trim()
const oneLine = v => clean(v).replace(/[\r\n]+/g, ' ')
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' })

  let b = req.body
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch { b = {} } }
  b = b || {}

  if (clean(b.website)) return res.status(200).json({ ok: true }) // honeypot: bots fill this hidden field

  const name = oneLine(b.name).slice(0, 120)
  const email = oneLine(b.email).slice(0, 200)
  const phone = oneLine(b.phone).slice(0, 40)
  const topic = oneLine(b.topic).slice(0, 80)
  const message = clean(b.message).slice(0, 5000)

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return res.status(400).json({ ok: false, error: 'invalid' })
  }

  const user = clean(process.env.GMAIL_USER)
  const pass = clean(process.env.GMAIL_APP_PASSWORD).replace(/\s/g, '')
  if (!user || !pass) return res.status(500).json({ ok: false, error: 'not_configured' })

  try {
    const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
    await transport.sendMail({
      from: `Portfolio contact <${user}>`,
      to: clean(process.env.CONTACT_TO) || user,
      replyTo: email,
      subject: `Portfolio enquiry: ${topic} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'not given'}\nTopic: ${topic}\n\n${message}`,
      html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone || 'not given')}<br><b>Topic:</b> ${esc(topic)}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('contact mail failed:', err && err.message)
    return res.status(502).json({ ok: false, error: 'send_failed' })
  }
}
