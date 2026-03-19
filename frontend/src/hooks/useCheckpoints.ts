import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import type { Checkpoint } from '../types'

export function useCheckpoints() {
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null)
  const [maxLiveId, setMaxLiveId] = useState<number | null>(null)
  const [coverage, setCoverage] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const [cpRes, coverageRes, maxRes] = await Promise.all([
      supabase.from('scrape_checkpoints').select('*').eq('source', 'dawn').single(),
      supabase.rpc('id_coverage', { p_source: 'dawn', p_limit: 500 }),
      supabase.from('articles').select('article_id').eq('source', 'dawn')
        .order('article_id', { ascending: false }).limit(1),
    ])

    setCheckpoint(cpRes.data)
    setCoverage((coverageRes.data ?? []).map((r: { article_id: string }) => r.article_id))
    setMaxLiveId(maxRes.data?.[0]?.article_id ? parseInt(maxRes.data[0].article_id) : null)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { checkpoint, maxLiveId, coverage, loading }
}
