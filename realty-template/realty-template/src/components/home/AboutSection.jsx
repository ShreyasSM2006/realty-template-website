import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'
import SmartImage from '../common/SmartImage.jsx'

export default function AboutSection() {
  const { about, business } = clientData
  if (!clientData.features.about || !about.description) return null
  const name = about.representativeName || business.representativeName
  return (
    <section className="section" id="about">
      <div className={`container about ${about.image ? 'has-image' : ''}`}>
        {about.image && <SmartImage className="about-img" src={about.image} alt={name ? `Portrait of ${name}` : ''} width="600" height="720" />}
        <div>
          <SectionHeading eyebrow={business.name} title={about.title || 'About us'} />
          <p>{about.description}</p>
          {about.philosophy && <p className="muted">{about.philosophy}</p>}
          {name && <p className="rep">{name}</p>}
          {about.highlights?.length > 0 && <ul className="check-list">{about.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
        </div>
      </div>
    </section>
  )
}
