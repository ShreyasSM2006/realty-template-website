import { useState } from 'react'
import SmartImage from '../common/SmartImage.jsx'

export default function PropertyGallery({ images = [], title }) {
  const [index, setIndex] = useState(0)
  const list = images.length ? images : [null]
  return (
    <div className="gallery">
      <SmartImage className="gallery-main" src={list[index]} alt={`${title} – photo ${index + 1}`} width="1200" height="800" eager />
      {list.length > 1 && (
        <ul className="gallery-thumbs" aria-label="Property photos">
          {list.map((src, i) => (
            <li key={src || i}>
              <button type="button" onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index}>
                <SmartImage src={src} alt="" width="160" height="120" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
