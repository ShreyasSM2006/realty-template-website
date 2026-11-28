import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'
import SmartImage from '../common/SmartImage.jsx'

export default function AboutSection() {
  const { about, business } = clientData
  if (!clientData.features.about || !about.description) return null
  const name = about.representativeName || business.representativeName

  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-visual">
          {about.image ? (
            <div className="about-image-frame gs-image-reveal">
              <SmartImage
                className="about-img"
                src={about.image}
                alt={name ? `Portrait of ${name}` : business.name}
                width="600"
                height="750"
              />
            </div>
          ) : (
            <aside className="about-quote-panel" aria-label="Agency philosophy">
              <span className="about-quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote className="about-quote-text">
                {about.philosophy || business.tagline}
              </blockquote>
              {name && (
                <div className="about-rep-card">
                  <span className="about-rep-name">{name}</span>
                  <span className="about-rep-role">{business.name}</span>
                </div>
              )}
            </aside>
          )}
        </div>

        <div className="about-copy">
          <SectionHeading
            eyebrow={business.name}
            title={about.title || 'About the practice'}
          />
          <p className="about-lead">{about.description}</p>

          {about.image && about.philosophy && (
            <blockquote className="about-philosophy-inline">
              {about.philosophy}
            </blockquote>
          )}

          {about.image && name && (
            <p className="about-rep-name">{name}</p>
          )}

          {about.highlights?.length > 0 && (
            <ul className="check-list">
              {about.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}

          <div>
            <a href="#contact" className="editorial-link">
              Speak with our desk
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
