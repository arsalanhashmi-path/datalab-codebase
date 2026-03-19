import MetricCard from '../components/ui/MetricCard'
import StatusBadge from '../components/ui/StatusBadge'
import WeeklyBarChart from '../components/charts/WeeklyBarChart'
import HourlyLineChart from '../components/charts/HourlyLineChart'
import StatusDonut from '../components/charts/StatusDonut'
import SectionBarChart from '../components/charts/SectionBarChart'
import { useMetrics } from '../hooks/useMetrics'
import { useRuns } from '../hooks/useRuns'
import { useSections } from '../hooks/useSections'

export default function Overview() {
  const { data, loading } = useMetrics()
  const { runs } = useRuns(1)
  const { sections } = useSections()
  const lastRun = runs[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Dawn.com intelligence — live stats</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Articles" value={loading ? '…' : data.total} accent />
        <MetricCard label="New Today" value={loading ? '…' : data.today} />
        <MetricCard label="Success Rate" value={loading ? '…' : `${data.successRate}%`} sub="runs today" />
        <MetricCard label="Gaps Filled" value={loading ? '…' : data.gapsFilled} sub="sequential today" />
      </div>

      {/* Last run banner */}
      {lastRun && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Run</p>
            <div className="flex items-center gap-3">
              <StatusBadge status={lastRun.status} />
              <span className="text-sm font-mono text-gray-700">{lastRun.mode}</span>
              <span className="text-sm text-gray-500">
                {new Date(lastRun.started_at).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="ml-auto flex gap-6 text-center">
            {[
              { label: 'Found', val: lastRun.articles_found },
              { label: 'New', val: lastRun.articles_new },
              { label: 'Failed', val: lastRun.articles_failed },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-lg font-mono font-bold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  )
}
