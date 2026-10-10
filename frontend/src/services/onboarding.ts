import type { OnboardingState } from '../types/user';

const ONBOARDING_STORAGE_KEY = 'floodguard_onboarding';

class OnboardingService {
  getState(): OnboardingState | null {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!stored) return null;
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') return null;
      const state = parsed as Partial<OnboardingState>;
      const validSteps: OnboardingState['step'][] = [
        'personal', 'contacts', 'location', 'verification', 'complete',
      ];
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
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
  }

  updateStep(step: OnboardingState['step']): void {
    const current = this.getState() ?? this.getDefaultState();
    this.setState({ ...current, step, completed: step === 'complete' ? true : current.completed });
  }

  completeOnboarding(): void {
    const current = this.getState() ?? this.getDefaultState();
    this.setState({ ...current, completed: true, step: 'complete' });
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
    };
  }
}

export const onboardingService = new OnboardingService();
