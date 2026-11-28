import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { clientData } from '../data/clientData.js'
import { useMeta } from '../utils/useMeta.js'
import { mapSupabaseProperty } from '../utils/propertyMapper.js'
import {
  defaultFilters,
  filterProperties,
  sortProperties,
  hasActiveFilters,
} from '../utils/propertyFilters.js'
import SectionHeading from '../components/common/SectionHeading.jsx'
import PropertyFilters from '../components/properties/PropertyFilters.jsx'
import PropertyGrid from '../components/properties/PropertyGrid.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import Button from '../components/common/Button.jsx'

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

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Failed to fetch properties:', fetchError)
      setError('Unable to load properties right now. Please try again.')
      setProperties([])
      setLoading(false)
      return
    }

    setProperties((data || []).map(mapSupabaseProperty))
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const results = useMemo(
    () => sortProperties(filterProperties(properties, filters), filters.sort),
    [properties, filters]
  )

  const reset = () => setFilters({ ...defaultFilters })

  return (
    <section className="section">
      <div className="container">
        <div className="listings-header">
          <SectionHeading
            as="h1"
            eyebrow="Portfolio"
            title="Properties & Residences"
            intro={`Curated homes, villas, and commercial spaces represented by ${clientData.business.name}.`}
          />
        </div>

        {clientData.features.propertyFilters && (
          <PropertyFilters
            filters={filters}
            onChange={setFilters}
            onReset={reset}
            properties={properties}
          />
        )}

        {loading ? (
          <div aria-busy="true" aria-label="Loading properties">
            <div className="results-bar">
              <p className="results-count" role="status">
                Loading portfolio…
              </p>
            </div>
            <div className="property-grid">
              {[0, 1, 2, 3, 4, 5].map((n) => (
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
        ) : error ? (
          <div className="empty-state" role="alert">
            <h3>Unable to load listings</h3>
            <p className="muted">{error}</p>
            <Button onClick={fetchProperties} variant="outline">
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="results-bar">
              <p className="results-count tabular" aria-live="polite">
                Showing {results.length}{' '}
                {results.length === 1 ? 'residence' : 'residences'}
                {hasActiveFilters(filters) ? ' matching your criteria' : ''}
              </p>

              {filters.locality !== 'all' && (
                <span className="active-chip">
                  Locality: {filters.locality}
                  <button
                    type="button"
                    aria-label="Clear locality filter"
                    onClick={() => setFilters((f) => ({ ...f, locality: 'all' }))}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            {results.length ? (
              <PropertyGrid properties={results} />
            ) : (
              <EmptyState
                title="No matching residences"
                message="Try broadening your search or clearing active filters to explore our full portfolio."
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
