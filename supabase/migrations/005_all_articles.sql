-- 005_all_articles.sql
-- Unified view across all source-specific article tables.
-- The frontend queries this view; scrapers write to source tables directly.

CREATE VIEW all_articles AS
    SELECT
        id, source, article_id, url, headline, description,
        body_text, body_html, author, author_url, section,
        image_url, published_at, updated_at, scraped_at, scrape_version
    FROM articles
    UNION ALL
    SELECT
        id, source, article_id, url, headline, description,
        body_text, body_html, author, NULL AS author_url, section,
        image_url, published_at, updated_at, scraped_at, scrape_version
    FROM tribune_articles;

-- Update RPCs to use the unified view so all sources are covered.

CREATE OR REPLACE FUNCTION articles_per_day(p_source text, p_days int)
RETURNS TABLE(day date, count bigint) AS $$
    SELECT DATE(scraped_at) AS day, COUNT(*) AS count
    FROM all_articles
    WHERE source = p_source
      AND scraped_at >= now() - (p_days || ' days')::interval
    GROUP BY day
    ORDER BY day;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION articles_per_hour(p_source text)
RETURNS TABLE(hour int, count bigint) AS $$
    SELECT EXTRACT(HOUR FROM scraped_at)::int AS hour, COUNT(*) AS count
    FROM all_articles
    WHERE source = p_source
      AND DATE(scraped_at) = CURRENT_DATE
    GROUP BY hour
    ORDER BY hour;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION articles_by_section(p_source text)
RETURNS TABLE(section text, count bigint, latest_published_at timestamptz) AS $$
    SELECT section, COUNT(*) AS count, MAX(published_at) AS latest_published_at
    FROM all_articles
    WHERE source = p_source
    GROUP BY section
    ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION id_coverage(p_source text, p_limit int)
RETURNS TABLE(article_id text) AS $$
    SELECT article_id
    FROM all_articles
    WHERE source = p_source
      AND article_id IS NOT NULL
    ORDER BY article_id::int DESC
    LIMIT p_limit;
$$ LANGUAGE sql STABLE;
