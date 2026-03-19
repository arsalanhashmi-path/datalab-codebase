from .db import get_client

def get_checkpoint(source: str) -> int | None:
    result = get_client().table("scrape_checkpoints") \
        .select("last_id").eq("source", source).execute()
    return result.data[0]["last_id"] if result.data else None

def save_checkpoint(source: str, last_id: int):
    get_client().table("scrape_checkpoints").upsert({
        "source": source,
        "last_id": last_id,
        "updated_at": "now()",
    }).execute()
