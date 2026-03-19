type Status = 'running' | 'success' | 'partial' | 'failed'

const styles: Record<Status, string> = {
  running: 'bg-blue-100 text-blue-700',
  success: 'bg-brand-100 text-brand-700',
  partial: 'bg-yellow-100 text-yellow-700',
  failed:  'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
