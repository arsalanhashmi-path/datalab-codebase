import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'

export interface SectionStat {
  section: string
  count: number
  latest_published_at: string | null
}

export function useSections() {
  const [sections, setSections] = useState<SectionStat[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.rpc('articles_by_section', { p_source: 'dawn' })
    setSections(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { sections, loading }
}
