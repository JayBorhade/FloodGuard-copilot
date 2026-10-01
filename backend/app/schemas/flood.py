from pydantic import BaseModel, Field
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
    score: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)
    summary: str
    source: FloodRiskSource
    updated_at: str


class WeatherSnapshot(BaseModel):
    temperature_c: float | None = None
    precipitation_mm: float | None = None
    forecast_hours: list[int] = Field(default_factory=list)
    source: str = 'demo'
    updated_at: str


class RouteStatus(str, Enum):
    RECOMMENDED = 'recommended'
    CAUTION = 'caution'
    AVOID = 'avoid'
    UNKNOWN = 'unknown'


class RouteAssessment(BaseModel):
    distance_km: float | None = None
    duration_minutes: int | None = None
    route_status: RouteStatus = RouteStatus.UNKNOWN
    hazard_reasons: list[str] = Field(default_factory=list)
    is_demo: bool = False
