/**
 * CLIENT CONFIGURATION  (the only file you edit for a new client)
 *
 * REQUIRED for a real client: business.name, phone, whatsapp (or phone), tagline,
 * description, serviceAreas; hero.*; seo.siteTitle/description; properties (real ones).
 * OPTIONAL (safely hidden when empty): legalName, logo, favicon, email, address, openingHours,
 *   mapUrl, about.image, testimonials, socialLinks, property.address/bedrooms/bathrooms/areaSqFt/amenities/mapUrl.
 *
 * Phone numbers are STRINGS. 10-digit Indian numbers get +91 automatically.
 * Property: listingPurpose = 'sale' | 'rent'; status = 'available' | 'sold' | 'rented' | 'under-offer';
 *   createdAt = 'YYYY-MM-DD'; price is a number in INR (monthly rent for rentals).
 * DEMO DATA: everything below is fictional. Set isDemo: false and replace it before going live.
 */
export const clientData = {
  isDemo: true,

  business: {
    name: 'XYZ Realty',
    legalName: '',
    tagline: 'Boutique property consultancy in Thane',
    description:
      'A demonstration agency profile. Replace this paragraph with a short, verified description of the realtor and the kind of clients they work with.',
    representativeName: 'Demo Representative',
    logo: '',
    favicon: '',
    phone: '8850515916',
    whatsapp: '8850515916',
    email: 'shreyas.mahajan2006@gmail.com',
    address: 'Demo Office, Ghodbunder Road, Thane West, Maharashtra',
    mapUrl: '',
    serviceAreas: [
      { name: 'Thane West', description: 'Lake-side and Ghodbunder Road residences.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=70' },
      { name: 'Majiwada', description: 'Well-connected apartments near the highway.', image: '' },
      { name: 'Kolshet', description: 'Newer developments and family homes.', image: '' },
      { name: 'Naupada', description: 'Newer developments and family homes.', image: '' },
    ],
    openingHours: 'Mon–Sat, 10:00 – 19:00',
  },

    branding: {
    primaryColor: '#1a1446',
    accentColor: '#ff5a5f',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    layoutVariant: 'default',
  },

  hero: {
    eyebrow: 'Thane · Mumbai Metropolitan Region',
    title: 'YOUR GATEWAY TO ELEVATED LIVING',
    description:
      "Find your ideal property in Thane with expert guidance for buying, selling, and renting. Tell us what you're looking for, and we'll help you discover the right property to match your needs and budget.",
    backgroundImage: 'https://i.redd.it/6mi0g213xpih1.png',
    primaryCtaText: 'Explore Properties',
    secondaryCtaText: 'WhatsApp Us',
  },

  trustHighlights: [
    { title: 'Locality-focused advice', description: 'Shortlists built around the neighbourhoods you actually want to live in.' },
    { title: 'Sale and rental support', description: 'One point of contact whether you are buying, selling or renting.' },
    { title: 'Document guidance', description: 'Help understanding the paperwork steps. Legal advice comes from a qualified lawyer.' },
  ],

  services: [
    { id: 'sales', title: 'Residential Sales', description: 'Find and negotiate apartments and homes that match your budget.', icon: 'home' },
    { id: 'rentals', title: 'Rental Assistance', description: 'Shortlists and viewings for tenants and landlords.', icon: 'key' },
    { id: 'consult', title: 'Buying Consultation', description: 'Walk through locality, pricing and process before you commit.', icon: 'compass' },
    { id: 'invest', title: 'Investment Consultation', description: 'Discuss rental yield and location trade-offs.', icon: 'chart' },
  ],

  properties: [
    { id: 'demo-001', slug: 'lakeview-3bhk', title: 'Lakeview 3 BHK Apartment', description: 'Demonstration listing. Bright corner apartment with open living area and lake-facing balcony.', price: 21500000, currency: 'INR', listingPurpose: 'sale', propertyType: 'Apartment', locality: 'Thane West', address: '', bedrooms: 3, bathrooms: 3, areaSqFt: 1380, images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=70', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70'], amenities: ['Covered parking', 'Gym', 'Garden'], featured: true, status: 'available', createdAt: '2026-09-20', mapUrl: '' },
    { id: 'demo-002', slug: 'majiwada-2bhk', title: 'Compact 2 BHK near Majiwada', description: 'Demonstration listing. Efficient layout close to transport and daily needs.', price: 12800000, currency: 'INR', listingPurpose: 'sale', propertyType: 'Apartment', locality: 'Majiwada', bedrooms: 2, bathrooms: 2, areaSqFt: 920, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70'], amenities: ['Lift', 'Security'], featured: true, status: 'available', createdAt: '2026-08-11' },
    { id: 'demo-003', slug: 'kolshet-family-villa', title: 'Garden Villa, Kolshet', description: 'Demonstration listing. Independent villa with private garden.', price: 48000000, currency: 'INR', listingPurpose: 'sale', propertyType: 'Villa', locality: 'Kolshet', bedrooms: 4, bathrooms: 4, areaSqFt: 2850, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70'], amenities: ['Private garden', 'Parking for 2 cars'], featured: true, status: 'under-offer', createdAt: '2026-07-02' },
    { id: 'demo-004', slug: 'thane-1bhk-rent', title: 'Furnished 1 BHK for Rent', description: 'Demonstration listing. Semi-furnished apartment suited to working professionals.', price: 32000, currency: 'INR', listingPurpose: 'rent', propertyType: 'Apartment', locality: 'Thane West', bedrooms: 1, bathrooms: 1, areaSqFt: 610, images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=70'], amenities: ['Furnished', 'Lift'], featured: false, status: 'available', createdAt: '2026-10-05' },
    { id: 'demo-005', slug: 'majiwada-shop', title: 'Ground-floor Commercial Unit', description: 'Demonstration listing. Street-facing unit suitable for retail or a clinic.', price: 65000, currency: 'INR', listingPurpose: 'rent', propertyType: 'Commercial', locality: 'Majiwada', areaSqFt: 480, images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=70'], amenities: [], featured: false, status: 'available', createdAt: '2026-09-01' },
    { id: 'demo-006', slug: 'kolshet-3bhk-rent', title: 'Spacious 3 BHK for Rent', description: 'Demonstration listing. Family-sized apartment in a gated community.', price: 58000, currency: 'INR', listingPurpose: 'rent', propertyType: 'Apartment', locality: 'Kolshet', bedrooms: 3, bathrooms: 3, areaSqFt: 1250, images: [], amenities: ['Clubhouse', 'Gym'], featured: false, status: 'available', createdAt: '2026-06-18' },
  ],

  about: {
    title: 'About the agency',
    description:
      'Demonstration text. Describe how the realtor works and what clients can expect. Only include verified facts.',
    image: '',
    representativeName: 'Demo Representative',
    philosophy: 'Clear advice, honest pricing conversations and no pressure.',
    highlights: [],
  },

  testimonials: [],

  socialLinks: [
    { platform: 'instagram', url: '' },
    { platform: 'facebook', url: '' },
  ],

  footerLinks: { privacyUrl: '', disclaimerUrl: '' },

  features: {
    propertyListings: true,
    propertyFilters: true,
    testimonials: true,
    serviceAreas: true,
    map: true,
    about: true,
    enquiryForm: true,
    featuredProperties: true,
  },

  seo: {
    siteTitle: 'Harbour & Hill Realty | Thane Property Consultancy (Demo)',
    description: 'Demonstration real estate website template for Thane and Mumbai realtors.',
    defaultSocialImage: '',
    siteUrl: '',
  },
}