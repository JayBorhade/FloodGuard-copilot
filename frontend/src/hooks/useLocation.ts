import { useCallback, useState } from 'react';
import { locationService } from '../services/location';
import type { UserLocation } from '../types/user';

type LocationState = 'requesting' | 'granted' | 'denied' | 'unavailable' | 'timeout';

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(() => locationService.getUserLocation());
  const [state, setState] = useState<LocationState>(() => locationService.getUserLocation() ? 'granted' : 'unavailable');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState('unavailable');
      setError('Geolocation is not supported by your browser. You can enter coordinates manually.');
      return;
    }

    setState('requesting');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy_meters: position.coords.accuracy,
        };
        locationService.storeUserLocation(nextLocation);
        setLocation(nextLocation);
        setState('granted');
        setError(null);
      },
      (err) => {
        if (err.code === 1) {
          setState('denied');
          setError('Location permission was denied. You can enable it in browser settings or enter coordinates manually.');
        } else if (err.code === 2) {
          setState('unavailable');
          setError('Your location is currently unavailable. Try again or enter coordinates manually.');
        } else if (err.code === 3) {
          setState('timeout');
          setError('Location request timed out. Try again or enter coordinates manually.');
        } else {
          setState('unavailable');
          setError('Failed to get your location. You can enter coordinates manually.');
        }
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 0 },
    );
  }, []);

  return { location, state, error, requestLocation };
}
