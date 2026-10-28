import { clientData } from '../data/clientData.js'

const HEX = /^#[0-9a-f]{6}$/i

/** Writes branding config to CSS variables; invalid colors fall back to CSS defaults. */
export function applyTheme(branding = clientData.branding) {
  const root = document.documentElement.style
  const set = (name, value) => value && root.setProperty(name, value)
  if (HEX.test(branding.primaryColor)) set('--color-primary', branding.primaryColor)
  if (HEX.test(branding.accentColor)) set('--color-accent', branding.accentColor)
  if (HEX.test(branding.backgroundColor)) set('--color-bg', branding.backgroundColor)
  if (HEX.test(branding.textColor)) set('--color-text', branding.textColor)
  set('--font-sans', branding.fontFamily)
}

export function applyFavicon(href) {
  if (!href) return
  let link = document.head.querySelector('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
}
