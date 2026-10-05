export type RiskLevelType = 'safe' | 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
export type DataSource = 'official' | 'community' | 'derived' | 'ml_prediction' | 'system';

export interface FloodRisk {
  level: RiskLevelType;
  score: number;
  confidence: number;
  summary: string;
  reasons: string[];
  source: DataSource;
  updated_at: string;
  data_age_minutes: number;
  is_stale: boolean;
}

export interface FloodAlert {
  id: string;
  level: RiskLevelType;
  title: string;
  description: string;
  source: DataSource;
  issued_at: string;
  expires_at?: string | null;
  is_demo: boolean;
}
