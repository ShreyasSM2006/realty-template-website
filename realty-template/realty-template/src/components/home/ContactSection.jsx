import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { telUrl } from '../../utils/whatsapp.js'
import SectionHeading from '../common/SectionHeading.jsx'
import WhatsAppButton from '../common/WhatsAppButton.jsx'
import PropertyEnquiry from '../properties/PropertyEnquiry.jsx'
import Button from '../common/Button.jsx'

export default function ContactSection() {
  const { business, features } = clientData
  const tel = telUrl()
  const mapUrl = /^https:\/\//.test(business.mapUrl || '') ? business.mapUrl : null
  return (
    <section className="section section-alt" id="contact">
      <div className={`container contact ${features.enquiryForm ? 'has-form' : ''}`}>
        <div>
          <SectionHeading eyebrow="Get in touch" title="Contact" intro="Message us on WhatsApp or call to arrange a conversation or a viewing." />
          <ul className="contact-list">
            {tel && <li><Phone size={18} aria-hidden="true" /><a href={tel}>{business.phone}</a></li>}
            {business.email && <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${business.email}`}>{business.email}</a></li>}
            {business.address && <li><MapPin size={18} aria-hidden="true" /><span>{business.address}</span></li>}
            {business.openingHours && <li><Clock size={18} aria-hidden="true" /><span>{business.openingHours}</span></li>}
          </ul>
          <div className="hero-actions">
            <WhatsAppButton>Chat on WhatsApp</WhatsAppButton>
            {features.map && mapUrl && <Button href={mapUrl} variant="outline">View on map</Button>}
          </div>
        </div>
        {features.enquiryForm && <PropertyEnquiry />}
      </div>
    </section>
  )
}
