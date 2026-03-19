-- seed.sql
-- Optional: insert a checkpoint seed so sequential scraper has a known start point.
-- Replace 1234567 with an actual Dawn article ID to start from.

-- INSERT INTO scrape_checkpoints (source, last_id, updated_at)
-- VALUES ('dawn', 1234567, now())
-- ON CONFLICT (source) DO NOTHING;
