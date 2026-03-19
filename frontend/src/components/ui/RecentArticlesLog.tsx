import { useRecentArticles } from '../../hooks/useRecentArticles'

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60)  return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function RecentArticlesLog({ limit = 10 }: { limit?: number }) {
  const { articles, loading } = useRecentArticles(limit)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-semibold text-gray-700">Recent Articles</h3>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          last {limit} scraped
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {loading && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading…</div>
        )}
        {!loading && articles.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No articles yet</div>
        )}

        {articles.map((article, i) => (
          <div
            key={article.id}
            className={`px-5 py-3 flex items-start gap-3 hover:bg-gray-50/70 transition-colors ${i === 0 ? 'bg-brand-50/30' : ''}`}
          >
            {/* Index dot */}
            <span className="mt-1.5 text-xs font-mono text-gray-300 w-4 shrink-0 text-right">{i + 1}</span>

            <div className="flex-1 min-w-0">
              {/* Headline */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-800 hover:text-brand-600 transition-colors line-clamp-1 block"
                title={article.headline ?? article.url}
              >
                {article.headline ?? article.url}
              </a>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs font-mono text-gray-400 tabular-nums">
                  {relativeTime(article.scraped_at)}
                </span>
                {article.section && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                    {article.section}
                  </span>
                )}
                {article.article_id && (
                  <span className="text-xs font-mono text-gray-300">#{article.article_id}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
