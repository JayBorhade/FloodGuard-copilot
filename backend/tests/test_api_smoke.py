from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint_is_registered_and_healthy() -> None:
    response = client.get('/api/v1/health')

    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_status_endpoint_is_registered() -> None:
    response = client.get('/api/v1/status')

    assert response.status_code == 200
    assert response.json()['status'] == 'foundation ready'


def test_notifications_endpoint_is_registered_and_demo_labelled() -> None:
    response = client.get('/api/v1/notifications')

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body['items'], list)
    assert 'total' in body


def test_anonymous_session_is_not_authenticated() -> None:
    response = client.get('/api/v1/auth/session')

    assert response.status_code == 200
    body = response.json()
    assert body['authenticated'] is False
    assert body['user'] is None


def test_explicit_development_demo_token_authenticates() -> None:
    response = client.get(
        '/api/v1/auth/session',
        headers={'Authorization': 'Bearer demo-token'},
    )

    assert response.status_code == 200
    body = response.json()
    assert body['authenticated'] is True
    assert body['user']['is_demo'] is True
    assert body['user']['role'] == 'demo'


def test_protected_dependency_rejects_missing_credentials() -> None:
    from fastapi import HTTPException
    from app.core.auth import get_current_user

    try:
        get_current_user(None)
    except HTTPException as exc:
        assert exc.status_code == 401
    else:
        raise AssertionError('Missing credentials must not authenticate a user')
