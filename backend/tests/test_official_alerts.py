from app.api.v1.routes import alerts
from app.core.config import settings


def test_official_alerts_not_configured_is_explicitly_unavailable(monkeypatch):
    monkeypatch.setattr(settings, "imd_alerts_api_url", None)
    response = alerts.official_alerts()
    assert response["available"] is False
    assert response["items"] == []
    assert "not configured" in response["message"]


def test_official_alerts_rejects_unapproved_host(monkeypatch):
    monkeypatch.setattr(settings, "imd_alerts_api_url", "https://example.com/alerts")
    response = alerts.official_alerts()
    assert response["available"] is False
    assert "not an approved" in response["message"]


def test_official_alerts_normalizes_configured_imd_response(monkeypatch):
    monkeypatch.setattr(settings, "imd_alerts_api_url", "https://api.imd.gov.in/example")
    class FakeResponse:
        def raise_for_status(self): pass
        def json(self):
            return {"alerts": [{"id": "x1", "title": "Heavy rain", "message": "Official bulletin text", "area": "Pune"}]}
    monkeypatch.setattr(alerts.requests, "get", lambda *args, **kwargs: FakeResponse())
    response = alerts.official_alerts()
    assert response["available"] is True
    assert response["items"][0]["title"] == "Heavy rain"
    assert response["items"][0]["source"] == "India Meteorological Department"
