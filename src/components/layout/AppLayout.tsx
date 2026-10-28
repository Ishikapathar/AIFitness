import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Camera,
  Calendar,
  BookOpen,
  Utensils,
  CheckSquare,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Flame,
  Menu,
  X,
  Dumbbell,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AppLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  profile: UserProfile;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  onNavigate,
  onLogout,
  profile,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Live AI Workout', route: '/live-workout/ex_squats', icon: Camera, highlight: true },
    { label: 'Workout Planner', route: '/workouts/planner', icon: Calendar },
    { label: 'Exercise Library', route: '/workouts/library', icon: BookOpen },
    { label: 'Diet Planner', route: '/diet', icon: Utensils },
    { label: 'Daily Tracker', route: '/tracker', icon: CheckSquare },
    { label: 'Progress & Analytics', route: '/progress', icon: TrendingUp },
    { label: 'My Profile', route: '/profile', icon: User },
    { label: 'Settings', route: '/settings', icon: Settings }
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Derive current breadcrumb
  const currentNav = navItems.find((n) => currentRoute.startsWith(n.route)) || { label: 'Dashboard' };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar (260px) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111622] border-r border-slate-800/80 shrink-0">
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-lg">
              FitLife<span className="text-lime-400">AI</span>
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-[#171E2E] rounded-xl border border-slate-800/60 flex items-center gap-3">
          <img
            src={profile.avatarUrl || '/src/assets/images/user_avatar_trainer_1793202696748.jpg'}
            alt={profile.fullName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-lime-400/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white truncate">{profile.fullName}</div>
            <div className="text-xs text-lime-400 font-medium capitalize flex items-center gap-1">
              <span>{profile.fitnessGoal.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || (item.route.startsWith('/workouts') && currentRoute.startsWith('/workouts') && item.route === currentRoute);
            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-lime-400/15 text-lime-400 font-semibold border border-lime-400/30'
                    : item.highlight
                    ? 'text-slate-200 hover:bg-slate-800/60 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-lime-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full text-xs text-slate-400 hover:text-slate-200 py-2 px-3 rounded text-left transition-colors flex items-center justify-between"
          >
            <span>Landing Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/20 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#111622]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb trail */}
            <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
              <span className="hover:text-slate-200 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
                FitLife AI
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-white font-medium capitalize truncate">{currentNav.label}</span>
            </div>
          </div>

          {/* Right Header Zone */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Date display */}
            <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
              {currentDateFormatted}
            </span>

            {/* Streak Indicator with animated flicker */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 animate-flame" />
              <span className="tabular-nums">5 Day Streak</span>
            </div>

            {/* Quick Live Workout Launch */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('/live-workout/ex_squats')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors whitespace-nowrap glow-lime-subtle"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Start AI Session</span>
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          key={currentRoute}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 max-w-[85%] bg-[#111622] h-full flex flex-col z-10 border-r border-slate-800">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
              <span className="font-bold text-white text-lg">
                FitLife<span className="text-lime-400">AI</span>
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 mx-3 my-2 bg-[#171E2E] rounded-xl flex items-center gap-3">
              <img
                src={profile.avatarUrl || '/src/assets/images/user_avatar_trainer_1793202696748.jpg'}
                alt={profile.fullName}
                className="w-10 h-10 rounded-full object-cover border border-lime-400/40"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{profile.fullName}</div>
                <div className="text-xs text-lime-400">{profile.email}</div>
              </div>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      onNavigate(item.route);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-lime-400/15 text-lime-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onNavigate('/');
                }}
                className="w-full text-xs text-slate-400 py-2 px-3 text-left"
              >
                Landing Page
              </button>
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#171E2E] border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Confirm Sign Out</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to end your current FitLife AI session? Your local workout progress will remain saved.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
