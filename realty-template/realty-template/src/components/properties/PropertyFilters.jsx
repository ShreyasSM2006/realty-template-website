import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { uniqueValues, hasActiveFilters, defaultFilters } from '../../utils/propertyFilters.js'

const types = uniqueValues(clientData.properties, 'propertyType')
const localities = uniqueValues(clientData.properties, 'locality')

export default function PropertyFilters({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false)
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })
  return (
    <form className="filters" role="search" aria-label="Filter properties" onSubmit={(e) => e.preventDefault()}>
      <div className="filters-top">
        <label className="field grow">
          <span>Search title or locality</span>
          <input type="search" value={filters.search} onChange={set('search')} placeholder="e.g. Majiwada" />
        </label>
        <button type="button" className="btn btn-outline filters-toggle" aria-expanded={open} aria-controls="filter-panel" onClick={() => setOpen((o) => !o)}>
          <SlidersHorizontal size={18} aria-hidden="true" /> Filters
        </button>
      </div>
      <div id="filter-panel" className={`filters-panel ${open ? 'is-open' : ''}`}>
        <label className="field"><span>Buy / Rent</span>
          <select value={filters.purpose} onChange={set('purpose')}>
            <option value="all">All</option><option value="sale">For sale</option><option value="rent">For rent</option>
          </select>
        </label>
        <label className="field"><span>Property type</span>
          <select value={filters.type} onChange={set('type')}>
            <option value="all">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="field"><span>Locality</span>
          <select value={filters.locality} onChange={set('locality')}>
            <option value="all">All localities</option>
            {localities.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="field"><span>Min price (₹)</span>
          <input type="number" inputMode="numeric" min="0" value={filters.minPrice} onChange={set('minPrice')} />
        </label>
        <label className="field"><span>Max price (₹)</span>
          <input type="number" inputMode="numeric" min="0" value={filters.maxPrice} onChange={set('maxPrice')} />
        </label>
        <label className="field"><span>Sort by</span>
          <select value={filters.sort} onChange={set('sort')}>
            <option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
          </select>
        </label>
        <button type="button" className="btn btn-ghost" onClick={onReset} disabled={!hasActiveFilters(filters) && filters.sort === defaultFilters.sort}>
          Clear all filters
        </button>
      </div>
    </form>
  )
}
