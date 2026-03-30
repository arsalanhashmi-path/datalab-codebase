-- 004_tribune.sql

CREATE TABLE tribune_articles (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source          TEXT NOT NULL DEFAULT 'tribune',
    article_id      TEXT,
    url             TEXT NOT NULL,
    headline        TEXT,
    description     TEXT,
    body_text       TEXT,
    body_html       TEXT,
    author          TEXT,
    section         TEXT,
    image_url       TEXT,
    published_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ,
    scraped_at      TIMESTAMPTZ DEFAULT now(),
    scrape_version  INTEGER DEFAULT 1,
    CONSTRAINT tribune_articles_url_unique UNIQUE (url)
);

CREATE INDEX idx_tribune_articles_published_at ON tribune_articles(published_at DESC);
CREATE INDEX idx_tribune_articles_section      ON tribune_articles(section);
CREATE INDEX idx_tribune_articles_article_id   ON tribune_articles(article_id);

ALTER TABLE tribune_articles
    ADD COLUMN fts tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english',
            coalesce(headline, '') || ' ' || coalesce(body_text, ''))
    ) STORED;

CREATE INDEX idx_tribune_articles_fts ON tribune_articles USING GIN(fts);

ALTER TABLE tribune_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon read tribune_articles"
    ON tribune_articles FOR SELECT TO anon USING (true);

CREATE POLICY "service all tribune_articles"
    ON tribune_articles FOR ALL TO service_role USING (true);
