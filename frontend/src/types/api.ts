export type RiskLevel = 'safe' | 'low' | 'moderate' | 'high' | 'critical';

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

export type RouteAssessment = {
  distance_km: number | null;
  duration_minutes: number | null;
  safety_level: RiskLevel;
  safe_route: boolean;
};
