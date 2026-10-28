import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  const listings = clientData.features.propertyListings
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {listings && <Route path="/properties" element={<PropertiesPage />} />}
          {listings && <Route path="/properties/:id" element={<PropertyDetailPage />} />}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
