import { useEffect } from 'react'
import { clientData } from '../data/clientData.js'

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Sets title, description, Open Graph and canonical per page. */
export function useMeta({ title, description, image, path = '' } = {}) {
  useEffect(() => {
    const { seo, business } = clientData
    const fullTitle = title ? `${title} | ${business.name}` : seo.siteTitle
    const desc = description || seo.description
    const img = image || seo.defaultSocialImage
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:image', img)
    if (seo.siteUrl) {
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = `${seo.siteUrl.replace(/\/$/, '')}${path}`
    }
  }, [title, description, image, path])
}
