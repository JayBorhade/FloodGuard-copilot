from enum import Enum


class FloodRiskLevel(str, Enum):
    SAFE = 'safe'
    LOW = 'low'
    MODERATE = 'moderate'
    HIGH = 'high'
    CRITICAL = 'critical'


class FloodRiskSource(str, Enum):
    OFFICIAL = 'official'
    COMMUNITY = 'community'
    MODEL = 'model'
    DERIVED = 'derived'


class FloodRiskAssessment(BaseModel):
    level: FloodRiskLevel
    score: int
    confidence: int
    summary: str
    source: FloodRiskSource
    updated_at: str


class WeatherSnapshot(BaseModel):
    temperature_c: float | None = None
    precipitation_mm: float | None = None
    forecast_hours: list[int] = []
    source: str = 'demo'
    updated_at: str


class RouteAssessment(BaseModel):
    distance_km: float | None = None
    duration_minutes: int | None = None
    safety_level: FloodRiskLevel = FloodRiskLevel.SAFE
    safe_route: bool = True
