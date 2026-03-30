import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAutoRefresh } from './useAutoRefresh'
import { useSource } from '../contexts/SourceContext'
import type { Article } from '../types'

interface Filters {
  query: string
  section: string
  page: number
  pageSize: number
}

export function useArticles(filters: Filters) {
  const { source } = useSource()
  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { query, section, page, pageSize } = filters
    const start = (page - 1) * pageSize

    let q = supabase.from('all_articles')
      .select('id, article_id, url, headline, description, author, section, published_at', { count: 'exact' })
      .eq('source', source)
      .order('published_at', { ascending: false })
      .range(start, start + pageSize - 1)

    if (query) q = q.ilike('headline', `%${query}%`)
    if (section) q = q.eq('section', section)

    const { data, count } = await q
    setArticles((data as Article[]) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [filters, source])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh(fetch)

  return { articles, total, loading }
}
