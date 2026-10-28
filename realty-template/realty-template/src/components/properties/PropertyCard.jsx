import { Link } from 'react-router-dom';
import { Bed, Bath, Ruler, MapPin } from 'lucide-react';
import SmartImage from '../common/SmartImage.jsx';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { propertyEnquiryMessage } from '../../utils/whatsapp.js';

export const STATUS_LABELS = {
  available: 'Available',
  sold: 'Sold',
  rented: 'Rented',
  'under-offer': 'Under offer',
};

export default function PropertyCard({ property: p }) {
  const specs = [
    p.bedrooms != null && { Icon: Bed, text: `${p.bedrooms} Bed` },
    p.bathrooms != null && { Icon: Bath, text: `${p.bathrooms} Bath` },
    p.areaSqFt != null && { Icon: Ruler, text: `${p.areaSqFt} sq ft` },
  ].filter(Boolean);

  const unavailable = p.status && p.status !== 'available';

  return (
    <article className="property-card">
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
          {p.listingPurpose === 'rent' ? 'For rent' : 'For sale'}
        </span>
        {p.featured && <span className="badge badge-featured">Featured</span>}
      </Link>

      <div className="property-body">
        {/* Property cards intentionally show locality, not the full street address. */}
        <p className="property-meta">
          <MapPin size={14} aria-hidden="true" /> {p.locality} · {p.propertyType}
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
              <li key={text}>
                <Icon size={16} aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        )}

        {unavailable && (
          <p className="status-note">{STATUS_LABELS[p.status] || p.status}</p>
        )}

        <div className="card-actions">
          <Link to={`/properties/${p.id}`} className="btn btn-outline">
            View Details
          </Link>
          <WhatsAppButton
            message={propertyEnquiryMessage(p)}
            variant="whatsapp-outline"
          >
            Enquire
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
