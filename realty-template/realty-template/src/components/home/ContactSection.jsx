import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react'
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
    <section className="section section-stone" id="contact">
      <div className={`container contact-grid ${features.enquiryForm ? 'has-form' : ''}`}>
        <div>
          <SectionHeading
            eyebrow="Private Desk"
            title="Begin a conversation"
            intro="Message us on WhatsApp or call directly to arrange a private consultation or property viewing."
          />

          <ul className="contact-list">
            {tel && (
              <li>
                <Phone size={18} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <span className="contact-item-label">Telephone</span>
                  <a className="contact-item-value tabular" href={tel}>
                    {business.phone}
                  </a>
                </div>
              </li>
            )}

            {business.email && (
              <li>
                <Mail size={18} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <span className="contact-item-label">Email</span>
                  <a className="contact-item-value" href={`mailto:${business.email}`}>
                    {business.email}
                  </a>
                </div>
              </li>
            )}

            {business.address && (
              <li>
                <MapPin size={18} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <span className="contact-item-label">Office</span>
                  <span className="contact-item-value">{business.address}</span>
                </div>
              </li>
            )}

            {business.openingHours && (
              <li>
                <Clock size={18} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <span className="contact-item-label">Hours</span>
                  <span className="contact-item-value">{business.openingHours}</span>
                </div>
              </li>
            )}
          </ul>

          <div className="hero-actions">
            <WhatsAppButton>Chat on WhatsApp</WhatsAppButton>
            {features.map && mapUrl && (
              <Button href={mapUrl} variant="outline">
                View on map <ArrowUpRight size={15} aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        {features.enquiryForm && <PropertyEnquiry />}
      </div>
    </section>
  )
}
