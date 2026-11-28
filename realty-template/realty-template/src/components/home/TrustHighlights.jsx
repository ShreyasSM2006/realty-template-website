import { clientData } from '../../data/clientData.js'

export default function TrustHighlights() {
  const items = clientData.trustHighlights
  if (!items?.length) return null

  return (
    <section
      id="trust-highlights"
      className="trust"
      aria-label="Practice highlights"
    >
      <ul className="container trust-list">
        {items.map((item, idx) => (
          <li key={item.title} className="trust-item">
            <span className="trust-index tabular" aria-hidden="true">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
