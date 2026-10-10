import { beforeEach, describe, expect, it } from 'vitest';
import { authService } from './auth';
import { onboardingService } from './onboarding';

describe('onboardingService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists onboarding progress and preserves existing profile fields when advancing', () => {
    authService.setToken('demo-token');
    onboardingService.setState({
      step: 'contacts',
      completed: false,
      personal_info: { display_name: 'FloodGuard Tester', email: 'test@example.com' },
      contacts: [],
    });

    onboardingService.updateStep('location');
    const state = onboardingService.getState();

    expect(state?.step).toBe('location');
    expect(state?.personal_info?.display_name).toBe('FloodGuard Tester');
    expect(state?.personal_info?.email).toBe('test@example.com');
  });

  it('rejects malformed saved JSON rather than crashing', () => {
    authService.setToken('demo-token');
    localStorage.setItem('floodguard_onboarding:demo-user', '{invalid json');
    expect(onboardingService.getState()).toBeNull();
  });

  it('isolates demo progress from anonymous browser state', () => {
    authService.setToken('demo-token');
    onboardingService.setState({
      step: 'contacts',
      completed: false,
      personal_info: { display_name: 'Demo Profile' },
      contacts: [],
    });

    authService.clearToken();
    onboardingService.setState({
      step: 'personal',
      completed: false,
      personal_info: { display_name: 'Anonymous Draft' },
      contacts: [],
    });
    expect(onboardingService.getState()?.personal_info?.display_name).toBe('Anonymous Draft');

    authService.setToken('demo-token');
    expect(onboardingService.getState()?.personal_info?.display_name).toBe('Demo Profile');
  });
});
