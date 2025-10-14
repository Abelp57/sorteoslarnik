type Props = { status?: string | null }

export default function StatusBadge({ status }: Props) {
  const s = (status || '').toUpperCase()
  const color =
    s === 'PUBLISHED' ? 'badge-success' :
    s === 'CLOSED' ? 'badge-error' :
    s === 'DRAFT' ? 'badge-neutral' :
    'badge-ghost'
  return <span className={`badge ${color} text-xs`}>{s || 'SIN ESTADO'}</span>
}


