import { UserProfile } from '../types';
import { SAMPLE_PROFILE } from './sampleData';

const PROFILE_KEY = 'fitlife_user_profile';

export const profileService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return { ...SAMPLE_PROFILE };
  },

  saveProfile(profile: UserProfile): UserProfile {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {}
    return profile;
  },

  updateProfile(partial: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...partial };
    this.saveProfile(updated);
    return updated;
  },

  resetToDemo(): UserProfile {
    this.saveProfile(SAMPLE_PROFILE);
    return { ...SAMPLE_PROFILE };
  }
};
