import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { whatsappUrl, generalEnquiryMessage } from '../../utils/whatsapp.js'
import Button from '../common/Button.jsx'
import SmartImage from '../common/SmartImage.jsx'

const { business, features } = clientData

const LINKS = [
  { label: 'Home', to: '/' },
  features.propertyListings && { label: 'Properties', to: '/properties' },
  features.about && { label: 'About', to: '/#about' },
  clientData.services.length > 0 && { label: 'Services', to: '/#services' },
  { label: 'Contact', to: '/#contact' },
].filter(Boolean)

export function BrandMark() {
  return (
    <Link to="/" className="brand" aria-label={`${business.name} home`}>
      {business.logo ? <SmartImage src={business.logo} alt="" className="brand-logo" eager /> : null}
      <span className="brand-name">{business.name}</span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef(null)
  const wa = whatsappUrl(generalEnquiryMessage())

  useEffect(() => setOpen(false), [location.pathname, location.hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (to) =>
    to.includes('#') ? location.pathname === '/' && location.hash === to.slice(1) : undefined

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <BrandMark />
        <nav id="primary-nav" className={`nav ${open ? 'is-open' : ''}`} aria-label="Primary">
          {LINKS.map((l) =>
            l.to.includes('#') ? (
              <Link key={l.label} to={l.to} className={isActive(l.to) ? 'active' : ''}>{l.label}</Link>
            ) : (
              <NavLink key={l.label} to={l.to} end={l.to === '/'} className={({ isActive: a }) => (a && !location.hash ? 'active' : '')}>{l.label}</NavLink>
            )
          )}
          {wa && <Button href={wa} className="nav-cta">Enquire Now</Button>}
        </nav>
        <button ref={toggleRef} type="button" className="nav-toggle" aria-expanded={open} aria-controls="primary-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
