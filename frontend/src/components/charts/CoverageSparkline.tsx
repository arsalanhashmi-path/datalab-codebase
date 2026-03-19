interface Props {
  coverage: string[]
  maxId: number | null
}

export default function CoverageSparkline({ coverage, maxId }: Props) {
  if (!maxId || coverage.length === 0) {
    return <p className="text-gray-400 text-sm">No coverage data</p>
  }

  const covSet = new Set(coverage)
  const min = Math.min(...coverage.map(Number))
  const total = maxId - min + 1
  const cells = Array.from({ length: Math.min(total, 500) }, (_, i) => {
    const id = String(maxId - i)
    return covSet.has(id)
  })

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">
        ID coverage — last {coverage.length} scraped IDs
        <span className="ml-2 text-brand-600 font-semibold">
          {Math.round((coverage.length / Math.max(total, 1)) * 100)}% hit rate
        </span>
      </p>
      <div className="flex flex-wrap gap-0.5">
        {cells.map((hit, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-sm ${hit ? 'bg-brand-500' : 'bg-gray-200'}`}
            title={String(maxId - i)}
          />
        ))}
      </div>
    </div>
  )
}
