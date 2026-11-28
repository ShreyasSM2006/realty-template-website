import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePhone, whatsappUrl, propertyEnquiryMessage } from './whatsapp.js'
import { formatPrice } from './formatPrice.js'
import { filterProperties, defaultFilters, sortProperties } from './propertyFilters.js'
import { mapSupabaseProperty } from './propertyMapper.js'
import { clientData } from '../data/clientData.js'

test('normalizePhone', () => {
  assert.equal(normalizePhone('98765 43210'), '919876543210')
  assert.equal(normalizePhone('+91 98765-43210'), '919876543210')
  assert.equal(normalizePhone(''), '')
  assert.equal(normalizePhone('123'), '')
})
test('whatsappUrl encodes message and has no plus', () => {
  const url = whatsappUrl('Hi & bye', { whatsapp: '', phone: '9876543210' })
  assert.equal(url, 'https://wa.me/919876543210?text=Hi%20%26%20bye')
  assert.equal(whatsappUrl('x', { phone: '' }), null)
})
test('property enquiry message names the property', () => {
  assert.match(propertyEnquiryMessage(clientData.properties[0]), /Lakeview 3 BHK/)
})
test('formatPrice', () => {
  assert.equal(formatPrice(21500000), '₹2.15 Cr')
  assert.equal(formatPrice(1280000), '₹12.8 Lakh')
  assert.equal(formatPrice(32000, 'rent'), '₹32,000 / month')
  assert.equal(formatPrice(undefined), 'Price on request')
})
test('filters combine', () => {
  const p = clientData.properties
  const r = filterProperties(p, { ...defaultFilters, purpose: 'rent', locality: 'Kolshet' })
  assert.deepEqual(r.map((x) => x.id), ['demo-006'])
  assert.equal(filterProperties(p, { ...defaultFilters, search: 'zzz' }).length, 0)
  assert.equal(filterProperties(p, { ...defaultFilters, minPrice: '20000000' }).length, 2)
})
test('sort by price', () => {
  const s = sortProperties(clientData.properties, 'price-asc')
  assert.equal(s[0].price, 32000)
})
test('mapSupabaseProperty normalizes buy to sale and preserves fields', () => {
  const mapped = mapSupabaseProperty({
    id: 'abc',
    title: 'Test Villa',
    listing_type: 'buy',
    property_type: 'Villa',
    area_sqft: 2400,
    locality: 'Thane West',
    city: 'Thane',
    image_urls: ['https://example.com/a.jpg'],
    amenities: ['Garden'],
    status: 'published',
    created_at: '2026-10-01T00:00:00Z',
  })
  assert.equal(mapped.listingPurpose, 'sale')
  assert.equal(mapped.propertyType, 'Villa')
  assert.equal(mapped.areaSqFt, 2400)
  assert.equal(mapped.status, 'available')
  assert.equal(mapped.address, 'Thane West, Thane')
  assert.equal(mapped.createdAt, '2026-10-01T00:00:00Z')
})
