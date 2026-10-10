from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_risk_endpoint_returns_unknown_when_live_sources_are_missing() -> None:
    response = client.get('/api/v1/flood/risk?latitude=18.5204&longitude=73.8567')

    assert response.status_code == 200
    body = response.json()
    assert body['level'] == 'unknown'
    assert body['data_available'] is False
    assert body['confidence'] == 0
    assert 'not a safe condition' in body['summary']
    assert body['reasons']


def test_risk_endpoint_rejects_out_of_range_coordinates() -> None:
    response = client.get('/api/v1/flood/risk?latitude=100&longitude=73.8567')
    assert response.status_code == 422


def test_risk_endpoint_requires_coordinates() -> None:
    response = client.get('/api/v1/flood/risk')
    assert response.status_code == 422
