# Realty Template (React + Vite)

Reusable real estate website for independent realtors in Mumbai / Thane. One codebase, **one deployment per client**. All client content lives in `src/data/clientData.js`.

> The bundled data is **fictional demo content** (`isDemo: true`). Replace it before showing it as a real client's site.

## Prerequisites
Node.js 18+ and npm.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for WhatsApp, price, filter utilities
npm run build      # production build in dist/
npm run preview    # serve the build locally
```

## Project structure
```
src/data/clientData.js     ALL client content, branding, feature flags, listings
src/utils/                 whatsapp, formatPrice, propertyFilters, theme, useMeta, validateConfig
src/components/{layout,home,properties,common}
src/pages/                 Home, Properties, PropertyDetail, NotFound
src/styles/                variables.css (tokens), global.css, components.css
scripts/generate-seo-files.js   sitemap + robots (runs before build)
```

## Create a new client
1. Copy the template into a new folder/repo (e.g. `realty-<client>`), not a branch of another client.
2. Edit `src/data/clientData.js`. The header comment lists required vs optional fields.
3. Set `isDemo: false`, replace demo listings, set `seo.siteUrl` to the live domain.
4. Check the browser console in dev mode for configuration warnings.

Changing `branding.primaryColor` (and the other colors) updates the whole theme via CSS variables. Invalid hex values are ignored.

## Property data
`id` (unique, stable, used in URLs), `title`, `price` (number, INR; monthly for rent), `listingPurpose` (`sale`/`rent`), `propertyType`, `locality`, `status` (`available`/`sold`/`rented`/`under-offer`), `createdAt` (`YYYY-MM-DD`), `images` (array). Optional: `description`, `address`, `bedrooms`, `bathrooms`, `areaSqFt`, `amenities`, `featured`, `mapUrl` (https only). The array shape maps directly to a future API/database table.

## Images
Remote Unsplash URLs are used for the demo. For real clients, put files in `public/images/` and reference them as `/images/name.jpg`. Broken or missing images fall back to a neutral placeholder. Use ~1200px wide JPEG/WebP, compressed. Logo: `business.logo`; favicon: `business.favicon`.

## WhatsApp and enquiries
Numbers are strings; 10-digit Indian numbers get `91` added; links are `https://wa.me/<digits>?text=<encoded>`. If `business.whatsapp` is empty, `business.phone` is used; if neither works, WhatsApp buttons are hidden.
The enquiry form validates input, then **opens WhatsApp with a prefilled message**. The visitor must press Send there. The site shows exactly that and never claims a message was delivered. It does not store anything.

## Deploy to Vercel (one project per client)
1. Push the client repo to GitHub.
2. Vercel > Add New Project > import repo. Framework: Vite, build `npm run build`, output `dist`.
3. `vercel.json` already rewrites all routes to `index.html` so `/properties/...` works on refresh.
4. Deploy, then set `seo.siteUrl` to the final URL and redeploy (this generates `sitemap.xml` and `robots.txt`).

## Custom domain
Vercel project > Settings > Domains > add the domain, then create the DNS records Vercel shows (A record for apex, CNAME for `www`). Wait for propagation and SSL.

## Updating the template without touching other clients
Keep the template repo separate from each client repo. Only `src/data/clientData.js` and `public/images/` are client-specific. To pull template improvements into a client: add the template as a git remote (`git remote add template <url>`), `git fetch template`, then merge or cherry-pick; resolve conflicts in `clientData.js` in favour of the client's version. Updating one local file never changes other deployed sites; each must be redeployed.

## Known limitations
- Client-side React: search engines receive an empty HTML shell first. Google generally renders JS, but for serious SEO prerender (e.g. `vite-plugin-prerender`/`vite-ssg`) or move to Next.js/Astro. Rankings and leads are not guaranteed.
- Page titles and meta tags are set at runtime, so social-share previews (WhatsApp/Facebook scrapers) mostly only see the `index.html` tags. Prerendering fixes this too.
- No structured data is emitted (no verified data to describe accurately).
- Listings are static; no pagination (add when listings exceed ~30).
- Not browser-tested in this build environment; see verification notes below.

## Adding a backend later
Replace the `clientData.properties` import with a fetch in the pages, keeping the same property shape. For enquiries, post the form to a serverless function (Vercel Function) that validates server-side, stores the lead and notifies the realtor. Keep secrets in environment variables on the server, never in client code. Add a privacy notice and consent checkbox before storing personal data or adding analytics.
