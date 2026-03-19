import { useState, useMemo } from 'react'
import { useArticles } from '../hooks/useArticles'
import { useSections } from '../hooks/useSections'
import SectionPill from '../components/ui/SectionPill'
import Pagination from '../components/ui/Pagination'
import { useSource } from '../contexts/SourceContext'
import { getSourceConfig } from '../config/sources'

export default function Articles() {
  const { source } = useSource()
  const cfg = getSourceConfig(source)
  const [query, setQuery] = useState('')
  const [section, setSection] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const filters = useMemo(
    () => ({ query, section, page, pageSize: PAGE_SIZE }),
    [query, section, page]
  )

  const { articles, total, loading } = useArticles(filters)
  const { sections } = useSections()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Articles</h1>
        <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} articles from {cfg.label}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search headlines…"
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 w-64 bg-white"
        />
        <select
          value={section}
          onChange={e => { setSection(e.target.value); setPage(1) }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All sections</option>
          {sections.map(s => (
            <option key={s.section} value={s.section ?? ''}>{s.section ?? '(none)'}</option>
          ))}
        </select>
      </div>

      {/* Article list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {loading && (
          <div className="px-6 py-10 text-center text-gray-400">Loading…</div>
        )}
        {!loading && articles.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-400">No articles found</div>
        )}
        {articles.map(article => (
          <div key={article.id} className="px-5 py-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <SectionPill section={article.section} />
                  {article.article_id && (
                    <span className="text-xs font-mono text-gray-400">#{article.article_id}</span>
                  )}
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-900 hover:text-brand-600 line-clamp-2"
                >
                  {article.headline ?? '(no headline)'}
                </a>
                {article.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {article.author && <span>{article.author}</span>}
                  {article.published_at && (
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  )
}
