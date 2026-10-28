const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

function trim(n) {
  return n.toFixed(2).replace(/\.?0+$/, '')
}

/** Indian formatting: crore/lakh for sales, full figure + "/ month" for rent. */
export function formatPrice(price, purpose = 'sale') {
  const value = Number(price)
  if (!Number.isFinite(value) || value <= 0) return 'Price on request'
  if (purpose === 'rent') return `₹${inr.format(value)} / month`
  if (value >= 1e7) return `₹${trim(value / 1e7)} Cr`
  if (value >= 1e5) return `₹${trim(value / 1e5)} Lakh`
  return `₹${inr.format(value)}`
}
