import { authService } from './auth';
import type { OnboardingState } from '../types/user';

const LEGACY_STORAGE_KEY = 'floodguard_onboarding';
const STORAGE_PREFIX = 'floodguard_onboarding:';

class OnboardingService {
  private storageKey(): string {
    return `${STORAGE_PREFIX}${authService.getStorageScope()}`;
  }

  getState(): OnboardingState | null {
    try {
      const key = this.storageKey();
      let stored = localStorage.getItem(key);
      if (!stored && authService.getStorageScope() === 'demo-user') {
        stored = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (stored) {
          localStorage.setItem(key, stored);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }
      if (!stored) return null;
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') return null;
      const state = parsed as Partial<OnboardingState>;
      const validSteps: OnboardingState['step'][] = ['personal', 'contacts', 'location', 'verification', 'complete'];
      if (!state.step || !validSteps.includes(state.step)) return null;
      return {
        step: state.step,
        completed: state.completed === true,
        personal_info: state.personal_info ?? {},
        contacts: Array.isArray(state.contacts) ? state.contacts : [],
        location: state.location,
        verified_location: state.verified_location,
      };
    } catch {
      return null;
    }
  }

  setState(state: OnboardingState): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(state));
  }

  updateStep(step: OnboardingState['step']): void {
    const current = this.getState() ?? this.getDefaultState();
    this.setState({ ...current, step, completed: step === 'complete' });
  }

  completeOnboarding(): void {
    const current = this.getState() ?? this.getDefaultState();
    this.setState({ ...current, completed: true, step: 'complete' });
  }

  reset(): void {
    localStorage.removeItem(this.storageKey());
  }

  private getDefaultState(): OnboardingState {
    return { step: 'personal', completed: false, personal_info: {}, contacts: [] };
  }
}

export const onboardingService = new OnboardingService();
