import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'

export function useMetrics() {
  const [data, setData] = useState({
    total: 0, today: 0, successRate: 0, gapsFilled: 0
  })
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalRes, todayRes, runsRes] = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('source', 'dawn'),
      supabase.from('articles').select('*', { count: 'exact', head: true })
        .eq('source', 'dawn').gte('scraped_at', today.toISOString()),
      supabase.from('scrape_runs').select('status, articles_new, mode')
        .eq('source', 'dawn').gte('started_at', today.toISOString()),
    ])

    const runs = runsRes.data ?? []
    const total = runs.length
    const successes = runs.filter(r => r.status === 'success').length
    const gapsFilled = runs
      .filter(r => r.mode === 'sequential')
      .reduce((sum, r) => sum + (r.articles_new ?? 0), 0)

    setData({
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
      successRate: total > 0 ? Math.round((successes / total) * 100) : 0,
      gapsFilled,
    })
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { data, loading }
}
