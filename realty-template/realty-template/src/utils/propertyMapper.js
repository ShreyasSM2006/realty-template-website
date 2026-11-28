/** Normalizes a Supabase `properties` row into the UI property model. */
export function mapSupabaseProperty(row) {
  if (!row) return null
  const purpose = row.listing_type === 'buy' ? 'sale' : row.listing_type
  return {
    ...row,
    listingPurpose: purpose,
    propertyType: row.property_type,
    areaSqFt: row.area_sqft,
    images: row.image_urls ?? [],
    amenities: row.amenities ?? [],
    createdAt: row.created_at,
    address:
      row.address?.trim() ||
      [row.locality, row.city].filter(Boolean).join(', '),
    status: row.status === 'published' ? 'available' : row.status,
  }
}
