from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict[str, Any]:
    """Verify a Firebase bearer token when Firebase is configured.

    Development mode intentionally remains usable without credentials so the UI can be
    developed against clearly labelled demo endpoints. Protected production routes must
    set ENVIRONMENT=production and configure Firebase verification.
    """
    if credentials is None:
        if settings.environment != 'production':
            return {'uid': 'demo-user', 'role': 'demo', 'is_demo': True}
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication required')

    if settings.environment != 'production' and credentials.credentials == 'demo-token':
        return {'uid': 'demo-user', 'role': 'demo', 'is_demo': True}

    if not settings.firebase_project_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail='Authentication is not configured')

    try:
        import firebase_admin
        from firebase_admin import auth

        if not firebase_admin._apps:
            firebase_admin.initialize_app(options={'projectId': settings.firebase_project_id})
        decoded = auth.verify_id_token(credentials.credentials)
        return decoded
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication token') from exc


def require_admin(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    if user.get('role') not in {'admin', 'administrator'}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Administrator access required')
    return user
