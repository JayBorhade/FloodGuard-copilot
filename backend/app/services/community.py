import json
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from app.core.config import settings


def _connect() -> sqlite3.Connection:
    path = Path(settings.database_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path, timeout=5)
    connection.row_factory = sqlite3.Row
    connection.execute("""
        CREATE TABLE IF NOT EXISTS community_reports (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            location_label TEXT,
            status TEXT NOT NULL DEFAULT 'pending_review',
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            flags INTEGER NOT NULL DEFAULT 0
        )
    """)
    connection.execute("CREATE INDEX IF NOT EXISTS idx_community_reports_created ON community_reports(created_at DESC)")
    connection.commit()
    return connection


def create_report(*, category: str, description: str, latitude: float, longitude: float, location_label: str | None) -> dict[str, Any]:
    now = datetime.now(timezone.utc)
    item = {
        "id": str(uuid.uuid4()),
        "category": category,
        "description": description.strip(),
        "latitude": latitude,
        "longitude": longitude,
        "location_label": location_label.strip()[:120] if location_label else None,
        "status": "pending_review",
        "verified": False,
        "created_at": now.isoformat(timespec="seconds"),
        "expires_at": (now + timedelta(hours=24)).isoformat(timespec="seconds"),
        "flags": 0,
    }
    with _connect() as connection:
        connection.execute(
            """INSERT INTO community_reports
            (id, category, description, latitude, longitude, location_label, status, created_at, expires_at, flags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)""",
            (item["id"], item["category"], item["description"], latitude, longitude,
             item["location_label"], item["status"], item["created_at"], item["expires_at"]),
        )
    return item


def list_reports(limit: int = 50) -> list[dict[str, Any]]:
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with _connect() as connection:
        rows = connection.execute(
            """SELECT * FROM community_reports
            WHERE expires_at > ? AND status != 'removed'
            ORDER BY created_at DESC LIMIT ?""",
            (now, max(1, min(limit, 100))),
        ).fetchall()
    return [{
        "id": row["id"], "category": row["category"], "description": row["description"],
        "latitude": row["latitude"], "longitude": row["longitude"],
        "location_label": row["location_label"], "status": row["status"],
        "verified": False, "created_at": row["created_at"], "expires_at": row["expires_at"],
        "flags": row["flags"],
    } for row in rows]


def flag_report(report_id: str) -> bool:
    with _connect() as connection:
        cursor = connection.execute(
            "UPDATE community_reports SET flags = flags + 1 WHERE id = ? AND status != 'removed'",
            (report_id,),
        )
        return cursor.rowcount > 0
