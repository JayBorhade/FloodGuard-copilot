import { useCallback, useEffect, useState } from 'react';
import { UserLocation } from '../types/user';

type LocationState = 'requesting' | 'granted' | 'denied' | 'unavailable' | 'timeout';

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [state, setState] = useState<LocationState>('unavailable');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setState('unavailable');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setState('requesting');
    setError(null);

    const timeout = setTimeout(() => {
      setState('timeout');
      setError('Location request timed out. Please try again.');
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        setState('granted');
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy_meters: position.coords.accuracy,
        });
      },
      (err) => {
        clearTimeout(timeout);
        if (err.code === 1) {
          setState('denied');
          setError('Location permission was denied. You can enable it in your browser settings.');
        } else if (err.code === 2) {
          setState('unavailable');
          setError('Your location is currently unavailable.');
        } else if (err.code === 3) {
          setState('timeout');
          setError('Location request timed out.');
        } else {
          setState('unavailable');
          setError('Failed to get your location.');
        }
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 0 },
    );
  }, []);

  return { location, state, error, requestLocation };
}
