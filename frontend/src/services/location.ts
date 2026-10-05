import { UserLocation } from '../types/user';

class LocationService {
  storeUserLocation(location: UserLocation): void {
    localStorage.setItem('floodguard_user_location', JSON.stringify(location));
  }

  getUserLocation(): UserLocation | null {
    const stored = localStorage.getItem('floodguard_user_location');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserLocation;
    } catch {
      return null;
    }
  }

  clearUserLocation(): void {
    localStorage.removeItem('floodguard_user_location');
  }

  storeVerifiedLocation(location: UserLocation): void {
    localStorage.setItem('floodguard_verified_location', JSON.stringify(location));
  }

  getVerifiedLocation(): UserLocation | null {
    const stored = localStorage.getItem('floodguard_verified_location');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserLocation;
    } catch {
      return null;
    }
  }
}

export const locationService = new LocationService();
