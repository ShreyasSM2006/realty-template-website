import { Home, KeyRound, Compass, LineChart, Building2, Handshake } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'

const ICONS = {
  home: Home,
  key: KeyRound,
  compass: Compass,
  chart: LineChart,
  building: Building2,
  handshake: Handshake,
}

export default function ServicesSection() {
  const services = clientData.services
  if (!services?.length) return null

  return (
    <section className="section section-stone" id="services">
      <div className="container services-layout">
        <div className="services-sticky">
          <SectionHeading
            eyebrow="Advisory"
            title="Services tailored to discerning buyers and owners"
            intro="From initial neighbourhood orientation to final negotiation, every mandate is handled personally."
          />
          <a href="#contact" className="editorial-link">
            Arrange a consultation
          </a>
        </div>

        <ul className="services-list">
          {services.map((s, idx) => {
            const Icon = ICONS[s.icon] || Building2
            return (
              <li key={s.id} className="service-row">
                <span className="service-num tabular" aria-hidden="true">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="service-body">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
                <span className="service-icon-box" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.6} />
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
