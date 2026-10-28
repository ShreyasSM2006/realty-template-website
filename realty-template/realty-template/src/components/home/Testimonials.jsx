import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'

export default function Testimonials() {
  const items = clientData.testimonials
  if (!clientData.features.testimonials || !items?.length) return null
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Client words" title="Testimonials" />
        <ul className="testimonials">
          {items.map((t) => (
            <li key={t.id}>
              <blockquote>{t.review}</blockquote>
              <p className="rep">{t.name}{t.date ? <span className="muted"> · {t.date}</span> : null}</p>
              {Number.isFinite(t.rating) && <p className="small" aria-label={`Rated ${t.rating} out of 5`}>{t.rating}/5</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
