import { useRuns } from '../../hooks/useRuns'
import type { ScrapeRun } from '../../types'

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60)  return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function duration(run: ScrapeRun): string {
  if (!run.finished_at) return ''
  const ms = new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()
  const s = Math.round(ms / 1000)
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${s % 60 > 0 ? ` ${s % 60}s` : ''}`
}

const STATUS_STYLE: Record<string, { dot: string; badge: string }> = {
  success: { dot: 'bg-brand-500',  badge: 'bg-brand-50  text-brand-700  border-brand-200' },
  partial: { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  failed:  { dot: 'bg-red-400',    badge: 'bg-red-50    text-red-700    border-red-200'    },
  running: { dot: 'bg-blue-400 animate-pulse', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
}

export default function LiveLog({ limit = 20 }: { limit?: number }) {
  const { runs, loading } = useRuns(limit)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-semibold text-gray-700">Live Activity</h3>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          auto-refresh 30s
        </span>
      </div>

      <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
        {loading && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading…</div>
        )}
        {!loading && runs.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No activity yet</div>
        )}

        {runs.map((run, i) => {
          const style = STATUS_STYLE[run.status] ?? STATUS_STYLE.failed
          const dur = duration(run)

          return (
            <div
              key={run.id}
              className={`px-5 py-3 flex items-start gap-3 hover:bg-gray-50/70 transition-colors ${i === 0 && run.status === 'running' ? 'bg-blue-50/40' : ''}`}
            >
              {/* Status dot */}
              <span className={`mt-2 h-2 w-2 rounded-full shrink-0 ${style.dot}`} />

              <div className="flex-1 min-w-0">
                {/* Top row: time + badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-gray-400 tabular-nums">
                    {relativeTime(run.started_at)}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    {run.mode}
                  </span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border ${style.badge}`}>
                    {run.status}
                  </span>
                  {dur && (
                    <span className="text-xs text-gray-400 font-mono">{dur}</span>
                  )}
                </div>

                {/* Bottom row: stats */}
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">
                    Found{' '}
                    <span className="font-mono font-semibold text-gray-700">{run.articles_found}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    New{' '}
                    <span className="font-mono font-semibold text-brand-600">{run.articles_new}</span>
                  </span>
                  {run.articles_failed > 0 && (
                    <span className="text-xs text-gray-500">
                      Failed{' '}
                      <span className="font-mono font-semibold text-red-500">{run.articles_failed}</span>
                    </span>
                  )}
                  {run.status === 'running' && (
                    <span className="text-xs text-blue-500 font-medium animate-pulse">in progress…</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
