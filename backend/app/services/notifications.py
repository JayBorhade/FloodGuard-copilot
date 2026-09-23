from datetime import datetime, timezone

from app.schemas.notifications import (
    Notification,
    NotificationListResponse,
    NotificationSource,
    NotificationType,
)


def list_demo_notifications() -> NotificationListResponse:
    now = datetime.now(timezone.utc).isoformat()
    items = [
        Notification(
            id='demo-river-warning',
            type=NotificationType.WARNING,
            title='Sample river-level warning',
            message='This is a demonstration notification. Verify official local guidance before taking action.',
            location_label='Sample Riverside district',
            source=NotificationSource.DERIVED,
            requires_action=False,
            created_at=now,
            is_demo=True,
        ),
        Notification(
            id='demo-system-update',
            type=NotificationType.SYSTEM,
            title='FloodGuard demo mode is active',
            message='Live alert, weather, river, and shelter feeds are not connected in this environment.',
            source=NotificationSource.SYSTEM,
            created_at=now,
            is_read=True,
            is_demo=True,
        ),
    ]
    return NotificationListResponse(items=items, total=len(items), is_demo=True)
