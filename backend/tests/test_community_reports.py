from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

client = TestClient(app)


def test_community_report_is_persisted_but_never_verified(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "database_path", str(tmp_path / "reports.sqlite3"))
    created = client.post("/api/v1/community/reports", json={
        "category": "flooding",
        "description": "Water is covering the low road near the bridge.",
        "latitude": 18.52,
        "longitude": 73.85,
        "location_label": "Near bridge",
    })
    assert created.status_code == 201
    item = created.json()["item"]
    assert item["verified"] is False
    assert item["status"] == "pending_review"

    listed = client.get("/api/v1/community/reports")
    assert listed.status_code == 200
    assert listed.json()["items"][0]["id"] == item["id"]
    assert listed.json()["verified_data_available"] is False


def test_community_report_validates_coordinates_and_description():
    response = client.post("/api/v1/community/reports", json={
        "category": "flooding", "description": "short", "latitude": 120, "longitude": 73,
    })
    assert response.status_code == 422


def test_safe_route_is_unknown_until_verified_hazard_and_routing_sources_exist():
    response = client.get("/api/v1/routes/safety?origin_latitude=18.52&origin_longitude=73.85&destination_latitude=18.53&destination_longitude=73.86")
    assert response.status_code == 200
    body = response.json()
    assert body["available"] is False
    assert body["route_status"] == "unknown"
    assert body["polyline"] is None
    assert "cannot calculate" in body["message"]
