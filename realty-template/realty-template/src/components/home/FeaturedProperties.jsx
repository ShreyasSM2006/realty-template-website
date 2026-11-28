import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { clientData } from '../../data/clientData.js'
import { mapSupabaseProperty } from '../../utils/propertyMapper.js'
import { ScrollTrigger } from '../../utils/gsapConfig.js'
import SectionHeading from '../common/SectionHeading.jsx'
import PropertyGrid from '../properties/PropertyGrid.jsx'

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
          setFeatured((data ?? []).map(mapSupabaseProperty))
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err)
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

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [loading, featured.length])

  if (!clientData.features.featuredProperties) return null
  if (loading) {
    return (
      <section className="section" aria-busy="true">
        <div className="container">
          <div className="section-split-head">
            <SectionHeading
              eyebrow="Portfolio"
              title="Selected residences"
              intro="A curated edit of available homes and investments."
            />
          </div>
          <div className="property-grid">
            {[0, 1, 2].map((n) => (
              <div key={n} className="skeleton-card" aria-hidden="true">
                <div className="skeleton-media" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line tall" />
                  <div className="skeleton-line medium" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featured.length === 0) return null

  return (
    <section className="section" id="featured">
      <div className="container">
        <div className="section-split-head">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected residences"
            as="h2"
            intro="Explore our handpicked properties."
          />

          {clientData.features.propertyListings && (
            <Link to="/properties" className="editorial-link">
              View all listings <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}
        </div>

        <PropertyGrid properties={featured} />
      </div>
    </section>
  )
}
