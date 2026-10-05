import { OnboardingState } from '../types/user';

const ONBOARDING_STORAGE_KEY = 'floodguard_onboarding';

class OnboardingService {
  getState(): OnboardingState | null {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as OnboardingState;
    } catch {
      return null;
    }
  }

  setState(state: OnboardingState): void {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
  }

  updateStep(step: OnboardingState['step']): void {
    const current = this.getState() || this.getDefaultState();
    current.step = step;
    this.setState(current);
  }

  completeOnboarding(): void {
    const current = this.getState() || this.getDefaultState();
    current.completed = true;
    current.step = 'complete';
    this.setState(current);
  }

  reset(): void {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  }

  private getDefaultState(): OnboardingState {
    return {
      step: 'personal',
      completed: false,
      personal_info: {},
      contacts: [],
      location: undefined,
      verified_location: undefined,
    };
  }
}

export const onboardingService = new OnboardingService();
