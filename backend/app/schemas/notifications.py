from enum import Enum

from pydantic import BaseModel, Field


class NotificationType(str, Enum):
    EMERGENCY = 'emergency'
    WARNING = 'warning'
    INFORMATION = 'information'
    SYSTEM = 'system'


class NotificationSource(str, Enum):
    OFFICIAL = 'official'
    COMMUNITY = 'community'
    SYSTEM = 'system'
    DERIVED = 'derived'


class Notification(BaseModel):
    id: str
    type: NotificationType
    title: str
    message: str
    location_label: str | None = None
    source: NotificationSource
    is_read: bool = False
    requires_action: bool = False
    created_at: str
    updated_at: str | None = None
    expires_at: str | None = None
    is_demo: bool = False


class NotificationListResponse(BaseModel):
    items: list[Notification] = Field(default_factory=list)
    next_cursor: str | None = None
    total: int
    is_demo: bool = False
