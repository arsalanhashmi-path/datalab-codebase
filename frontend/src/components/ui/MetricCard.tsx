interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export default function MetricCard({ label, value, sub, accent }: MetricCardProps) {
  return (
    <div className={`rounded-xl border p-5 bg-white shadow-sm ${accent ? 'border-brand-200' : 'border-gray-200'}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`mt-2 text-3xl font-bold font-mono ${accent ? 'text-brand-600' : 'text-gray-900'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}
