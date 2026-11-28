import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../utils/gsapConfig.js'
import { useMeta } from '../utils/useMeta.js'

import Hero from '../components/home/Hero.jsx'
import TrustHighlights from '../components/home/TrustHighlights.jsx'
import FeaturedProperties from '../components/home/FeaturedProperties.jsx'
import ServicesSection from '../components/home/ServicesSection.jsx'
import AboutSection from '../components/home/AboutSection.jsx'
import ServiceAreas from '../components/home/ServiceAreas.jsx'
import Testimonials from '../components/home/Testimonials.jsx'
import ContactSection from '../components/home/ContactSection.jsx'

export default function HomePage() {
  useMeta({ path: '/' })
  const pageRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Hero entrance choreography
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        heroTl
          .fromTo(
            '.hero-bg',
            { scale: 1.12 },
            { scale: 1.03, duration: 1.7, ease: 'power2.out' }
          )
          .from(
            '.hero-anim-eyebrow',
            { y: 18, opacity: 0, duration: 0.7 },
            0.15
          )
          .from(
            '.hero-anim-title',
            { yPercent: 18, opacity: 0, duration: 0.95 },
            0.25
          )
          .from(
            '.hero-anim-aside',
            { y: 24, opacity: 0, duration: 0.85 },
            0.4
          )
          .from(
            '.hero-anim-strip',
            { y: 16, opacity: 0, duration: 0.75 },
            0.55
          )

        // 2. Desktop-only parallax on Hero background
        mm.add('(min-width: 860px)', () => {
          gsap.to('.hero-bg', {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        })

        // 3. Trust highlights staggered band
        gsap.from('.trust-item', {
          y: 26,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.trust',
            start: 'top 86%',
            once: true,
          },
        })

        // 4. Services editorial index rows
        gsap.from('.service-row', {
          y: 26,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.services-list',
            start: 'top 84%',
            once: true,
          },
        })

        // 5. About visual masked reveal & narrative entrance
        gsap.from('.about-visual', {
          y: 32,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 82%',
            once: true,
          },
        })

        gsap.from('.about-copy > *', {
          y: 22,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.about-copy',
            start: 'top 84%',
            once: true,
          },
        })

        // 6. Service Areas staggered reveal
        gsap.from('.area-card', {
          y: 28,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.areas-grid',
            start: 'top 84%',
            once: true,
          },
        })

        // 7. Contact section split entrance
        gsap.from('.contact-grid > *', {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 84%',
            once: true,
          },
        })
      })
    }, pageRef)

    return () => {
      ctx.revert()
      mm.revert()
    }
  }, [])

  return (
    <div ref={pageRef}>
      <Hero />
      <TrustHighlights />
      <FeaturedProperties />
      <ServicesSection />
      <AboutSection />
      <ServiceAreas />
      <Testimonials />
      <ContactSection />
    </div>
  )
}
