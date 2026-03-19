import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import { useSource } from '../contexts/SourceContext'
import type { Article } from '../types'

export function useRecentArticles(limit = 10) {
  const { source } = useSource()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('articles')
      .select('id, url, headline, section, scraped_at, article_id')
      .eq('source', source)
      .order('scraped_at', { ascending: false })
      .limit(limit)
    setArticles((data as Article[]) ?? [])
    setLoading(false)
  }, [source, limit])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { articles, loading }
}
