import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'
import SmartImage from '../common/SmartImage.jsx'

export default function ServiceAreas() {
  const areas = clientData.business.serviceAreas
  if (!clientData.features.serviceAreas || !areas?.length) return null

  return (
    <section className="section section-stone" id="areas">
      <div className="container">
        <div className="section-split-head">
          <SectionHeading
            eyebrow="Neighbourhoods"
            title="Areas we serve"
            intro="Deep micro-market familiarity across established and emerging enclaves."
          />
        </div>

        <ul className="areas-grid">
          {areas.map((area, idx) => (
            <li key={area.name}>
              <Link
                to={`/properties?locality=${encodeURIComponent(area.name)}`}
                className="area-card"
              >
                <div className="area-media">
                  {area.image ? (
                    <SmartImage
                      src={area.image}
                      alt={`${area.name} neighbourhood`}
                      width="480"
                      height="360"
                    />
                  ) : (
                    <div className="area-plate" aria-hidden="true">
                      <span className="area-plate-index tabular">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="area-plate-label">Micro-market</span>
                    </div>
                  )}
                </div>

                <div className="area-body">
                  <span className="area-name">{area.name}</span>
                  {area.description && (
                    <p className="area-desc">{area.description}</p>
                  )}
                  <span className="area-cta">
                    View listings <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
