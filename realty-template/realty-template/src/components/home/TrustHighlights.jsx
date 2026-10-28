import { clientData } from '../../data/clientData.js'

export default function TrustHighlights() {
  const items = clientData.trustHighlights
  if (!items?.length) return null
  return (
    <section className="trust" aria-label="Business highlights">
      <ul className="container trust-list">
        {items.map((h) => (
          <li key={h.title}><h2>{h.title}</h2><p>{h.description}</p></li>
        ))}
      </ul>
    </section>
  )
}
