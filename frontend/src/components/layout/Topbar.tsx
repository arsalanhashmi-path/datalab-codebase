import { useEffect, useState } from 'react'

const INTERVAL = 30

export default function Topbar() {
  const [countdown, setCountdown] = useState(INTERVAL)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          setRefreshing(true)
          setTimeout(() => setRefreshing(false), 1000)
          return INTERVAL
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-brand-500 font-display text-xl font-bold tracking-tight">
          Datalab
        </span>
        <span className="text-gray-400 text-sm">/ Dawn News Intelligence Platform</span>
      </div>
      <div className="flex items-center gap-3">
        {refreshing && (
          <span
            className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"
            title="Refreshing..."
          />
        )}
        <span className="text-xs text-gray-500 font-mono">
          Next refresh in{' '}
          <span className="text-brand-600 font-semibold">{countdown}s</span>
        </span>
      </div>
    </header>
  )
}
