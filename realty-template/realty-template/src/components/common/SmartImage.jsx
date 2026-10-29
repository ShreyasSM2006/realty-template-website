import { useState } from 'react'

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#e4e0d6'/><text x='50%' y='50%' fill='#7a7568' font-family='sans-serif' font-size='28' text-anchor='middle'>Image unavailable</text></svg>"
  )

/** Image with lazy loading and a built-in fallback for missing/broken URLs. */
export default function SmartImage({ src, alt, className, eager = false, fetchPriority, ...rest }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      className={className}
      src={!src || failed ? FALLBACK : src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={fetchPriority}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
