// Runs before `npm run build`. Writes public/sitemap.xml and robots.txt
// only when seo.siteUrl is configured in clientData.js.
import { writeFileSync } from 'node:fs'
import { clientData } from '../src/data/clientData.js'

const siteUrl = (clientData.seo?.siteUrl || '').replace(/\/$/, '')
if (!siteUrl) {
  console.log('[seo] seo.siteUrl not set - skipping sitemap generation.')
  process.exit(0)
}
const paths = ['/', '/properties', ...clientData.properties.map((p) => `/properties/${p.id}`)]
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
  .map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`)
  .join('\n')}\n</urlset>\n`
writeFileSync('public/sitemap.xml', xml)
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
console.log(`[seo] wrote sitemap with ${paths.length} URLs`)
