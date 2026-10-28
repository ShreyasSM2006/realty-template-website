import Button from './Button.jsx'

export default function EmptyState({ title, message, actionLabel, onAction, actionTo }) {
  return (
    <div className="empty-state" role="status">
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      {actionLabel && (actionTo ? <Button to={actionTo}>{actionLabel}</Button> : <Button onClick={onAction}>{actionLabel}</Button>)}
    </div>
  )
}
