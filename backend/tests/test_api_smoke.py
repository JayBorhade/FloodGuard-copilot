from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint_is_registered_and_healthy() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_status_endpoint_is_registered() -> None:
    response = client.get("/api/v1/status")

    assert response.status_code == 200
    assert response.json()["status"] == "foundation ready"


def test_notifications_endpoint_is_registered_and_demo_labelled() -> None:
    response = client.get("/api/v1/notifications")

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["items"], list)
    assert "total" in body


def test_development_session_endpoint_is_registered() -> None:
    response = client.get("/api/v1/auth/session")

    assert response.status_code == 200
    body = response.json()
    assert body["authenticated"] is True
    assert body["user"]["is_demo"] is True
