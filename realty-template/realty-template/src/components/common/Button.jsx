import { Link } from 'react-router-dom'

/** Renders a router Link, external anchor or button depending on props. */
export default function Button({ to, href, variant = 'primary', children, className = '', ...rest }) {
  const cls = `btn btn-${variant} ${className}`.trim()
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    )
  }
  return <button type="button" className={cls} {...rest}>{children}</button>
}
