import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import { useSource } from '../contexts/SourceContext'

export function useMetrics() {
  const { source } = useSource()
  const [data, setData] = useState({
    total: 0, today: 0, lastHour: 0, runsToday: 0, successRate: 0, gapsFilled: 0,
    earliestPublished: null as string | null,
    latestPublished: null as string | null,
  })
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const oneHourAgo = new Date(Date.now() - 3_600_000)

    const [totalRes, todayRes, lastHourRes, runsRes, earliestRes, latestRes] = await Promise.all([
      supabase.from('all_articles').select('*', { count: 'exact', head: true }).eq('source', source),
      supabase.from('all_articles').select('*', { count: 'exact', head: true })
        .eq('source', source).gte('scraped_at', today.toISOString()),
      supabase.from('all_articles').select('*', { count: 'exact', head: true })
        .eq('source', source).gte('scraped_at', oneHourAgo.toISOString()),
      supabase.from('scrape_runs').select('status, articles_new, mode')
        .eq('source', source).gte('started_at', today.toISOString()),
      supabase.from('all_articles').select('published_at').eq('source', source)
        .not('published_at', 'is', null).order('published_at', { ascending: true }).limit(1),
      supabase.from('all_articles').select('published_at').eq('source', source)
        .not('published_at', 'is', null).order('published_at', { ascending: false }).limit(1),
    ])

    const runs = runsRes.data ?? []
    const successes = runs.filter(r => r.status === 'success').length
    const gapsFilled = runs
      .filter(r => r.mode === 'sequential')
      .reduce((sum, r) => sum + (r.articles_new ?? 0), 0)

    setData({
      total:           totalRes.count ?? 0,
      today:           todayRes.count ?? 0,
      lastHour:        lastHourRes.count ?? 0,
      runsToday:       runs.length,
      successRate:     runs.length > 0 ? Math.round((successes / runs.length) * 100) : 0,
      gapsFilled,
      earliestPublished: (earliestRes.data?.[0]?.published_at as string | undefined) ?? null,
      latestPublished:   (latestRes.data?.[0]?.published_at as string | undefined) ?? null,
    })
    setLoading(false)
  }, [source])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { data, loading }
}
