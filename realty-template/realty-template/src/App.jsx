import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'

import { clientData } from './data/clientData.js'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import { WhatsAppFloat } from './components/common/WhatsAppButton.jsx'

import HomePage from './pages/HomePage.jsx'
import PropertiesPage from './pages/PropertiesPage.jsx'
import PropertyDetailPage from './pages/PropertyDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const listings = clientData.features.propertyListings
  const isAdmin = pathname.startsWith('/admin')
  const isHome = pathname === '/'

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <ScrollManager />

      {!isAdmin && <Navbar isHome={isHome} />}
      {!isAdmin && !isHome && <div className="navbar-spacer" aria-hidden="true" />}

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {listings && (
            <Route path="/properties" element={<PropertiesPage />} />
          )}

          {listings && (
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
          )}

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
    </MotionConfig>
  )
}
