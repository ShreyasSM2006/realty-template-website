import { clientData } from '../../data/clientData.js'
import Button from '../common/Button.jsx'
import WhatsAppButton from '../common/WhatsAppButton.jsx'
import SmartImage from '../common/SmartImage.jsx'

export default function Hero() {
  const { hero, business, features } = clientData
  return (
    <section className="hero" aria-labelledby="hero-title">
      <SmartImage className="hero-bg" src={hero.backgroundImage} alt="" eager fetchPriority="high" />
      <div className="hero-overlay" />
      <div className="container hero-content">
        {hero.eyebrow && <p className="eyebrow eyebrow-light">{hero.eyebrow}</p>}
        <h1 id="hero-title">{hero.title}</h1>
        <p className="hero-desc">{hero.description}</p>
        <div className="hero-actions">
          {features.propertyListings && <Button to="/properties">{hero.primaryCtaText || 'Explore Properties'}</Button>}
          <WhatsAppButton variant="light-outline">{hero.secondaryCtaText || 'WhatsApp Us'}</WhatsAppButton>
        </div>
        {business.serviceAreas.length > 0 && (
          <p className="hero-areas">Serving {business.serviceAreas.map((a) => a.name).join(' · ')}</p>
        )}
      </div>
    </section>
  )
}
