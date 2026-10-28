import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { clientData } from '../data/clientData.js'
import { useMeta } from '../utils/useMeta.js'
import { defaultFilters, filterProperties, sortProperties } from '../utils/propertyFilters.js'
import SectionHeading from '../components/common/SectionHeading.jsx'
import PropertyFilters from '../components/properties/PropertyFilters.jsx'
import PropertyGrid from '../components/properties/PropertyGrid.jsx'
import EmptyState from '../components/common/EmptyState.jsx'

export default function PropertiesPage() {
  useMeta({
    title: 'Properties',
    description: `Browse properties from ${clientData.business.name}.`,
    path: '/properties',
  })

  const [params] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    locality: params.get('locality') || 'all',
  }))

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Failed to fetch properties:', fetchError)
        setError('Unable to load properties. Please try again.')
        setProperties([])
        setLoading(false)
        return
      }

      const mappedProperties = (data || []).map((p) => ({
        ...p,
        listingPurpose: p.listing_type === 'buy' ? 'sale' : p.listing_type,
        propertyType: p.property_type,
        areaSqFt: p.area_sqft,
        images: p.image_urls || [],
        status: 'available',
      }))

      setProperties(mappedProperties)
      setLoading(false)
    }

    fetchProperties()
  }, [])

  const results = useMemo(
    () => sortProperties(filterProperties(properties, filters), filters.sort),
    [properties, filters]
  )

  const reset = () => setFilters({ ...defaultFilters })

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow="Listings"
          title="Properties"
          intro="Browse current listings."
        />

        {clientData.features.propertyFilters && (
          <PropertyFilters
            filters={filters}
            onChange={setFilters}
            onReset={reset}
          />
        )}

        {loading ? (
          <p role="status">Loading properties...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <>
            <p className="results-count" aria-live="polite">
              {results.length} {results.length === 1 ? 'property' : 'properties'} found
            </p>

            {results.length ? (
              <PropertyGrid properties={results} />
            ) : (
              <EmptyState
                title="No properties found"
                message="Published properties will appear here. Try clearing your filters."
                actionLabel="Clear all filters"
                onAction={reset}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}