import { useMeta } from '../utils/useMeta.js'
import EmptyState from '../components/common/EmptyState.jsx'

export default function NotFoundPage({ title = 'Page not found', message = 'The page you are looking for does not exist.' }) {
  useMeta({ title })
  return (
    <section className="section">
      <div className="container">
        <EmptyState title={title} message={message} actionLabel="Back to home" actionTo="/" />
      </div>
    </section>
  )
}
