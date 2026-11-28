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
          {business.address && (
            <p className="footer-text small">{business.address}</p>
          )}
          {socials.length > 0 && (
            <ul className="social-list">
              {socials.map((s) => {
                const Icon = ICONS[s.platform] || LinkIcon
                return (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${business.name} on ${s.platform}`}
                    >
                      <Icon size={17} />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="footer-title">Navigation</h2>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            {features.propertyListings && <li><Link to="/properties">Residences</Link></li>}
            {features.about && <li><Link to="/#about">Philosophy</Link></li>}
            {clientData.services.length > 0 && <li><Link to="/#services">Advisory</Link></li>}
            <li><Link to="/#contact">Contact</Link></li>
          </ul>
        </nav>

        {business.serviceAreas.length > 0 && (
          <nav aria-label="Service localities">
            <h2 className="footer-title">Localities</h2>
            <ul className="footer-links-list">
              {business.serviceAreas.map((area) => (
                <li key={area.name}>
                  <Link
                    to={
                      features.propertyListings
                        ? `/properties?locality=${encodeURIComponent(area.name)}`
                        : '/#contact'
                    }
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div>
          <h2 className="footer-title">Private Desk</h2>
          <ul className="footer-links-list">
            {tel && (
              <li>
                <a href={tel}>{business.phone}</a>
              </li>
            )}
            {business.email && (
              <li>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </li>
            )}
            {business.openingHours && <li>{business.openingHours}</li>}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.legalName || business.name}. All rights reserved.
        </span>
        {(footerLinks.privacyUrl || footerLinks.disclaimerUrl) && (
          <div className="footer-legal">
            {footerLinks.privacyUrl && (
              <a href={footerLinks.privacyUrl} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            )}
            {footerLinks.disclaimerUrl && (
              <a href={footerLinks.disclaimerUrl} target="_blank" rel="noopener noreferrer">
                Disclaimer
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
