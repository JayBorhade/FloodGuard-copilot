from datetime import datetime, timezone

from fastapi import APIRouter, Query

from app.schemas.flood import FloodRiskAssessment, FloodRiskLevel, FloodRiskSource

router = APIRouter(prefix='/flood', tags=['flood risk'])


@router.get('/risk', response_model=FloodRiskAssessment)
def get_flood_risk(
    latitude: float = Query(ge=-90, le=90),
    longitude: float = Query(ge=-180, le=180),
) -> FloodRiskAssessment:
    """Return an explicit unknown state until trusted risk feeds are configured.

    Coordinates are validated now so provider integrations can be added without
    changing the public contract. No live rainfall, river gauge, or official alert
    provider is connected yet; therefore the endpoint must never infer safety.
    """
    del latitude, longitude  # Validated query parameters; no provider consumes them yet.
    return FloodRiskAssessment(
        level=FloodRiskLevel.UNKNOWN,
        score=0,
        confidence=0,
        summary=(
            'Flood risk could not be assessed because trusted live data sources '
            'are not connected. Do not interpret this as a safe condition.'
        ),
        source=FloodRiskSource.DERIVED,
        updated_at=datetime.now(timezone.utc).isoformat(timespec='seconds'),
        data_available=False,
        reasons=[
            'No official rainfall or river-level feed is connected.',
            'No verified official flood-alert feed is connected.',
        ],
    )
