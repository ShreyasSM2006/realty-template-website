import { Link } from 'react-router-dom'
import { Bed, Bath, Ruler, MapPin, Images } from 'lucide-react'
import { motion } from 'motion/react'
import SmartImage from '../common/SmartImage.jsx'
import WhatsAppButton from '../common/WhatsAppButton.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { propertyEnquiryMessage } from '../../utils/whatsapp.js'

export const STATUS_LABELS = {
  available: 'Available',
  sold: 'Sold',
  rented: 'Rented',
  'under-offer': 'Under offer',
}

export default function PropertyCard({ property: p, index = 0 }) {
  const specs = [
    p.bedrooms != null && { Icon: Bed, text: `${p.bedrooms} Bed` },
    p.bathrooms != null && { Icon: Bath, text: `${p.bathrooms} Bath` },
    p.areaSqFt != null && { Icon: Ruler, text: `${p.areaSqFt} sq ft` },
  ].filter(Boolean)

  const unavailable = p.status && p.status !== 'available'
  const photoCount = p.images?.length || 0

  return (
    <motion.article
      className="property-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={`/properties/${p.id}`}
        className="property-media"
        aria-label={`View details: ${p.title}`}
      >
        <SmartImage
          src={p.images?.[0]}
          alt={`${p.title} in ${p.locality}`}
          width="640"
          height="480"
        />
        <span className="badge badge-purpose">
          {p.listingPurpose === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
        {p.featured && <span className="badge badge-featured">Featured</span>}
        {photoCount > 1 && (
          <span className="badge-count tabular" aria-label={`${photoCount} photos`}>
            <Images size={12} aria-hidden="true" /> {photoCount}
          </span>
        )}
      </Link>

      <div className="property-body">
        {/* Property cards intentionally show locality, not the full street address. */}
        <p className="property-meta">
          <MapPin size={13} aria-hidden="true" />
          <span>
            {p.locality} · {p.propertyType}
          </span>
        </p>

        <h3>
          <Link to={`/properties/${p.id}`}>{p.title}</Link>
        </h3>

        <p className="property-price">
          {formatPrice(p.price, p.listingPurpose)}
        </p>

        {specs.length > 0 && (
          <ul className="specs">
            {specs.map(({ Icon, text }) => (
              <li key={text} className="tabular">
                <Icon size={15} strokeWidth={1.6} aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        )}

        {unavailable && (
          <p className="status-note">{STATUS_LABELS[p.status] || p.status}</p>
        )}

        <div className="card-actions">
          <Link to={`/properties/${p.id}`} className="btn btn-outline">
            View Residence
          </Link>
          <WhatsAppButton
            message={propertyEnquiryMessage(p)}
            variant="whatsapp-outline"
          >
            Enquire
          </WhatsAppButton>
        </div>
      </div>
    </motion.article>
  )
}
