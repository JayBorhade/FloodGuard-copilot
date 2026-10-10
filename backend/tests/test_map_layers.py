from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_map_layers_explicitly_report_unavailable_hazard_feeds() -> None:
    response = client.get('/api/v1/map/layers')

    assert response.status_code == 200
    body = response.json()
    assert body['data_available'] is False
    assert 'not connected' in body['message']
    assert {layer['id'] for layer in body['layers']} == {
        'flood-zones',
        'shelters',
        'community-reports',
        'road-conditions',
    }
    assert all(layer['available'] is False for layer in body['layers'])
    assert all(layer['source'] is None for layer in body['layers'])
