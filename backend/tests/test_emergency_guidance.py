from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_emergency_guidance_has_official_india_number_and_no_dispatch_claim():
    response = client.get("/api/v1/emergency/guidance")
    assert response.status_code == 200
    body = response.json()
    assert body["emergency_number"] == "112"
    assert body["source_url"] == "https://112.gov.in/"
    assert body["dispatch_integrated"] is False
    assert "does not contact responders" in body["message"]
    assert body["steps"]
