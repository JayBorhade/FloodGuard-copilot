from fastapi import APIRouter

from app.schemas.notifications import NotificationListResponse
from app.services.notifications import list_demo_notifications

router = APIRouter(prefix='/notifications', tags=['notifications'])


@router.get('', response_model=NotificationListResponse)
def get_notifications() -> NotificationListResponse:
    """Return an explicitly demo-labelled response until the notification provider is connected."""
    return list_demo_notifications()
