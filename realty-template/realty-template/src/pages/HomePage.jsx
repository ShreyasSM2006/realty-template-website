import { useMeta } from '../utils/useMeta.js'
import Hero from '../components/home/Hero.jsx'
import TrustHighlights from '../components/home/TrustHighlights.jsx'
import FeaturedProperties from '../components/home/FeaturedProperties.jsx'
import ServicesSection from '../components/home/ServicesSection.jsx'
import AboutSection from '../components/home/AboutSection.jsx'
import ServiceAreas from '../components/home/ServiceAreas.jsx'
import Testimonials from '../components/home/Testimonials.jsx'
import ContactSection from '../components/home/ContactSection.jsx'

export default function HomePage() {
  useMeta({ path: '/' })
  return (
    <>
      <Hero />
      <TrustHighlights />
      <FeaturedProperties />
      <ServicesSection />
      <AboutSection />
      <ServiceAreas />
      <Testimonials />
      <ContactSection />
    </>
  )
}
