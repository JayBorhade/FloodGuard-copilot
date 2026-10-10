import { authService } from './auth';
import type { UserLocation } from '../types/user';

const LEGACY_LOCATION_KEY = 'floodguard_user_location';
const LEGACY_VERIFIED_KEY = 'floodguard_verified_location';

class LocationService {
  private key(kind: 'user' | 'verified'): string {
    return `floodguard_${kind === 'user' ? 'user_location' : 'verified_location'}:${authService.getStorageScope()}`;
  }

  private read(key: string): UserLocation | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      const location = parsed as Partial<UserLocation>;
      if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') return null;
      if (location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180) return null;
      return location as UserLocation;
    } catch {
      return null;
    }
  }

  storeUserLocation(location: UserLocation): void {
    localStorage.setItem(this.key('user'), JSON.stringify(location));
  }

  getUserLocation(): UserLocation | null {
    const key = this.key('user');
    const stored = this.read(key);
    if (stored) return stored;
    if (authService.getStorageScope() === 'demo-user') {
      const legacy = this.read(LEGACY_LOCATION_KEY);
      if (legacy) {
        this.storeUserLocation(legacy);
        localStorage.removeItem(LEGACY_LOCATION_KEY);
        return legacy;
      }
    }
    return null;
  }

  clearUserLocation(): void {
    localStorage.removeItem(this.key('user'));
  }

  storeVerifiedLocation(location: UserLocation): void {
    localStorage.setItem(this.key('verified'), JSON.stringify(location));
  }

  getVerifiedLocation(): UserLocation | null {
    const key = this.key('verified');
    const stored = this.read(key);
    if (stored) return stored;
    if (authService.getStorageScope() === 'demo-user') {
      const legacy = this.read(LEGACY_VERIFIED_KEY);
      if (legacy) {
        this.storeVerifiedLocation(legacy);
        localStorage.removeItem(LEGACY_VERIFIED_KEY);
        return legacy;
      }
    }
    return null;
  }
}

export const locationService = new LocationService();
