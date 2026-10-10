from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from app.core.auth import bearer_scheme, get_current_user
from app.schemas.auth import AuthSessionResponse, AuthenticatedUser, UserRole

router = APIRouter(prefix='/auth', tags=['authentication'])


@router.get('/session', response_model=AuthSessionResponse)
def get_session(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> AuthSessionResponse:
    """Return an unauthenticated state unless a valid bearer token is supplied."""
    if credentials is None:
        return AuthSessionResponse(
            authenticated=False,
            user=None,
            message='No active session',
        )

    user = get_current_user(credentials)
    role = user.get('role', 'demo' if user.get('is_demo') else 'user')
    return AuthSessionResponse(
        authenticated=True,
        user=AuthenticatedUser(
            uid=str(user.get('uid', 'unknown')),
            email=user.get('email'),
            display_name=user.get('name') or user.get('display_name'),
            role=UserRole(role),
            is_demo=bool(user.get('is_demo', False)),
        ),
    )
