import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { EmailVerificationPage } from './components/auth/EmailVerificationPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { ExerciseLibraryView } from './components/workouts/ExerciseLibraryView';
import { WorkoutPlannerView } from './components/workouts/WorkoutPlannerView';
import { LiveWorkoutView } from './components/live-workout/LiveWorkoutView';
import { DietPlannerView } from './components/diet/DietPlannerView';
import { DailyTrackerView } from './components/tracker/DailyTrackerView';
import { ProgressAnalyticsView } from './components/progress/ProgressAnalyticsView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { authService } from './services/authService';
import { profileService } from './services/profileService';
import { AuthUser, UserProfile } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    // Read initial route from URL path or fallback to '/'
    const path = window.location.pathname;
    return path && path !== '' ? path : '/';
  });

  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [profile, setProfile] = useState<UserProfile>(() => profileService.getProfile());
  const [registeredEmail, setRegisteredEmail] = useState<string>('arjun.fitlife@example.com');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRoute(path || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    try {
      window.history.pushState({}, '', route);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const handleLoginSuccess = () => {
    const u = authService.getCurrentUser();
    setUser(u);
    setProfile(profileService.getProfile());
  };

  const handleOnboardingComplete = () => {
    setProfile(profileService.getProfile());
  };

  // Route dispatcher
  const renderCurrentView = () => {
    // 1. PUBLIC ROUTES
    if (currentRoute === '/') {
      return (
        <div>
          <Navbar
            currentRoute={currentRoute}
            onNavigate={navigate}
            isAuthenticated={!!user}
            onLogout={handleLogout}
          />
          <LandingPage onNavigate={navigate} />
        </div>
      );
    }

    if (currentRoute === '/login') {
      return (
        <LoginPage
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentRoute === '/signup') {
      return (
        <SignUpPage
          onNavigate={navigate}
          onRegisteredEmail={(email) => setRegisteredEmail(email)}
        />
      );
    }

    if (currentRoute === '/verify-email') {
      return (
        <EmailVerificationPage
          email={registeredEmail}
          onNavigate={navigate}
          onVerifiedSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentRoute === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }

    if (currentRoute === '/onboarding') {
      return (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onNavigate={navigate}
        />
      );
    }

    // 2. AUTHENTICATED ROUTES (Wrapped in AppLayout)
    let content: React.ReactNode = null;

    if (currentRoute.startsWith('/live-workout/')) {
      const exerciseId = currentRoute.replace('/live-workout/', '') || 'ex_squats';
      content = <LiveWorkoutView exerciseId={exerciseId} onNavigate={navigate} />;
    } else if (currentRoute === '/workouts/library') {
      content = <ExerciseLibraryView onNavigate={navigate} />;
    } else if (currentRoute === '/workouts/planner' || currentRoute === '/workouts') {
      content = <WorkoutPlannerView onNavigate={navigate} />;
    } else if (currentRoute === '/diet' || currentRoute === '/diet/meal-plan') {
      content = <DietPlannerView onNavigate={navigate} />;
    } else if (currentRoute === '/tracker') {
      content = <DailyTrackerView onNavigate={navigate} />;
    } else if (currentRoute === '/progress') {
      content = <ProgressAnalyticsView onNavigate={navigate} />;
    } else if (currentRoute === '/profile' || currentRoute === '/settings') {
      content = (
        <ProfileSettingsView
          profile={profile}
          onUpdateProfile={(updated) => setProfile(updated)}
          onLogout={handleLogout}
        />
      );
    } else {
      // Default to Dashboard
      content = <DashboardView profile={profile} onNavigate={navigate} />;
    }

    return (
      <AppLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        onLogout={handleLogout}
        profile={profile}
      >
        {content}
      </AppLayout>
    );
  };

  return <div className="min-h-screen bg-[#0B0E14] text-slate-100">{renderCurrentView()}</div>;
}
