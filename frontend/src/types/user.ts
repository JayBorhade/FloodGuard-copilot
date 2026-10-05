export interface UserProfile {
  uid: string;
  email: string;
  display_name: string;
  created_at: string;
  is_demo: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string | null;
  created_at: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string | null;
  accuracy_meters?: number | null;
  verified_at?: string | null;
}

export interface OnboardingState {
  step: 'personal' | 'contacts' | 'location' | 'verification' | 'complete';
  completed: boolean;
  personal_info?: {
    display_name?: string;
    email?: string;
  };
  contacts?: EmergencyContact[];
  location?: UserLocation;
  verified_location?: UserLocation;
}
