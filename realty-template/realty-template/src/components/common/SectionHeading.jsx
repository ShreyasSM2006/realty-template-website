export default function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = 'h2',
  className = '',
  light = false,
}) {
  return (
    <header className={`section-heading ${className}`.trim()}>
      {eyebrow && (
        <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`.trim()}>{eyebrow}</p>
      )}
      <Tag>{title}</Tag>
      {intro && <p className="section-heading-intro">{intro}</p>}
    </header>
  )
}
