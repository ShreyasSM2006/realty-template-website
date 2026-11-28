import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import SmartImage from '../common/SmartImage.jsx'

export default function PropertyGallery({ images = [], title }) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const list = images.length ? images : [null]
  const hasMultiple = list.length > 1

  useEffect(() => {
    setIndex(0)
    setLightboxOpen(false)
  }, [images])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + list.length) % list.length)
  }, [list.length])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % list.length)
  }, [list.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft' && hasMultiple) prev()
      if (e.key === 'ArrowRight' && hasMultiple) next()
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen, hasMultiple, prev, next])

  return (
    <div className="gallery">
      <div className="gallery-main-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={list[index] || index}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <SmartImage
              className="gallery-main"
              src={list[index]}
              alt={`${title} – photo ${index + 1}`}
              width="1200"
              height="900"
              eager
              onClick={() => list[index] && setLightboxOpen(true)}
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow--prev"
              aria-label="Previous photo"
              onClick={prev}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow--next"
              aria-label="Next photo"
              onClick={next}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {list[index] && (
          <button
            type="button"
            className="gallery-expand-btn"
            aria-label="Open full-screen photo viewer"
            onClick={() => setLightboxOpen(true)}
          >
            <Expand size={15} />
          </button>
        )}

        {hasMultiple && (
          <span className="gallery-counter tabular" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
          </span>
        )}
      </div>

      {hasMultiple && (
        <ul className="gallery-thumbs" aria-label="Property photos">
          {list.map((src, i) => (
            <li key={src || i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
              >
                <SmartImage src={src} alt="" width="160" height="120" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {lightboxOpen && list[index] && (
          <motion.div
            className="lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo viewer`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setLightboxOpen(false)}
          >
            <div
              className="lightbox-stage"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox-close"
                aria-label="Close photo viewer"
                onClick={() => setLightboxOpen(false)}
              >
                <X size={22} />
              </button>

              {hasMultiple && (
                <button
                  type="button"
                  className="lightbox-arrow lightbox-arrow--prev"
                  aria-label="Previous photo"
                  onClick={prev}
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <img
                src={list[index]}
                alt={`${title} – full view ${index + 1}`}
                className="lightbox-img"
              />

              {hasMultiple && (
                <button
                  type="button"
                  className="lightbox-arrow lightbox-arrow--next"
                  aria-label="Next photo"
                  onClick={next}
                >
                  <ChevronRight size={24} />
                </button>
              )}

              <div className="lightbox-caption tabular">
                <span>{title}</span>
                {hasMultiple && (
                  <span>
                    {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
