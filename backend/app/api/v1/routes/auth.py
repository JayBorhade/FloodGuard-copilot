from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.schemas.auth import AuthSessionResponse, AuthenticatedUser, UserRole

router = APIRouter(prefix='/auth', tags=['authentication'])


@router.get('/session', response_model=AuthSessionResponse)
def get_session(user: dict = Depends(get_current_user)) -> AuthSessionResponse:
    return AuthSessionResponse(
        authenticated=True,
        user=AuthenticatedUser(
            uid=str(user.get('uid', 'unknown')),
            email=user.get('email'),
            display_name=user.get('name'),
            role=UserRole(user.get('role', 'demo' if user.get('is_demo') else 'user')),
            is_demo=bool(user.get('is_demo', False)),
        ),
    )
