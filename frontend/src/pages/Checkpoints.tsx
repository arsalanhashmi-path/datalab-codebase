import { useCheckpoints } from '../hooks/useCheckpoints'
import { useRuns } from '../hooks/useRuns'
import CoverageSparkline from '../components/charts/CoverageSparkline'

export default function Checkpoints() {
  const { checkpoint, maxLiveId, coverage, loading } = useCheckpoints()
  const { runs } = useRuns(50)

  const lastRss = runs.find(r => r.mode === 'rss')
  const lastSeq = runs.find(r => r.mode === 'sequential')
  const gapRemaining = maxLiveId && checkpoint ? maxLiveId - checkpoint.last_id : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Checkpoints</h1>
        <p className="text-gray-500 text-sm mt-1">Scraper state and ID coverage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RSS state */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">RSS Scraper</h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-brand-600">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Active
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500">Last run</dt>
              <dd className="font-mono mt-0.5 text-gray-800">
                {lastRss ? new Date(lastRss.started_at).toLocaleString() : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Status</dt>
              <dd className="mt-0.5">
                {lastRss
                  ? <span className={`text-sm font-medium ${lastRss.status === 'success' ? 'text-brand-600' : 'text-red-500'}`}>{lastRss.status}</span>
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Feeds</dt>
              <dd className="font-mono mt-0.5 text-gray-800">5</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">New (last run)</dt>
              <dd className="font-mono mt-0.5 text-gray-800">{lastRss?.articles_new ?? '—'}</dd>
            </div>
          </dl>
        </div>

        {/* Sequential state */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Sequential Scraper</h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-brand-600">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Active
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500">Last checkpoint ID</dt>
              <dd className="font-mono mt-0.5 text-gray-800">
                {loading ? '…' : (checkpoint?.last_id?.toLocaleString() ?? '—')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Max live ID</dt>
              <dd className="font-mono mt-0.5 text-gray-800">
                {loading ? '…' : (maxLiveId?.toLocaleString() ?? '—')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Gap remaining</dt>
              <dd className={`font-mono mt-0.5 ${gapRemaining && gapRemaining > 1000 ? 'text-yellow-600' : 'text-brand-600'}`}>
                {loading ? '…' : (gapRemaining !== null ? gapRemaining.toLocaleString() : '—')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Last run</dt>
              <dd className="font-mono mt-0.5 text-gray-800">
                {lastSeq ? new Date(lastSeq.started_at).toLocaleString() : '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Coverage sparkline */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">ID Coverage — Last 500 IDs</h2>
        {loading
          ? <p className="text-gray-400 text-sm">Loading…</p>
          : <CoverageSparkline coverage={coverage} maxId={maxLiveId} />}
      </div>
    </div>
  )
}
