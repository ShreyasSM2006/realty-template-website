import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { clientData } from '../data/clientData.js'
import { formatPrice } from '../utils/formatPrice.js'
import { mapSupabaseProperty } from '../utils/propertyMapper.js'
import { telUrl, propertyEnquiryMessage } from '../utils/whatsapp.js'
import { useMeta } from '../utils/useMeta.js'
import PropertyGallery from '../components/properties/PropertyGallery.jsx'
import PropertyGrid from '../components/properties/PropertyGrid.jsx'
import PropertyEnquiry from '../components/properties/PropertyEnquiry.jsx'
import { STATUS_LABELS } from '../components/properties/PropertyCard.jsx'
import WhatsAppButton from '../components/common/WhatsAppButton.jsx'
import Button from '../components/common/Button.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function PropertyDetailPage() {
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchProperty() {
      setLoading(true)
      setError('')
      setProperty(null)
      setRelated([])

      try {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .maybeSingle()

        if (fetchError) throw fetchError
        if (!active) return

        if (!data) {
          setProperty(null)
          return
        }

        setProperty(mapSupabaseProperty(data))

        const { data: relatedData, error: relatedError } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'published')
          .neq('id', data.id)
          .order('created_at', { ascending: false })

        if (relatedError) throw relatedError
        if (!active) return

        const mappedRelated = (relatedData ?? [])
          .filter(
            (item) =>
              item.locality === data.locality ||
              item.property_type === data.property_type
          )
          .slice(0, 3)
          .map(mapSupabaseProperty)

        setRelated(mappedRelated)
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || 'Could not load this property.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProperty()

    return () => {
      active = false
    }
  }, [id])

  useMeta(
    property
      ? {
          title: property.title,
          description: property.description?.slice(0, 160),
          image: property.images?.[0],
          path: `/properties/${property.id}`,
        }
      : { title: 'Property details' }
  )

  if (loading) {
    return (
      <section className="section" aria-busy="true">
        <div className="container">
          <div className="detail-grid">
            <div className="skeleton-card" aria-hidden="true">
              <div className="skeleton-media" />
            </div>
            <div className="detail-info-card" aria-hidden="true">
              <div className="skeleton-body" style={{ padding: 0 }}>
                <div className="skeleton-line short" />
                <div className="skeleton-line tall" />
                <div className="skeleton-line medium" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <Link to="/properties" className="back-link">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to residences
          </Link>
          <div className="empty-state" role="alert">
            <h3>Could not load residence</h3>
            <p className="muted">{error}</p>
            <Button to="/properties" variant="outline">
              Browse all listings
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!property) {
    return (
      <NotFoundPage
        title="Property not found"
        message="This listing does not exist, is unpublished, or is no longer available."
      />
    )
  }

  const p = property
  const tel = telUrl()

  const specs = [
    ['Address', p.address],
    ['Property Type', p.propertyType],
    ['Listing Purpose', p.listingPurpose === 'rent' ? 'For rent' : 'For sale'],
    ['Availability', STATUS_LABELS[p.status] || p.status],
    p.bedrooms != null && ['Bedrooms', p.bedrooms],
    p.bathrooms != null && ['Bathrooms', p.bathrooms],
    p.areaSqFt != null && ['Area', `${p.areaSqFt} sq ft`],
  ].filter((item) => item && item[1] != null && item[1] !== '')

  return (
    <article className="section">
      <div className="container">
        <Link to="/properties" className="back-link">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to residences
        </Link>

        <div className="detail-grid">
          <div>
            <PropertyGallery images={p.images} title={p.title} />

            {p.description && (
              <section className="detail-block">
                <h2>About this residence</h2>
                <p>{p.description}</p>
              </section>
            )}

            {p.amenities?.length > 0 && (
              <section className="detail-block">
                <h2>Amenities & specifications</h2>
                <ul className="amenities-grid">
                  {p.amenities.map((amenity, index) => (
                    <li key={`${amenity}-${index}`}>{amenity}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="detail-info-sticky">
            <div className="detail-info-card">
              <p className="property-meta">
                <MapPin size={13} aria-hidden="true" />
                <span>{[p.locality, p.city].filter(Boolean).join(', ')}</span>
              </p>

              <h1>{p.title}</h1>

              <p className="property-price big">
                {formatPrice(p.price, p.listingPurpose)}
              </p>

              <div className="detail-actions">
                <WhatsAppButton message={propertyEnquiryMessage(p)}>
                  Enquire on WhatsApp
                </WhatsAppButton>

                {tel && (
                  <Button href={tel} variant="outline">
                    <Phone size={16} aria-hidden="true" />
                    Call Desk
                  </Button>
                )}
              </div>

              <dl className="spec-table">
                {specs.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd className="tabular">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        {clientData.features.enquiryForm && (
          <section className="detail-block detail-enquiry-band">
            <div className="detail-enquiry-split">
              <div>
                <p className="eyebrow">Private Viewing</p>
                <h2>Arrange a walkthrough of {p.title}</h2>
                <p className="muted">
                  Send us your preferred viewing schedule or request floor plans and documentation guidance via WhatsApp.
                </p>
              </div>
              <PropertyEnquiry defaultProperty={p.title} />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="detail-block">
            <div className="section-split-head">
              <header className="section-heading">
                <p className="eyebrow">Explore Further</p>
                <h2>Similar residences</h2>
              </header>
              <Link to="/properties" className="editorial-link">
                View all listings
              </Link>
            </div>
            <PropertyGrid properties={related} />
          </section>
        )}
      </div>
    </article>
  )
}
