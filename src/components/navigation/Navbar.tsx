import React, { useState } from 'react';
import { Menu, X, Dumbbell, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  isAuthenticated,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left text-white focus:outline-none group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            FitLife<span className="text-lime-400">AI</span>
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              if (currentRoute !== '/') onNavigate('/');
              setTimeout(() => {
                const el = document.getElementById('explore') || document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Explore Modules</span>
          </button>
          <button
            onClick={() => {
              if (currentRoute !== '/') onNavigate('/');
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-lime-400 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('/workouts/library')}
            className={`hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 ${
              currentRoute.startsWith('/workouts') ? 'text-lime-400 font-semibold' : ''
            }`}
          >
            Exercise Library
          </button>
          <button
            onClick={() => onNavigate('/diet')}
            className={`hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === '/diet' ? 'text-lime-400 font-semibold' : ''
            }`}
          >
            Nutrition
          </button>
          <button
            onClick={() => {
              if (currentRoute !== '/') onNavigate('/');
              setTimeout(() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-lime-400 transition-colors whitespace-nowrap shrink-0"
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Go to Dashboard
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('/signup')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0B0E14] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-base font-medium text-slate-300">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentRoute !== '/') onNavigate('/');
                setTimeout(() => {
                  const el = document.getElementById('explore') || document.getElementById('features');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="text-left py-2 hover:text-lime-400 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Explore Modules</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentRoute !== '/') onNavigate('/');
                setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="text-left py-2 hover:text-lime-400"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/workouts/library');
              }}
              className="text-left py-2 hover:text-lime-400"
            >
              Exercise Library
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/diet');
              }}
              className="text-left py-2 hover:text-lime-400"
            >
              Nutrition
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentRoute !== '/') onNavigate('/');
                setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="text-left py-2 hover:text-lime-400"
            >
              About
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/dashboard');
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-slate-900 bg-lime-400 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-slate-400 hover:text-white"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/signup');
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-slate-900 bg-lime-400 rounded-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/login');
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-slate-300"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
