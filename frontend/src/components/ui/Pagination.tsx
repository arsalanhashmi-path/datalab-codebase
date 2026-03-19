interface PaginationProps {
  page: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

export default function Pagination({ page, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
      >
        ← Prev
      </button>
      <span className="text-sm text-gray-600">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
      >
        Next →
      </button>
    </div>
  )
}
