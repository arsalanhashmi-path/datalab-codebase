import { useState } from 'react'
import { useRuns } from '../hooks/useRuns'
import StatusBadge from '../components/ui/StatusBadge'
import Pagination from '../components/ui/Pagination'
import { useSource } from '../contexts/SourceContext'
import { getSourceConfig } from '../config/sources'
import type { ScrapeRun } from '../types'

function duration(run: ScrapeRun): string {
  if (!run.finished_at) return '—'
  const ms = new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export default function RunLog() {
  const { source } = useSource()
  const cfg = getSourceConfig(source)
  const { runs, loading } = useRuns(200)
  const [statusFilter, setStatusFilter] = useState('')
  const [modeFilter, setModeFilter] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  const filtered = runs.filter(r =>
    (statusFilter === '' || r.status === statusFilter) &&
    (modeFilter === '' || r.mode === modeFilter)
  )
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Run Log</h1>
        <p className="text-gray-500 text-sm mt-1">All scrape runs for {cfg.label}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="partial">Partial</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>
        <select
          value={modeFilter}
          onChange={e => { setModeFilter(e.target.value); setPage(1) }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All modes</option>
          <option value="rss">RSS</option>
          <option value="sequential">Sequential</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Started', 'Mode', 'Found', 'New', 'Failed', 'Duration', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {!loading && paged.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No runs found</td></tr>
            )}
            {paged.map(run => (
              <tr key={run.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                  {new Date(run.started_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {run.mode}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{run.articles_found}</td>
                <td className="px-4 py-3 font-mono text-brand-600 font-semibold">{run.articles_new}</td>
                <td className="px-4 py-3 font-mono text-red-500">{run.articles_failed}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{duration(run)}</td>
                <td className="px-4 py-3"><StatusBadge status={run.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  )
}
