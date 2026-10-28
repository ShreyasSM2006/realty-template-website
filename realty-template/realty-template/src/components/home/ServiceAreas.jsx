import { Link } from 'react-router-dom'
import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'
import SmartImage from '../common/SmartImage.jsx'

export default function ServiceAreas() {
  const areas = clientData.business.serviceAreas
  if (!clientData.features.serviceAreas || !areas?.length) return null
  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHeading eyebrow="Where we work" title="Areas we serve" />
        <ul className="areas-list">
          {areas.map((a) => (
            <li key={a.name}>
              <Link to={`/properties?locality=${encodeURIComponent(a.name)}`} className="area-link">
                {a.image && <SmartImage src={a.image} alt="" width="400" height="260" />}
                <span className="area-name">{a.name}</span>
                {a.description && <span className="muted small">{a.description}</span>}
                <span className="area-cta">View listings →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
