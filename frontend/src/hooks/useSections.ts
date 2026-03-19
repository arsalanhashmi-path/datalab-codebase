import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import { useSource } from '../contexts/SourceContext'

export interface SectionStat {
  section: string
  count: number
  latest_published_at: string | null
}

export function useSections() {
  const { source } = useSource()
  const [sections, setSections] = useState<SectionStat[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.rpc('articles_by_section', { p_source: source })
    setSections(data ?? [])
    setLoading(false)
  }, [source])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { sections, loading }
}
