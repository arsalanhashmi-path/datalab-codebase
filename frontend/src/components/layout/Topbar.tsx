import { useRefresh } from '../../contexts/RefreshContext'

export default function Topbar() {
  const { countdown } = useRefresh()

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-brand-500 font-display text-xl font-bold tracking-tight">
          Datalab
        </span>
        <span className="text-gray-400 text-sm">/ Dawn News Intelligence Platform</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 font-mono">
          Next refresh in{' '}
          <span className="text-brand-600 font-semibold">{countdown}s</span>
        </span>
      </div>
    </header>
  )
}
