from enum import Enum

from pydantic import BaseModel, Field


class UserRole(str, Enum):
    USER = 'user'
    ADMIN = 'admin'
    DEMO = 'demo'


class AuthenticatedUser(BaseModel):
    uid: str
    email: str | None = None
    display_name: str | None = None
    role: UserRole = UserRole.USER
    is_demo: bool = False


class AuthSessionResponse(BaseModel):
    authenticated: bool
    user: AuthenticatedUser | None = None
    message: str | None = None
