import { FloodRiskAssessment, RiskLevel } from '../types/api';
import { fetchJson } from '../lib/api';

export interface RiskData extends FloodRiskAssessment {
  data_age_minutes: number;
  is_stale: boolean;
}

class FloodRiskService {
  async getCurrentRisk(
    latitude: number,
    longitude: number,
  ): Promise<RiskData> {
    try {
      const response = await fetchJson<RiskData>(
        `/api/v1/flood/risk?latitude=${latitude}&longitude=${longitude}`,
      );
      // Calculate data freshness
      const updatedAt = new Date(response.updated_at).getTime();
      const now = new Date().getTime();
      const ageMinutes = Math.floor((now - updatedAt) / 60000);
      return {
        ...response,
        data_age_minutes: ageMinutes,
        is_stale: ageMinutes > 60,
      };
    } catch (error) {
      // Return unknown state on error rather than throwing
      return {
        level: 'unknown',
        score: 0,
        confidence: 0,
        summary: 'Risk data currently unavailable',
        source: 'derived',
        updated_at: new Date().toISOString(),
        data_age_minutes: 0,
        is_stale: true,
      };
    }
  }
}

export const floodRiskService = new FloodRiskService();
