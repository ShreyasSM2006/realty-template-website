import { useMemo, useState } from 'react'
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { uniqueValues, hasActiveFilters, defaultFilters } from '../../utils/propertyFilters.js'

const PURPOSE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

export default function PropertyFilters({
  filters,
  onChange,
  onReset,
  properties = clientData.properties,
}) {
  const [open, setOpen] = useState(false)

  const source = properties.length ? properties : clientData.properties
  const types = useMemo(() => uniqueValues(source, 'propertyType'), [source])
  const localities = useMemo(() => uniqueValues(source, 'locality'), [source])

  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })
  const isDirty = hasActiveFilters(filters) || filters.sort !== defaultFilters.sort

  return (
    <form
      className="filters"
      role="search"
      aria-label="Filter properties"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="filters-purpose-bar" role="group" aria-label="Listing purpose">
        <div className="purpose-tabs">
          {PURPOSE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`purpose-tab ${filters.purpose === tab.value ? 'is-active' : ''}`}
              onClick={() => onChange({ ...filters, purpose: tab.value })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isDirty && (
          <button
            type="button"
            className="btn btn-ghost filters-clear-inline"
            onClick={onReset}
          >
            <RotateCcw size={14} aria-hidden="true" /> Reset filters
          </button>
        )}
      </div>

      <div className="filters-top">
        <label className="field grow">
          <span>Search title or locality</span>
          <div className="search-input-wrap">
            <Search size={16} className="search-input-icon" aria-hidden="true" />
            <input
              type="search"
              value={filters.search}
              onChange={set('search')}
              placeholder="e.g. Majiwada, Lakeview, Villa..."
            />
          </div>
        </label>

        <button
          type="button"
          className="btn btn-outline filters-toggle"
          aria-expanded={open}
          aria-controls="filter-panel"
          onClick={() => setOpen((o) => !o)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {open ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      <div id="filter-panel" className={`filters-panel ${open ? 'is-open' : ''}`}>
        <label className="field">
          <span>Property type</span>
          <select value={filters.type} onChange={set('type')}>
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Locality</span>
          <select value={filters.locality} onChange={set('locality')}>
            <option value="all">All localities</option>
            {localities.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Min price (₹)</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="Any"
            value={filters.minPrice}
            onChange={set('minPrice')}
          />
        </label>

        <label className="field">
          <span>Max price (₹)</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={set('maxPrice')}
          />
        </label>

        <label className="field">
          <span>Sort by</span>
          <select value={filters.sort} onChange={set('sort')}>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
    </form>
  )
}
