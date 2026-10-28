import { Home, KeyRound, Compass, LineChart, Building2, Handshake } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'

const ICONS = { home: Home, key: KeyRound, compass: Compass, chart: LineChart, building: Building2, handshake: Handshake }

export default function ServicesSection() {
  const services = clientData.services
  if (!services?.length) return null
  return (
    <section className="section section-alt" id="services">
      <div className="container">
        <SectionHeading eyebrow="What we do" title="Services" />
        <ul className="services-list">
          {services.map((s) => {
            const Icon = ICONS[s.icon] || Building2
            return (
              <li key={s.id}>
                <Icon size={26} aria-hidden="true" />
                <h3>{s.title}</h3>
                <p className="muted">{s.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
