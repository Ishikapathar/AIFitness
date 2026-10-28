import { AuthUser } from '../types';

const AUTH_STORAGE_KEY = 'fitlife_auth_user';
const VERIFIED_EMAILS_KEY = 'fitlife_verified_emails';

export const authService = {
  getCurrentUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    // Default demo authenticated state
    return {
      id: 'usr_demo_101',
      email: 'arjun.fitlife@example.com',
      fullName: 'Arjun Sharma',
      isVerified: true,
      token: 'demo_token_authenticated'
    };
  },

  login(email: string, _password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!email || !email.includes('@')) {
          resolve({ success: false, error: 'Please enter a valid email address.' });
          return;
        }
        const user: AuthUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email,
          fullName: email.split('@')[0],
          isVerified: true,
          token: 'token_' + Date.now()
        };
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch {}
        resolve({ success: true, user });
      }, 500);
    });
  },

  signup(fullName: string, email: string, _password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!fullName.trim()) {
          resolve({ success: false, error: 'Full name is required.' });
          return;
        }
        if (!email || !email.includes('@')) {
          resolve({ success: false, error: 'Please enter a valid email address.' });
          return;
        }
        const user: AuthUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email,
          fullName,
          isVerified: false,
          token: 'temp_token_' + Date.now()
        };
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch {}
        resolve({ success: true, user });
      }, 600);
    });
  },

  verifyEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!code || code.trim().length < 4) {
          resolve({ success: false, error: 'Please enter a valid 4-digit verification code (e.g. 1234 in demo).' });
          return;
        }
        const user = authService.getCurrentUser();
        if (user) {
          user.isVerified = true;
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            const verified = JSON.parse(localStorage.getItem(VERIFIED_EMAILS_KEY) || '[]');
            verified.push(email);
            localStorage.setItem(VERIFIED_EMAILS_KEY, JSON.stringify(verified));
          } catch {}
        }
        resolve({ success: true });
      }, 600);
    });
  },

  requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `In demo mode: Password reset instructions simulated for ${email}. You can proceed with a demo password update.`
        });
      }, 500);
    });
  },

  logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  }
};
