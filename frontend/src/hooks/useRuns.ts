import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import { useSource } from '../contexts/SourceContext'
import type { ScrapeRun } from '../types'

export function useRuns(limit = 25) {
  const { source } = useSource()
  const [runs, setRuns] = useState<ScrapeRun[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('scrape_runs')
      .select('*').eq('source', source)
      .order('started_at', { ascending: false }).limit(limit)
    setRuns(data ?? [])
    setLoading(false)
  }, [source, limit])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { runs, loading }
}
