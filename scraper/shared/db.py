import os
from supabase import create_client, Client

_client: Client | None = None

def get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_KEY"],
        )
    return _client

def upsert_article(article: dict, table: str = "articles") -> bool:
    try:
        get_client().table(table).upsert(
            article, on_conflict="url"
        ).execute()
        return True
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"DB upsert failed: {e}")
        return False

def start_run(source: str, mode: str) -> str:
    result = get_client().table("scrape_runs").insert({
        "source": source,
        "mode": mode,
        "status": "running",
    }).execute()
    return result.data[0]["id"]

def finish_run(run_id: str, found: int, new: int,
               failed: int, last_id: str, status: str, error: str = None):
    get_client().table("scrape_runs").update({
        "finished_at": "now()",
        "articles_found": found,
        "articles_new": new,
        "articles_failed": failed,
        "last_id": last_id,
        "status": status,
        "error": error,
    }).eq("id", run_id).execute()
