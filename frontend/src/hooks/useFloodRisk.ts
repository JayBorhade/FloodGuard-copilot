import { useEffect, useState } from 'react';
import { RiskData, floodRiskService } from '../services/flood-risk';
import { UserLocation } from '../types/user';

export function useFloodRisk(location: UserLocation | null) {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setRisk(null);
      setError(null);
      return;
    }

    const fetchRisk = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await floodRiskService.getCurrentRisk(
          location.latitude,
          location.longitude,
        );
        setRisk(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch risk data');
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
  }, [location?.latitude, location?.longitude]);

  return { risk, loading, error };
}
