import MetricCard from '../components/ui/MetricCard'
import StatusBadge from '../components/ui/StatusBadge'
import LiveLog from '../components/ui/LiveLog'
import RecentArticlesLog from '../components/ui/RecentArticlesLog'
import WeeklyBarChart from '../components/charts/WeeklyBarChart'
import HourlyLineChart from '../components/charts/HourlyLineChart'
import StatusDonut from '../components/charts/StatusDonut'
import SectionBarChart from '../components/charts/SectionBarChart'
import { useMetrics } from '../hooks/useMetrics'
import { useRuns } from '../hooks/useRuns'
import { useSections } from '../hooks/useSections'
import { useSource } from '../contexts/SourceContext'
import { getSourceConfig } from '../config/sources'

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Overview() {
  const { source } = useSource()
  const cfg = getSourceConfig(source)
  const { data, loading } = useMetrics()
  const { runs } = useRuns(3)
  const { sections } = useSections()
  const lastRun = runs[0]
  const lastRss = runs.find(r => r.mode === 'rss')
  const lastSeq = runs.find(r => r.mode === 'sequential')

  return (
    <div className="space-y-6">

      {/* Source hero */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-5">
        <div className="text-4xl leading-none">{cfg.flag}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-gray-900">{cfg.label}</h1>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {cfg.domain}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              live
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{cfg.description}</p>
        </div>
        {lastRun && (
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Last activity</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{timeSince(lastRun.started_at)}</p>
            <StatusBadge status={lastRun.status} />
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard label="Total Articles" value={loading ? '…' : data.total} accent />
        <MetricCard label="New Today" value={loading ? '…' : data.today} sub="scraped_at today" />
        <MetricCard label="Last Hour" value={loading ? '…' : data.lastHour} sub="articles ingested" />
        <MetricCard label="Runs Today" value={loading ? '…' : data.runsToday} sub="all modes" />
        <MetricCard label="Success Rate" value={loading ? '…' : `${data.successRate}%`} sub="runs today" />
        <MetricCard label="Gaps Filled" value={loading ? '…' : data.gapsFilled} sub="sequential today" />
      </div>

      {/* Date range */}
      {!loading && data.earliestPublished && data.latestPublished && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3 flex items-center gap-3 text-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">Published range</span>
          <span className="font-mono font-medium text-gray-800">{fmtDate(data.earliestPublished)}</span>
          <span className="text-gray-300">→</span>
          <span className="font-mono font-medium text-gray-800">{fmtDate(data.latestPublished)}</span>
          <span className="ml-auto text-xs text-gray-400 font-mono">
            {Math.round((new Date(data.latestPublished).getTime() - new Date(data.earliestPublished).getTime()) / 86_400_000)} days
          </span>
        </div>
      )}

      {/* Scraper health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RSS health */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RSS Scraper</span>
              {lastRss && <StatusBadge status={lastRss.status} />}
            </div>
            <div className="flex items-center gap-5 text-sm text-gray-600">
              <span>
                Last run:{' '}
                <span className="font-medium text-gray-800">
                  {lastRss ? timeSince(lastRss.started_at) : '—'}
                </span>
              </span>
              <span>
                New:{' '}
                <span className="font-mono font-semibold text-brand-600">
                  {lastRss?.articles_new ?? '—'}
                </span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-gray-900">{lastRss?.articles_found ?? '—'}</p>
            <p className="text-xs text-gray-400">found</p>
          </div>
        </div>

        {/* Sequential health */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sequential Scraper</span>
              {lastSeq && <StatusBadge status={lastSeq.status} />}
            </div>
            <div className="flex items-center gap-5 text-sm text-gray-600">
              <span>
                Last run:{' '}
                <span className="font-medium text-gray-800">
                  {lastSeq ? timeSince(lastSeq.started_at) : '—'}
                </span>
              </span>
              <span>
                Filled:{' '}
                <span className="font-mono font-semibold text-brand-600">
                  {lastSeq?.articles_new ?? '—'}
                </span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-gray-900">{lastSeq?.articles_found ?? '—'}</p>
            <p className="text-xs text-gray-400">found</p>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyBarChart />
        <HourlyLineChart />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusDonut />
        <SectionBarChart sections={sections} />
      </div>

      {/* Recent articles + live activity log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentArticlesLog limit={10} />
        <LiveLog limit={25} />
      </div>
    </div>
  )
}
