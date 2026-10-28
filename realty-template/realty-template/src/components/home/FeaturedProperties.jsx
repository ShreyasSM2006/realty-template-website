import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import SectionHeading from '../common/SectionHeading.jsx'
import PropertyGrid from '../properties/PropertyGrid.jsx'
import Button from '../common/Button.jsx'

export default function FeaturedProperties() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchFeaturedProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'published')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) throw error

        if (active) {
          const mappedProperties = (data ?? []).map((item) => ({
            ...item,
            listingPurpose: item.listing_type,
            propertyType: item.property_type,
            areaSqFt: item.area_sqft,
            images: item.image_urls ?? [],
            amenities: item.amenities ?? [],
            address: item.address || [item.locality, item.city]
              .filter(Boolean)
              .join(', '),
            status: 'available',
          }))

          setFeatured(mappedProperties)
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error)
        if (active) setFeatured([])
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchFeaturedProperties()

    return () => {
      active = false
    }
  }, [])

  if (loading || featured.length === 0) return null

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Featured"
          title="Selected properties"
          as="h2"
          intro="Explore our handpicked properties."
        />

        <PropertyGrid properties={featured} />

        <div className="center">
          <Button to="/properties" variant="outline">
            Browse all listings
          </Button>
        </div>
      </div>
    </section>
  )
}