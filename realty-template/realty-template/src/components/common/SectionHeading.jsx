export default function SectionHeading({ eyebrow, title, intro, as: Tag = 'h2' }) {
  return (
    <header className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag>{title}</Tag>
      {intro && <p className="muted">{intro}</p>}
    </header>
  )
}
