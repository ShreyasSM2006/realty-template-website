export const defaultFilters = {
  search: '', purpose: 'all', type: 'all', locality: 'all', minPrice: '', maxPrice: '', sort: 'newest',
}

export function uniqueValues(properties, key) {
  return [...new Set(properties.map((p) => p[key]).filter(Boolean))].sort()
}

/** All filters combine (AND). Empty/invalid price inputs are ignored. */
export function filterProperties(properties, f) {
  const q = f.search.trim().toLowerCase()
  const min = f.minPrice === '' ? null : Number(f.minPrice)
  const max = f.maxPrice === '' ? null : Number(f.maxPrice)
  return properties.filter((p) => {
    if (q && !`${p.title} ${p.locality}`.toLowerCase().includes(q)) return false
    if (f.purpose !== 'all' && p.listingPurpose !== f.purpose) return false
    if (f.type !== 'all' && p.propertyType !== f.type) return false
    if (f.locality !== 'all' && p.locality !== f.locality) return false
    if (Number.isFinite(min) && min !== null && p.price < min) return false
    if (Number.isFinite(max) && max !== null && p.price > max) return false
    return true
  })
}

export function sortProperties(properties, sort) {
  const list = [...properties]
  const date = (p) => Date.parse(p.createdAt) || 0
  if (sort === 'price-asc') return list.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return list.sort((a, b) => b.price - a.price)
  return list.sort((a, b) => date(b) - date(a))
}

export function hasActiveFilters(f) {
  return Object.keys(defaultFilters).some((k) => k !== 'sort' && f[k] !== defaultFilters[k])
}
