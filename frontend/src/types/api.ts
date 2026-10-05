export type RiskLevel = 'safe' | 'low' | 'moderate' | 'high' | 'critical' | 'unknown';

export type FloodRiskAssessment = {
  level: RiskLevel;
  score: number;
  confidence: number;
  summary: string;
  source: 'official' | 'community' | 'model' | 'derived';
  updated_at: string;
};

export type WeatherSnapshot = {
  temperature_c: number | null;
  precipitation_mm: number | null;
  forecast_hours: number[];
  source: string;
  updated_at: string;
};

export type RouteStatus = 'recommended' | 'caution' | 'avoid' | 'unknown';

export type RouteAssessment = {
  distance_km: number | null;
  duration_minutes: number | null;
  route_status: RouteStatus;
  hazard_reasons: string[];
  is_demo: boolean;
};
