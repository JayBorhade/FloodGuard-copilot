import type { FloodRiskAssessment } from '../types/api';
import { fetchJson } from '../lib/api';

export interface RiskData extends FloodRiskAssessment {
  data_available: boolean;
  data_age_minutes: number | null;
  is_stale: boolean;
}

function unknownRisk(summary: string): RiskData {
  return {
    level: 'unknown',
    score: 0,
    confidence: 0,
    summary,
    source: 'derived',
    updated_at: '',
    data_available: false,
    reasons: ['Risk evidence is unavailable.'],
    data_age_minutes: null,
    is_stale: true,
  };
}

class FloodRiskService {
  async getCurrentRisk(latitude: number, longitude: number): Promise<RiskData> {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return unknownRisk('A valid location is required to request a risk assessment.');
    }

    try {
      const response = await fetchJson<FloodRiskAssessment>(
        `/api/v1/flood/risk?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`,
      );
      const timestamp = Date.parse(response.updated_at);
      const ageMinutes = Number.isFinite(timestamp)
        ? Math.max(0, Math.floor((Date.now() - timestamp) / 60000))
        : null;
      const dataAvailable = response.data_available !== false;
      const stale = !dataAvailable || ageMinutes === null || ageMinutes > 60;

      return {
        ...response,
        data_available: dataAvailable,
        data_age_minutes: ageMinutes,
        is_stale: stale,
      };
    } catch {
      return unknownRisk('Risk data is currently unavailable. Check again later; this is not a safety clearance.');
    }
  }
}

export const floodRiskService = new FloodRiskService();
