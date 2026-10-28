import { clientData } from '../data/clientData.js'

/** Digits only; 10-digit Indian numbers get the 91 prefix. Returns '' if unusable. */
export function normalizePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '').replace(/^0+/, '')
  if (digits.length === 10) return `91${digits}`
  return digits.length >= 11 && digits.length <= 15 ? digits : ''
}

export function getWhatsAppNumber(business = clientData.business) {
  return normalizePhone(business.whatsapp) || normalizePhone(business.phone)
}

export function whatsappUrl(message = '', business = clientData.business) {
  const number = getWhatsAppNumber(business)
  if (!number) return null
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export function telUrl(business = clientData.business) {
  const number = normalizePhone(business.phone)
  return number ? `tel:+${number}` : null
}

export function propertyEnquiryMessage(property, business = clientData.business) {
  return `Hello ${business.name}, I'm interested in "${property.title}" (${property.locality}, ref ${property.id}). Could you share more details?`
}

export function generalEnquiryMessage(business = clientData.business) {
  return `Hello ${business.name}, I would like to enquire about properties.`
}
