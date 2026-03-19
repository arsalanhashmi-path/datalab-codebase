export interface Article {
  id: string
  source: string
  article_id: string | null
  url: string
  headline: string | null
  description: string | null
  author: string | null
  author_url: string | null
  section: string | null
  image_url: string | null
  published_at: string | null
  updated_at: string | null
  scraped_at: string
}

export interface ScrapeRun {
  id: string
  source: string
  mode: 'rss' | 'sequential'
  started_at: string
  finished_at: string | null
  articles_found: number
  articles_new: number
  articles_failed: number
  last_id: string | null
  status: 'running' | 'success' | 'partial' | 'failed'
  error: string | null
}

export interface Checkpoint {
  source: string
  last_id: number
  last_url: string | null
  updated_at: string
}
