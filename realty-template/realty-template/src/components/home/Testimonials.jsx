import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clientData } from '../../data/clientData.js'
import SectionHeading from '../common/SectionHeading.jsx'

export default function Testimonials() {
  const items = clientData.testimonials
  const [index, setIndex] = useState(0)

  if (!clientData.features.testimonials || !items?.length) return null

  const current = items[index] || items[0]
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)
  const next = () => setIndex((i) => (i + 1) % items.length)

  return (
    <section className="section" id="testimonials">
      <div className="container testimonials-shell">
        <div>
          <SectionHeading
            eyebrow="Client Notes"
            title="Words from those we advise"
            intro="Perspectives from buyers, families, and landlords we have represented."
          />

          {items.length > 1 && (
            <div className="testimonial-controls">
              <button
                type="button"
                className="testimonial-nav-btn"
                onClick={prev}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="testimonial-nav-btn"
                onClick={next}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
              <span className="muted small tabular">
                {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        <div className="testimonial-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="testimonial-quote">
                “{current.review}”
              </blockquote>
              <div className="testimonial-meta">
                <p className="testimonial-author">
                  {current.name}
                  {current.date ? (
                    <span className="muted"> · {current.date}</span>
                  ) : null}
                </p>
                {Number.isFinite(current.rating) && (
                  <span
                    className="small muted tabular"
                    aria-label={`Rated ${current.rating} out of 5`}
                  >
                    {current.rating} / 5
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
