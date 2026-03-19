-- 002_functions.sql

-- Articles per day for the last N days
CREATE OR REPLACE FUNCTION articles_per_day(p_source text, p_days int)
RETURNS TABLE(day date, count bigint) AS $$
    SELECT DATE(scraped_at) AS day, COUNT(*) AS count
    FROM articles
    WHERE source = p_source
      AND scraped_at >= now() - (p_days || ' days')::interval
    GROUP BY day
    ORDER BY day;
$$ LANGUAGE sql STABLE;

-- Articles per hour for today
CREATE OR REPLACE FUNCTION articles_per_hour(p_source text)
RETURNS TABLE(hour int, count bigint) AS $$
    SELECT EXTRACT(HOUR FROM scraped_at)::int AS hour, COUNT(*) AS count
    FROM articles
    WHERE source = p_source
      AND DATE(scraped_at) = CURRENT_DATE
    GROUP BY hour
    ORDER BY hour;
$$ LANGUAGE sql STABLE;

-- Article count by section
CREATE OR REPLACE FUNCTION articles_by_section(p_source text)
RETURNS TABLE(section text, count bigint, latest_published_at timestamptz) AS $$
    SELECT section, COUNT(*) AS count, MAX(published_at) AS latest_published_at
    FROM articles
    WHERE source = p_source
    GROUP BY section
    ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- Request outcome summary for the last N hours
CREATE OR REPLACE FUNCTION run_outcomes(p_source text, p_hours int)
RETURNS TABLE(status text, count bigint) AS $$
    SELECT status, COUNT(*) AS count
    FROM scrape_runs
    WHERE source = p_source
      AND started_at >= now() - (p_hours || ' hours')::interval
    GROUP BY status;
$$ LANGUAGE sql STABLE;

-- ID coverage for the last N IDs
CREATE OR REPLACE FUNCTION id_coverage(p_source text, p_limit int)
RETURNS TABLE(article_id text) AS $$
    SELECT article_id
    FROM articles
    WHERE source = p_source
      AND article_id IS NOT NULL
    ORDER BY article_id::int DESC
    LIMIT p_limit;
$$ LANGUAGE sql STABLE;
