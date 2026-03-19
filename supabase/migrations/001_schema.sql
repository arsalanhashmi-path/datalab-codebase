-- 001_schema.sql

CREATE TABLE articles (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source          TEXT NOT NULL,
    article_id      TEXT,
    url             TEXT NOT NULL,
    headline        TEXT,
    description     TEXT,
    body_text       TEXT,
    body_html       TEXT,
    author          TEXT,
    author_url      TEXT,
    section         TEXT,
    image_url       TEXT,
    published_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ,
    scraped_at      TIMESTAMPTZ DEFAULT now(),
    scrape_version  INTEGER DEFAULT 1,
    CONSTRAINT articles_url_unique UNIQUE (url)
);

CREATE INDEX idx_articles_source       ON articles(source);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_section      ON articles(section);
CREATE INDEX idx_articles_article_id   ON articles(source, article_id);

ALTER TABLE articles
    ADD COLUMN fts tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english',
            coalesce(headline, '') || ' ' || coalesce(body_text, ''))
    ) STORED;

CREATE INDEX idx_articles_fts ON articles USING GIN(fts);

CREATE TABLE scrape_runs (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source           TEXT NOT NULL,
    mode             TEXT NOT NULL,   -- 'rss' | 'sequential'
    started_at       TIMESTAMPTZ DEFAULT now(),
    finished_at      TIMESTAMPTZ,
    articles_found   INTEGER DEFAULT 0,
    articles_new     INTEGER DEFAULT 0,
    articles_failed  INTEGER DEFAULT 0,
    last_id          TEXT,
    status           TEXT DEFAULT 'running',  -- running | success | partial | failed
    error            TEXT
);

CREATE INDEX idx_runs_source     ON scrape_runs(source);
CREATE INDEX idx_runs_started_at ON scrape_runs(started_at DESC);

CREATE TABLE scrape_checkpoints (
    source      TEXT PRIMARY KEY,
    last_id     INTEGER,
    last_url    TEXT,
    updated_at  TIMESTAMPTZ DEFAULT now()
);
