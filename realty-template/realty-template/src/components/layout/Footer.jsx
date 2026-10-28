import { Link } from 'react-router-dom'
import { Instagram, Facebook, Linkedin, Youtube, Link as LinkIcon } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { telUrl } from '../../utils/whatsapp.js'
import { BrandMark } from './Navbar.jsx'

const { business, socialLinks, footerLinks, features } = clientData
const ICONS = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin, youtube: Youtube }

export default function Footer() {
  const socials = socialLinks.filter((s) => /^https?:\/\//.test(s.url || ''))
  const tel = telUrl()
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <BrandMark />
          <p className="footer-text">{business.tagline}</p>
          {socials.length > 0 && (
            <ul className="social-list">
              {socials.map((s) => {
                const Icon = ICONS[s.platform] || LinkIcon
                return (
                  <li key={s.platform}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${business.name} on ${s.platform}`}><Icon size={20} /></a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <nav aria-label="Footer">
          <h2 className="footer-title">Explore</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            {features.propertyListings && <li><Link to="/properties">Properties</Link></li>}
            {features.about && <li><Link to="/#about">About</Link></li>}
            <li><Link to="/#contact">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="footer-title">Contact</h2>
          <ul>
            {tel && <li><a href={tel}>{business.phone}</a></li>}
            {business.email && <li><a href={`mailto:${business.email}`}>{business.email}</a></li>}
            {business.serviceAreas.length > 0 && <li>Serving {business.serviceAreas.map((a) => a.name).join(', ')}</li>}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {business.legalName || business.name}</span>
        {footerLinks.privacyUrl && <a href={footerLinks.privacyUrl} target="_blank" rel="noopener noreferrer">Privacy policy</a>}
        {footerLinks.disclaimerUrl && <a href={footerLinks.disclaimerUrl} target="_blank" rel="noopener noreferrer">Disclaimer</a>}
      </div>
    </footer>
  )
}
