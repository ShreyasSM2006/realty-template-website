import { useState } from 'react'
import { clientData } from '../../data/clientData.js'
import { whatsappUrl } from '../../utils/whatsapp.js'
import Button from '../common/Button.jsx'

const PHONE_RE = /^\+?[\d\s-]{10,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEnquiry(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!PHONE_RE.test(v.phone.trim())) e.phone = 'Enter a valid phone number (10–15 digits).'
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address or leave it blank.'
  if (v.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
  return e
}

/** Enquiry form that composes a WhatsApp message. Nothing is stored or sent by this site. */
export default function PropertyEnquiry({ defaultProperty = '' }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', property: defaultProperty, message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | opened | unavailable
  const properties = clientData.properties

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const found = validateEnquiry(values)
    setErrors(found)
    if (Object.keys(found).length) return
    const lines = [
      `Hello ${clientData.business.name},`,
      values.property && `I'm interested in: ${values.property}`,
      values.message.trim(),
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.email.trim() && `Email: ${values.email.trim()}`,
    ].filter(Boolean)
    const url = whatsappUrl(lines.join('\n'))
    if (!url) return setStatus('unavailable')
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('opened')
  }

  const field = (id, label, props = {}, Tag = 'input') => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} value={values[id]} onChange={set(id)} aria-invalid={Boolean(errors[id])} aria-describedby={errors[id] ? `${id}-err` : undefined} {...props} />
      {errors[id] && <p className="error" id={`${id}-err`}>{errors[id]}</p>}
    </div>
  )

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      {field('name', 'Your name *', { autoComplete: 'name', required: true })}
      {field('phone', 'Phone number *', { type: 'tel', autoComplete: 'tel', required: true })}
      {field('email', 'Email (optional)', { type: 'email', autoComplete: 'email' })}
      <div className="field">
        <label htmlFor="property">Interested property (optional)</label>
        <select id="property" value={values.property} onChange={set('property')}>
          <option value="">No specific property</option>
          {properties.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
        </select>
      </div>
      {field('message', 'Message *', { rows: 4, required: true }, 'textarea')}
      <p className="muted small">Submitting opens WhatsApp with your details pre-filled. Your enquiry is only sent once you press Send in WhatsApp. This website does not store enquiries.</p>
      <Button type="submit">Continue in WhatsApp</Button>
      <div aria-live="polite">
        {status === 'opened' && <p className="notice">WhatsApp should have opened in a new tab. Nothing has been sent yet. Please send the pre-filled message there.</p>}
        {status === 'unavailable' && <p className="notice notice-error">WhatsApp is not configured for this business. Please call instead.</p>}
      </div>
    </form>
  )
}
