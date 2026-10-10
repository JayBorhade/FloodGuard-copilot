from datetime import datetime, timezone
from urllib.parse import urlparse

import requests
from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/alerts", tags=["official alerts"])


def _empty(message: str) -> dict[str, object]:
    return {
        "available": False,
        "items": [],
        "source": None,
        "source_url": None,
        "fetched_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "message": message,
        "is_demo": False,
    }


@router.get("/official")
def official_alerts() -> dict[str, object]:
    """Read an explicitly configured IMD endpoint; never fabricate alerts.

    IMD's API portal requires provider-specific access/setup. This adapter only
    calls an operator-configured URL on api.imd.gov.in; payload normalization
    is deliberately conservative because API products have different schemas.
    """
    endpoint = settings.imd_alerts_api_url
    if not endpoint:
        return _empty("Official alert feed is not configured. No active-alert conclusion can be made.")
    parsed = urlparse(endpoint)
    if parsed.scheme != "https" or parsed.hostname != "api.imd.gov.in":
        return _empty("Configured alert endpoint is not an approved HTTPS IMD API host.")
    headers = {"Accept": "application/json"}
    if settings.imd_api_key:
        headers["Authorization"] = f"Bearer {settings.imd_api_key}"
    fetched_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    try:
        response = requests.get(endpoint, headers=headers, timeout=(3.05, 8))
        response.raise_for_status()
        payload = response.json()
        raw_items = payload if isinstance(payload, list) else payload.get("alerts") if isinstance(payload, dict) else None
        if not isinstance(raw_items, list):
            return _empty("IMD endpoint responded, but its schema is not recognized. No alerts were inferred.")
        items = []
        for index, item in enumerate(raw_items[:100]):
            if not isinstance(item, dict):
                continue
            title = item.get("title") or item.get("headline") or item.get("warning")
            message = item.get("message") or item.get("description") or item.get("text")
            if not isinstance(title, str) or not isinstance(message, str) or not title.strip() or not message.strip():
                continue
            items.append({
                "id": str(item.get("id") or item.get("alert_id") or f"imd-alert-{index}"),
                "title": title.strip()[:240],
                "message": message.strip()[:4000],
                "area": item.get("area") or item.get("district") or item.get("location"),
                "severity": item.get("severity") if isinstance(item.get("severity"), str) else "unspecified",
                "issued_at": item.get("issued_at") or item.get("issuedAt") or item.get("date"),
                "expires_at": item.get("expires_at") or item.get("expiresAt"),
                "source": "India Meteorological Department",
                "source_url": "https://api.imd.gov.in/public/api_reference.html",
            })
        return {
            "available": True,
            "items": items,
            "source": "India Meteorological Department",
            "source_url": "https://api.imd.gov.in/public/api_reference.html",
            "fetched_at": fetched_at,
            "message": "Provider response received. Follow the original official bulletin and local authority instructions.",
            "is_demo": False,
        }
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        return _empty("Official alert provider failed or returned invalid data. Check the original IMD bulletin.")
