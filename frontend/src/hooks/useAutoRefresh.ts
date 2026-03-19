import { useEffect, useRef } from 'react'

const INTERVAL_MS = 30_000

export function useAutoRefresh(refetch: () => void) {
  const fn = useRef(refetch)
  fn.current = refetch

  useEffect(() => {
    const id = setInterval(() => fn.current(), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])
}
