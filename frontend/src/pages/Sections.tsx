import { useSections } from '../hooks/useSections'
import SectionBarChart from '../components/charts/SectionBarChart'

export default function Sections() {
  const { sections, loading } = useSections()
  const total = sections.reduce((s, r) => s + r.count, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">By Section</h1>
        <p className="text-gray-500 text-sm mt-1">Article distribution across Dawn sections</p>
      </div>

      <SectionBarChart sections={sections} />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Sections</p>
          <p className="text-3xl font-mono font-bold text-gray-900 mt-1">{sections.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Articles</p>
          <p className="text-3xl font-mono font-bold text-brand-600 mt-1">{total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg / Section</p>
          <p className="text-3xl font-mono font-bold text-gray-900 mt-1">
            {sections.length > 0 ? Math.round(total / sections.length).toLocaleString() : '—'}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Section', 'Articles', '% of Total', 'Latest Article'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {sections.map(s => (
              <tr key={s.section} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{s.section ?? '(none)'}</td>
                <td className="px-4 py-3 font-mono">{s.count.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-24">
                      <div
                        className="bg-brand-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round((s.count / total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {total > 0 ? Math.round((s.count / total) * 100) : 0}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                  {s.latest_published_at
                    ? new Date(s.latest_published_at).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
