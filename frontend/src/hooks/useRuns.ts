import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import type { ScrapeRun } from '../types'

export function useRuns(limit = 25) {
  const [runs, setRuns] = useState<ScrapeRun[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('scrape_runs')
      .select('*').eq('source', 'dawn')
      .order('started_at', { ascending: false }).limit(limit)
    setRuns(data ?? [])
    setLoading(false)
  }, [limit])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { runs, loading }
}
