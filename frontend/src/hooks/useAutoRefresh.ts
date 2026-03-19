import { useEffect, useRef } from 'react'
import { useRefresh } from '../contexts/RefreshContext'

export function useAutoRefresh(refetch: () => void) {
  const { tick } = useRefresh()
  const fn = useRef(refetch)
  fn.current = refetch

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    fn.current()
  }, [tick])
}
