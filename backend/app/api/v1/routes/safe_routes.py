from fastapi import APIRouter, Query

router = APIRouter(prefix="/routes", tags=["route safety"])


@router.get("/safety")
def route_safety(
    origin_latitude: float = Query(ge=-90, le=90),
    origin_longitude: float = Query(ge=-180, le=180),
    destination_latitude: float = Query(ge=-90, le=90),
    destination_longitude: float = Query(ge=-180, le=180),
) -> dict[str, object]:
    """Fail closed until routing and verified road/flood hazard providers exist."""
    del origin_latitude, origin_longitude, destination_latitude, destination_longitude
    return {
        "available": False,
        "route_status": "unknown",
        "polyline": None,
        "distance_km": None,
        "duration_minutes": None,
        "hazard_reasons": [
            "No verified road-closure or flood-hazard feed is connected.",
            "No route engine is configured to evaluate the path.",
        ],
        "message": "FloodGuard cannot calculate or certify a safe route yet. Do not use an unverified route to enter a flooded area.",
        "source": None,
        "is_demo": False,
    }
