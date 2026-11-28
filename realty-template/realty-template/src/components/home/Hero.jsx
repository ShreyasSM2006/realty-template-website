import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import Button from '../common/Button.jsx'
import WhatsAppButton from '../common/WhatsAppButton.jsx'
import SmartImage from '../common/SmartImage.jsx'

export default function Hero() {
  const { hero, business, features } = clientData

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media-wrap" aria-hidden="true">
        <SmartImage
          className="hero-bg"
          src={hero.backgroundImage}
          alt=""
          eager
          fetchPriority="high"
        />
      </div>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="container hero-content">
        <div className="hero-grid">
          <div>
            {hero.eyebrow && (
              <p className="eyebrow eyebrow-light hero-anim-eyebrow">
                {hero.eyebrow}
              </p>
            )}
            <div className="hero-title-wrap">
              <h1 id="hero-title" className="hero-anim-title">
                {hero.title}
              </h1>
            </div>
          </div>

          <div className="hero-aside hero-anim-aside">
            <p className="hero-desc">{hero.description}</p>
            <div className="hero-actions">
              {features.propertyListings && (
                <Button to="/properties" variant="light">
                  {hero.primaryCtaText || 'Explore Properties'}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Button>
              )}
              <WhatsAppButton variant="light-outline">
                {hero.secondaryCtaText || 'WhatsApp Us'}
              </WhatsAppButton>
            </div>
          </div>
        </div>

        <div className="hero-footer-strip hero-anim-strip">
          {business.serviceAreas.length > 0 ? (
            <p className="hero-areas">
              <span className="hero-areas-label">Enclaves</span>
              {business.serviceAreas.map((a) => (
                <span key={a.name}>{a.name}</span>
              ))}
            </p>
          ) : (
            <span />
          )}

          <a href="#trust-highlights" className="hero-scroll-cue">
            <span>Scroll to discover</span>
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
