from fastapi import APIRouter, Query

from app.services.weather import get_weather

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current")
def current_weather(
    latitude: float = Query(ge=-90, le=90),
    longitude: float = Query(ge=-180, le=180),
) -> dict[str, object]:
    """Return attributed weather context; never treat weather as flood clearance."""
    return get_weather(latitude, longitude)
