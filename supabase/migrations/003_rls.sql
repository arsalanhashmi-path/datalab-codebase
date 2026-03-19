-- 003_rls.sql

ALTER TABLE articles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_runs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_checkpoints ENABLE ROW LEVEL SECURITY;

-- Frontend can read everything, write nothing
CREATE POLICY "anon read articles"
    ON articles FOR SELECT TO anon USING (true);

CREATE POLICY "anon read runs"
    ON scrape_runs FOR SELECT TO anon USING (true);

CREATE POLICY "anon read checkpoints"
    ON scrape_checkpoints FOR SELECT TO anon USING (true);

-- Service role (used by scraper) can do everything
CREATE POLICY "service all articles"
    ON articles FOR ALL TO service_role USING (true);

CREATE POLICY "service all runs"
    ON scrape_runs FOR ALL TO service_role USING (true);

CREATE POLICY "service all checkpoints"
    ON scrape_checkpoints FOR ALL TO service_role USING (true);
