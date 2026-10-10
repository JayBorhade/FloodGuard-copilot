from fastapi.testclient import TestClient
from app.main import app


def test_security_headers_are_set():
    response = TestClient(app).get("/")
    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "camera=()" in response.headers["permissions-policy"]


def test_untrusted_host_is_rejected():
    response = TestClient(app, base_url="http://attacker.example").get("/")
    assert response.status_code == 400
