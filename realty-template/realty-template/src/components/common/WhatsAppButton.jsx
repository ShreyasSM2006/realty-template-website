import { MessageCircle } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import { whatsappUrl, generalEnquiryMessage } from '../../utils/whatsapp.js'
import Button from './Button.jsx'

/** Inline WhatsApp CTA. Renders nothing when no usable number is configured. */
export default function WhatsAppButton({ message, children = 'WhatsApp', variant = 'whatsapp', className = '' }) {
  const url = whatsappUrl(message ?? generalEnquiryMessage(), clientData.business)
  if (!url) return null
  return (
    <Button href={url} variant={variant} className={className}>
      <MessageCircle size={18} aria-hidden="true" /> {children}
    </Button>
  )
}

export function WhatsAppFloat() {
  const url = whatsappUrl(generalEnquiryMessage(), clientData.business)
  if (!url) return null
  return (
    <a className="wa-float" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Chat with ${clientData.business.name} on WhatsApp`}>
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  )
}
