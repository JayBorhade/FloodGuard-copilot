from app.core.config import settings


def get_allowed_origins() -> list[str]:
    return settings.allowed_origins
