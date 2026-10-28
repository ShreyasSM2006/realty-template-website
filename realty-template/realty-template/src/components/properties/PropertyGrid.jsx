import PropertyCard from './PropertyCard.jsx'

export default function PropertyGrid({ properties }) {
  return (
    <div className="property-grid">
      {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
    </div>
  )
}
