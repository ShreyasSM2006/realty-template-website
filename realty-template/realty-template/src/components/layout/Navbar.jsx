import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { whatsappUrl, telUrl, generalEnquiryMessage } from '../../utils/whatsapp.js'
import Button from '../common/Button.jsx'
import SmartImage from '../common/SmartImage.jsx'

const { business, features } = clientData

const LINKS = [
  { label: 'Home', to: '/' },
  features.propertyListings && { label: 'Residences', to: '/properties' },
  features.about && { label: 'Philosophy', to: '/#about' },
  clientData.services.length > 0 && { label: 'Advisory', to: '/#services' },
  { label: 'Contact', to: '/#contact' },
].filter(Boolean)

function getMonogram(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase() || 'RE'
}

export function BrandMark() {
  return (
    <Link to="/" className="brand" aria-label={`${business.name} home`}>
      {business.logo ? (
        <SmartImage src={business.logo} alt="" className="brand-logo" eager />
      ) : (
        <span className="brand-monogram" aria-hidden="true">
          {getMonogram(business.name)}
        </span>
      )}
      <span className="brand-name">{business.name}</span>
    </Link>
  )
}

export default function Navbar({ isHome = false }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const toggleRef = useRef(null)
  const wa = whatsappUrl(generalEnquiryMessage())
  const tel = telUrl()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isHashActive = (to) =>
    to.includes('#') ? location.pathname === '/' && location.hash === to.slice(1) : false

  const navClasses = [
    'navbar',
    isHome ? 'navbar--overlay' : '',
    scrolled ? 'navbar--scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={navClasses}>
        <div className="container navbar-inner">
          <BrandMark />

          <nav className="nav-desktop" aria-label="Primary">
            <div className="nav-links">
              {LINKS.map((l) =>
                l.to.includes('#') ? (
                  <Link
                    key={l.label}
                    to={l.to}
                    className={`nav-link ${isHashActive(l.to) ? 'active' : ''}`}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `nav-link ${isActive && !location.hash ? 'active' : ''}`
                    }
                  >
                    {l.label}
                  </NavLink>
                )
              )}
            </div>

            {wa && (
              <Button
                href={wa}
                variant={isHome && !scrolled ? 'light-outline' : 'outline'}
                className="nav-cta"
              >
                Enquire <ArrowUpRight size={14} aria-hidden="true" />
              </Button>
            )}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              id="mobile-drawer"
              className="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-drawer-head">
                <BrandMark />
                <button
                  type="button"
                  className="mobile-drawer-close"
                  aria-label="Close navigation menu"
                  onClick={() => {
                    setOpen(false)
                    toggleRef.current?.focus()
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="mobile-drawer-nav" aria-label="Mobile navigation">
                {LINKS.map((l, idx) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + idx * 0.05, duration: 0.35 }}
                  >
                    {l.to.includes('#') ? (
                      <Link
                        to={l.to}
                        className={`mobile-drawer-link ${isHashActive(l.to) ? 'active' : ''}`}
                        onClick={() => setOpen(false)}
                      >
                        <span>{l.label}</span>
                        <span className="index">0{idx + 1}</span>
                      </Link>
                    ) : (
                      <NavLink
                        to={l.to}
                        end={l.to === '/'}
                        className={({ isActive }) =>
                          `mobile-drawer-link ${isActive && !location.hash ? 'active' : ''}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        <span>{l.label}</span>
                        <span className="index">0{idx + 1}</span>
                      </NavLink>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="mobile-drawer-footer">
                {wa && (
                  <Button href={wa} variant="light">
                    Private Enquiry via WhatsApp
                  </Button>
                )}
                <div className="mobile-drawer-meta">
                  {tel && <a href={tel}>{business.phone}</a>}
                  {business.email && <a href={`mailto:${business.email}`}>{business.email}</a>}
                  {business.openingHours && <span>{business.openingHours}</span>}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
