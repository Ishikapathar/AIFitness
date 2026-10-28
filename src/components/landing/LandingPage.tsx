import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Utensils,
  Calendar,
  CheckSquare,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Shield,
  ChevronDown,
  Activity,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Dumbbell,
  Play,
  X,
  Droplets,
  Award,
  Layers,
  Scale,
  Volume2,
  RefreshCw,
  Plus,
  Sliders
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

interface FeatureModule {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  highlights: string[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedModule, setSelectedModule] = useState<FeatureModule | null>(null);

  // Dynamic animated simulation for Hero HUD
  const [heroAngle, setHeroAngle] = useState(170);
  const [heroRep, setHeroRep] = useState(8);
  const [heroPhase, setHeroPhase] = useState<'Ready' | 'Descending' | 'Deep Flexion' | 'Lockout'>('Ready');

  // Sandbox states for Explore Module interactive preview & playground
  const [activeExploreTab, setActiveExploreTab] = useState<'ai-coach' | 'diet-planner' | 'workout-planner' | 'daily-tracker' | 'progress-analytics' | 'ai-insights'>('ai-coach');
  const [sandboxAngle, setSandboxAngle] = useState(165);
  const [sandboxDietGoal, setSandboxDietGoal] = useState<'muscle' | 'fatloss' | 'balanced'>('muscle');
  const [sandboxDietType, setSandboxDietType] = useState<'vegetarian' | 'eggetarian' | 'vegan'>('vegetarian');
  const [sandboxMealSubstituted, setSandboxMealSubstituted] = useState(false);
  const [sandboxWorkoutSplit, setSandboxWorkoutSplit] = useState<'4day' | '5day' | '3day'>('4day');
  const [sandboxWorkoutDay, setSandboxWorkoutDay] = useState(0);
  const [sandboxWaterGlasses, setSandboxWaterGlasses] = useState(5);
  const [sandboxAnalyticsTimeframe, setSandboxAnalyticsTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [audioVoiceStatus, setAudioVoiceStatus] = useState<string | null>(null);

  const [sandboxHabits, setSandboxHabits] = useState<{ id: string; title: string; done: boolean; pts: number }[]>([
    { id: '1', title: '500ml Morning Hydration', done: true, pts: 10 },
    { id: '2', title: '20-min Mobility & Posture Stretch', done: false, pts: 15 },
    { id: '3', title: 'High-Protein Breakfast Log', done: true, pts: 10 },
    { id: '4', title: '7.5+ Hours Recovery Sleep', done: false, pts: 25 }
  ]);
  const [sandboxPoints, setSandboxPoints] = useState(120);
  const [sandboxInsightScenario, setSandboxInsightScenario] = useState<'hydration' | 'recovery' | 'tomorrow'>('hydration');

  const playVoiceDemo = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.02;
        utterance.pitch = 1.0;
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
        setAudioVoiceStatus(text);
        setTimeout(() => setAudioVoiceStatus(null), 3500);
      } catch {
        // Safe fallback
      }
    }
  };

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;
      const sinVal = (Math.sin(t) + 1) / 2; // 0 to 1
      const currentDeg = Math.round(85 + sinVal * 90); // 85 deg to 175 deg
      setHeroAngle(currentDeg);

      if (currentDeg < 95) {
        setHeroPhase('Deep Flexion');
      } else if (sinVal < 0.5) {
        setHeroPhase('Descending');
      } else if (currentDeg > 165) {
        setHeroPhase('Lockout');
      } else {
        setHeroPhase('Ready');
      }

      if (Math.abs(sinVal - 0.99) < 0.02) {
        setHeroRep((prev) => (prev >= 12 ? 1 : prev + 1));
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const features: FeatureModule[] = [
    {
      id: 'ai-coach',
      icon: Camera,
      title: 'Live AI Workout Coach',
      subtitle: 'Real-Time Biomechanical Movement Analysis',
      description:
        'Uses browser-based computer vision pose analysis to evaluate exercise posture, joint angles, and movement tempo in real time without recording your video.',
      route: '/live-workout/ex_squats',
      highlights: [
        '33-point anatomical landmark mesh processed locally in browser',
        'Repetition state machines for Squats, Push-ups, and Bicep Curls',
        'SpeechSynthesis audio coaching cues with zero cloud video upload'
      ]
    },
    {
      id: 'diet-planner',
      icon: Utensils,
      title: 'Personalized Diet Planner',
      subtitle: 'Macro-Calibrated Nutrition with Indian Whole-Foods',
      description:
        'Calculates macro-caloric targets and generates structured meal plans supporting vegetarian, eggetarian, vegan, and non-veg diets with authentic Indian staple options.',
      route: '/diet',
      highlights: [
        'Authentic staple integration: Paneer, Yellow Dal, Moong Dosa, Quinoa, Roti',
        'Instant 1-click meal substitutions with automatic macro recalculation',
        'Direct synchronization with your daily food log and nutrition ledger'
      ]
    },
    {
      id: 'workout-planner',
      icon: Calendar,
      title: 'Smart Workout Planner',
      subtitle: 'Adaptive Weekly Periodization & Splits',
      description:
        'Structured weekly splits tailored to your available equipment, current experience tier, and target muscle groups with built-in rest and volume management.',
      route: '/workouts/planner',
      highlights: [
        '3, 4, 5, or 6-day adaptive splits with intelligent rest day distribution',
        'Exercise replacement drawer with equipment & muscle group filtering',
        'Seamless 1-click launch from planned exercise to Live AI coaching'
      ]
    },
    {
      id: 'habit-tracker',
      icon: CheckSquare,
      title: 'Daily Habit Tracker',
      subtitle: 'Transparent Points & Accountability Engine',
      description:
        'Stay accountable with an interactive checklist for completed meals, scheduled training, water intake, and custom wellness routines with transparent anti-duplicate points.',
      route: '/tracker',
      highlights: [
        'Transparent points: +25 for workouts, +10 for meals, +5 for water',
        'Interactive water glass tracker with metric milliliter calculation',
        'Streak progression multiplier with zero guilt penalty on rest days'
      ]
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      title: 'Progress Analytics',
      subtitle: 'Multi-Day Volume & Metric Visualizer',
      description:
        'Review multi-day completion trends, volume progressions, hydration consistency, and macro balances through accessible data charts.',
      route: '/progress',
      highlights: [
        '7-day, 30-day, and 90-day interactive volume & habit bar charts',
        'Daily repetition count tracking across all compound lift sessions',
        'Hydration adherence percentage and steady bodyweight tracking trends'
      ]
    },
    {
      id: 'ai-insights',
      icon: Sparkles,
      title: 'Personalized AI Insights',
      subtitle: 'Grounded Daily Recommendations',
      description:
        'Synthesizes your logged metrics into concrete, daily recommendations for sleep, hydration pacing, and exercise technique adjustments.',
      route: '/dashboard',
      highlights: [
        'Context-aware advice triggered by actual daily hydration and volume',
        'Tomorrow’s prep cue to calibrate restorative sleep and nutrition',
        'Direct 1-click action triggers to jump to the relevant platform tool'
      ]
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Fitness Profile',
      desc: 'Enter your biometric details, training comfort level, dietary preferences, and any equipment or physical limitations.'
    },
    {
      num: '02',
      title: 'Choose Your Primary Goal',
      desc: 'Select whether your current cycle focuses on muscle hypertrophy, fat loss, functional conditioning, or joint mobility.'
    },
    {
      num: '03',
      title: 'Follow Your Personalized Plans',
      desc: 'Access your structured weekly workout split and nutrition guides with flexible substitutions.'
    },
    {
      num: '04',
      title: 'Track Your Progress and Improve',
      desc: 'Train with the interactive camera coach, record daily habits, and watch your consistency score compound week over week.'
    }
  ];

  const faqs = [
    {
      q: 'What is FitLife AI and how does it assist my training?',
      a: 'FitLife AI is an integrated fitness platform that unifies computer-vision-guided movement coaching, nutrition planning, structured workout calendars, and daily habit tracking. It gives you immediate feedback during sets while providing a cohesive plan for the rest of your day.'
    },
    {
      q: 'How does the camera-based movement guidance work?',
      a: 'Using client-side MediaPipe Pose Landmarker models running locally in your browser, the system detects 33 anatomical landmarks to calculate key joint angles (such as hip-knee-ankle during squats or elbow flexion during push-ups). Video is processed frame-by-frame on your device and is never stored, streamed, or uploaded to any server.'
    },
    {
      q: 'Can beginners safely use FitLife AI?',
      a: 'Yes. The onboarding wizard categorizes your experience level and adjusts starting volume, exercise difficulty, and rest intervals accordingly. Every exercise includes detailed setup cues, safety warnings, and step-by-step biomechanical checkpoints.'
    },
    {
      q: 'How are meal plans personalized for Indian diets?',
      a: 'The nutrition engine respects vegetarian, vegan, and eggetarian preferences with practical meals including moong dal, paneer, chana chaat, sprouted lentils, tofu, and multigrain roti, with accurate macro and calorie estimates.'
    },
    {
      q: 'How is progress tracked over time?',
      a: 'Every completed workout, logged meal, and water intake updates your daily activity ledger. You can filter trends across 7, 30, and 90 days to visualize consistency, total repetitions, and hydration compliance.'
    },
    {
      q: 'Is FitLife AI guidance a substitute for medical advice?',
      a: 'No. FitLife AI provides educational fitness and nutrition coaching based on standard sports science principles. It does not provide medical diagnoses, treatment plans, or physical therapy. Always consult a physician before beginning any new vigorous exercise program.'
    }
  ];

  const toggleSandboxHabit = (id: string) => {
    setSandboxHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const next = !h.done;
          setSandboxPoints((pts) => (next ? pts + h.pts : pts - h.pts));
          return { ...h, done: next };
        }
        return h;
      })
    );
  };

  return (
    <div className="bg-[#0B0E14] text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-lime-500/12 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                <span className="text-lime-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                  AI Workout Coach
                </span>
                <span aria-hidden="true">·</span>
                <span>Personalized Nutrition</span>
                <span aria-hidden="true">·</span>
                <span>Smart Progress Tracking</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                Your Body. Your Goals. <br />
                <span className="text-gradient-lime">Your AI Fitness Coach.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Train smarter with real-time workout guidance, personalized nutrition, adaptive training plans and daily progress tracking — all in one place.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/signup')}
                  className="px-6 py-3.5 text-sm font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl transition-all shadow-lg shadow-lime-400/20 glow-lime flex items-center gap-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const el = document.getElementById('explore') || document.getElementById('features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Explore Modules Live</span>
                </motion.button>
              </div>

              {/* Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">33+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Pose Landmarks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Client-Side Privacy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">4-Day</div>
                  <div className="text-xs text-slate-400 mt-0.5">Adaptive Splits</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual with Real-Time Animated Pose HUD Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#121622] shadow-2xl group">
                <img
                  src="/src/assets/images/hero_workout_ai_1793202694656.jpg"
                  alt="Athlete training with FitLife AI real-time pose guidance"
                  referrerPolicy="no-referrer"
                  className="w-full h-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                {/* Live Floating Vision HUD Card */}
                <motion.div
                  className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-lime-400/50 rounded-xl p-3 text-xs space-y-1.5 shadow-xl animate-float-slow"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                      <span className="font-semibold text-lime-400 font-mono text-[11px]">POSE VISION</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-300 font-bold">
                      {heroPhase}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-lime-400 h-full rounded-full transition-all duration-100"
                        style={{ width: `${Math.min(100, ((heroAngle - 80) / 100) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-white tabular-nums">{heroAngle}°</span>
                    <span className="text-slate-400 text-[10px]">(&lt;95° target)</span>
                  </div>
                </motion.div>

                <div className="absolute top-4 right-4 bg-lime-400 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>REP {heroRep} / 12</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Exercise Active</div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Barbell & Goblet Squat</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-lime-400 font-semibold font-mono">FORM SCORE: 98%</div>
                    <div className="text-xs text-slate-300 font-mono tabular-nums">Eccentric Tempo: 2.4s</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section with Interactive 'Explore Module' Sandboxes */}
      <section id="explore" className="py-20 lg:py-28 border-b border-slate-800/80 relative">
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore FitLife AI Modules</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Engineered for Complete Physical Performance
              </h2>
              <p className="mt-3 text-slate-400 text-base">
                Try each core fitness engine live right here. Test joint angles with the computer-vision coach, calculate macro splits, explore periodization, and check off real daily habits.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>LIVE INTERACTIVE SANDBOX</span>
            </div>
          </div>

          {/* Module Selector Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            {[
              { id: 'ai-coach', label: 'AI Pose Coach', icon: Camera, badge: 'Vision' },
              { id: 'diet-planner', label: 'Diet & Macros', icon: Utensils, badge: 'Indian Diets' },
              { id: 'workout-planner', label: 'Workout Splits', icon: Calendar, badge: 'Periodized' },
              { id: 'daily-tracker', label: 'Daily Habits', icon: CheckSquare, badge: '+Points' },
              { id: 'progress-analytics', label: 'Analytics Hub', icon: TrendingUp, badge: 'Volume' },
              { id: 'ai-insights', label: 'Recovery AI', icon: Sparkles, badge: 'Biomedical' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeExploreTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveExploreTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md font-bold'
                      : 'bg-[#111622] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-lime-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isActive ? 'bg-black/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live In-Page Interactive Playground Card */}
          <div className="bg-[#111622] border border-lime-400/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-16">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* TAB 1: AI Pose Coach Sandbox */}
            {activeExploreTab === 'ai-coach' && (
              <motion.div
                key="tab-coach"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Visual Skeleton Simulation */}
                <div className="lg:col-span-5 bg-black/60 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center relative">
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-lime-400">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                    <span>KINEMATIC RIG</span>
                  </div>

                  <div className="w-48 h-48 relative flex items-center justify-center">
                    {(() => {
                      const progress = Math.min(1, Math.max(0, (180 - sandboxAngle) / (180 - 75)));
                      const hipX = 100 - progress * 15;
                      const hipY = 80 + progress * 32;
                      const kneeX = 100 - progress * 35;
                      const kneeY = 130 - progress * 5;
                      const ankleX = 100 - progress * 5;
                      const ankleY = 180;
                      const headY = 25 + progress * 28;
                      const isDepth = sandboxAngle <= 95;

                      return (
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          {/* Floor grid */}
                          <line x1="40" y1="185" x2="160" y2="185" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                          {/* Head */}
                          <circle cx={hipX} cy={headY} r="10" fill={isDepth ? '#a3e635' : '#38bdf8'} />
                          {/* Spine */}
                          <line x1={hipX} y1={headY + 10} x2={hipX} y2={hipY} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                          {/* Thigh */}
                          <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke={isDepth ? '#a3e635' : '#38bdf8'} strokeWidth="5" strokeLinecap="round" />
                          {/* Shin */}
                          <line x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} stroke={isDepth ? '#a3e635' : '#38bdf8'} strokeWidth="5" strokeLinecap="round" />
                          {/* Foot */}
                          <line x1={ankleX} y1={ankleY} x2={ankleX - 18} y2={ankleY} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

                          {/* Joint Circles */}
                          <circle cx={hipX} cy={hipY} r="4" fill="#ffffff" />
                          <circle cx={kneeX} cy={kneeY} r="5" fill={isDepth ? '#a3e635' : '#f59e0b'} />
                          <circle cx={ankleX} cy={ankleY} r="4" fill="#ffffff" />

                          {/* Target parallel depth indicator */}
                          <line x1="30" y1="112" x2="170" y2="112" stroke="#a3e635" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                          <text x="35" y="108" fill="#a3e635" fontSize="8" fontFamily="monospace">PARALLEL THRESHOLD (95°)</text>
                        </svg>
                      );
                    })()}
                  </div>

                  <div className="w-full mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Flexion Angle:</span>
                    <span className={`font-bold ${sandboxAngle <= 95 ? 'text-lime-400' : 'text-cyan-400'}`}>
                      {sandboxAngle}° ({sandboxAngle <= 95 ? 'Parallel Depth' : sandboxAngle < 150 ? 'Flexing' : 'Lockout'})
                    </span>
                  </div>
                </div>

                {/* Controls and Feedback */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Live Computer-Vision Movement Analysis</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Drag the angle slider below to simulate athletic flexion and test instantaneous biomechanical coaching cues.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-mono font-bold shrink-0">
                      33 LANDMARKS
                    </span>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-2 p-4 bg-black/40 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Knee Joint Flexion Simulation:</span>
                      <span className="font-mono text-lime-400 font-bold text-sm">{sandboxAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min={75}
                      max={180}
                      value={sandboxAngle}
                      onChange={(e) => setSandboxAngle(Number(e.target.value))}
                      className="w-full accent-lime-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>75° (Deep ATG Squat)</span>
                      <span className="text-lime-400 font-bold">&lt;95° Target</span>
                      <span>180° (Full Extension)</span>
                    </div>
                  </div>

                  {/* Coach response card */}
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-lime-400/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 uppercase">Audio Coach Verbal Cue:</span>
                      <span className={`font-bold ${sandboxAngle <= 95 ? 'text-lime-400' : 'text-amber-300'}`}>
                        {sandboxAngle <= 95 ? 'FORM CRITERIA MET (98%)' : 'ECCENTRIC CUE'}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {sandboxAngle <= 95
                        ? '"Parallel depth reached! Drive through your heels and squeeze the glutes at lockout."'
                        : sandboxAngle < 150
                        ? '"Descend deeper — hinge your hips back and maintain upright chest posture."'
                        : '"Starting lockout position. Begin steady eccentric descent on a 3-second tempo."'}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          const cue =
                            sandboxAngle <= 95
                              ? 'Parallel depth reached! Drive through your heels.'
                              : sandboxAngle < 150
                              ? 'Descend deeper. Hinge your hips back.'
                              : 'Starting lockout position. Begin eccentric descent.';
                          playVoiceDemo(cue);
                        }}
                        className="px-3 py-1.5 bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 border border-lime-400/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{audioVoiceStatus ? 'Speaking Audio Cue...' : 'Hear Audio Feedback'}</span>
                      </button>

                      <button
                        onClick={() => onNavigate('/live-workout/ex_squats')}
                        className="px-4 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Start Camera Workout</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Diet & Macros Sandbox */}
            {activeExploreTab === 'diet-planner' && (
              <motion.div
                key="tab-diet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Macro Engine & Authentic Indian Meals</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Calibrated nutrition profiles respecting regional preferences with instant ingredient substitution.
                      </p>
                    </div>
                  </div>

                  {/* Goal Switcher */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-300">Target Athletic Goal:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['muscle', 'fatloss', 'balanced'] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setSandboxDietGoal(g)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all border ${
                            sandboxDietGoal === g
                              ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-sm'
                              : 'bg-black/40 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {g === 'muscle' ? 'Muscle Gain' : g === 'fatloss' ? 'Fat Loss' : 'Maintenance'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Preference */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-300">Dietary Style:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['vegetarian', 'eggetarian', 'vegan'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSandboxDietType(t)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-medium capitalize transition-all border ${
                            sandboxDietType === t
                              ? 'bg-slate-700 text-white border-lime-400/50'
                              : 'bg-black/30 text-slate-400 border-slate-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('/diet')}
                      className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Open Full Nutrition Planner</span>
                    </button>
                  </div>
                </div>

                {/* Macro breakdown & Indian meal card */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3 p-4 bg-black/60 rounded-xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">CALORIES</div>
                      <div className="text-xl font-bold text-white font-mono mt-0.5">
                        {sandboxDietGoal === 'muscle' ? '2,400' : sandboxDietGoal === 'fatloss' ? '1,850' : '2,150'}
                      </div>
                      <div className="text-[10px] text-slate-500">kcal/day</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">PROTEIN</div>
                      <div className="text-xl font-bold text-lime-400 font-mono mt-0.5">
                        {sandboxDietGoal === 'muscle' ? '140g' : sandboxDietGoal === 'fatloss' ? '130g' : '115g'}
                      </div>
                      <div className="text-[10px] text-lime-400/70 font-mono">2.0g / kg target</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">CARBS & FAT</div>
                      <div className="text-sm font-bold text-slate-200 font-mono mt-1">
                        {sandboxDietGoal === 'muscle' ? '260g / 58g' : sandboxDietGoal === 'fatloss' ? '160g / 48g' : '220g / 52g'}
                      </div>
                      <div className="text-[10px] text-slate-500">Optimized</div>
                    </div>
                  </div>

                  {/* Interactive Indian Recipe Sample */}
                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Recommended Lunch Recipe:</span>
                      <button
                        onClick={() => setSandboxMealSubstituted(!sandboxMealSubstituted)}
                        className="text-[11px] font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Swap Meal</span>
                      </button>
                    </div>

                    <div className="p-3 bg-black/40 rounded-lg border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {sandboxMealSubstituted
                            ? 'High-Protein Moong Dal Chilla & Mint Curd'
                            : sandboxDietType === 'vegan'
                            ? 'Tofu Bhurji & Multigrain Rotis'
                            : 'Paneer Bhurji & Yellow Tadka Dal'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {sandboxMealSubstituted ? '34g Protein · 420 kcal · Zero Refined Sugar' : '38g Protein · 510 kcal · Rich in Leucine'}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-300 border border-lime-400/20 font-bold">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Workout Splits Sandbox */}
            {activeExploreTab === 'workout-planner' && (
              <motion.div
                key="tab-workout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Periodized Workout Split Configurator</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Explore training cycles designed for progressive overload and muscle hypertrophy.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {(['4day', '5day', '3day'] as const).map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          setSandboxWorkoutSplit(sp);
                          setSandboxWorkoutDay(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${
                          sandboxWorkoutSplit === sp
                            ? 'bg-lime-400 text-slate-950 border-lime-400'
                            : 'bg-black/40 text-slate-300 border-slate-800'
                        }`}
                      >
                        {sp === '4day' ? '4-Day Split' : sp === '5day' ? '5-Day Split' : '3-Day Full Body'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { day: 'Day 1', name: 'Upper Body Push', focus: 'Chest, Triceps, Anterior Delts' },
                    { day: 'Day 2', name: 'Lower Body Quad', focus: 'Squats, Lunges, Core' },
                    { day: 'Day 3', name: 'Upper Body Pull', focus: 'Back, Biceps, Rear Delts' },
                    { day: 'Day 4', name: 'Hamstring & Glute', focus: 'Deadlifts, Romanian Squats' }
                  ].map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSandboxWorkoutDay(idx)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        sandboxWorkoutDay === idx
                          ? 'bg-lime-400/10 border-lime-400 text-white'
                          : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-lime-400 font-bold uppercase">{d.day}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{d.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">{d.focus}</div>
                    </button>
                  ))}
                </div>

                {/* Exercise list for chosen day */}
                <div className="p-4 bg-black/50 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-lime-400 uppercase font-bold">Planned Session Flow</div>
                    <div className="text-sm text-slate-200">
                      Barbell Squat (4 sets × 10 reps) · Walking Lunges (3 sets × 12 reps) · Leg Extensions (3 sets × 15 reps)
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/workouts/planner')}
                    className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
                  >
                    <span>Customize Split</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 4: Daily Habits & Points Sandbox */}
            {activeExploreTab === 'daily-tracker' && (
              <motion.div
                key="tab-habits"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Compound Consistency & Streak System</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Click any habit below to see your live score increase and streak compound in real time.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {sandboxHabits.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => toggleSandboxHabit(h.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          h.done
                            ? 'bg-lime-400/10 border-lime-400/40 text-white'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                              h.done ? 'bg-lime-400 text-slate-950' : 'border border-slate-600 bg-slate-900'
                            }`}
                          >
                            {h.done && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-semibold ${h.done ? 'text-white' : 'text-slate-300'}`}>
                            {h.title}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-mono font-bold ${
                            h.done ? 'text-lime-400' : 'text-slate-500'
                          }`}
                        >
                          +{h.pts} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  {/* Points & Streak Card */}
                  <div className="p-5 bg-black/60 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">FITLIFE REWARD SCORE</div>
                        <div className="text-3xl font-extrabold text-lime-400 font-mono mt-0.5 tabular-nums">
                          {sandboxPoints} <span className="text-sm text-slate-400 font-normal">PTS</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold justify-end">
                          <Flame className="w-4 h-4 fill-amber-400" />
                          <span>14-Day Streak</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Top 5% Consistency</div>
                      </div>
                    </div>

                    {/* Quick Water Logging */}
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Hydration Target:</span>
                        </span>
                        <span className="font-mono text-cyan-300 font-bold">
                          {sandboxWaterGlasses} / 10 Glasses ({(sandboxWaterGlasses * 0.25).toFixed(2)}L)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (sandboxWaterGlasses / 10) * 100)}%` }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setSandboxWaterGlasses((w) => Math.min(10, w + 1));
                            setSandboxPoints((p) => p + 5);
                          }}
                          className="px-2.5 py-1 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/30 rounded text-[11px] font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+250ml</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('/tracker')}
                      className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>Open Daily Tracker & Badges</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Progress Analytics Sandbox */}
            {activeExploreTab === 'progress-analytics' && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Aggregated Workload & Progression Ledger</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Multi-window analytics across 7, 30, and 90 days tracking verified tonnage lifted and rep milestones.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSandboxAnalyticsTimeframe(tf)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                          sandboxAnalyticsTimeframe === tf
                            ? 'bg-lime-400 text-slate-950 border-lime-400'
                            : 'bg-black/40 text-slate-300 border-slate-800'
                        }`}
                      >
                        {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Volume Chart */}
                <div className="p-5 bg-black/60 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Weekly Training Volume Load (kg)</span>
                    <span className="font-mono text-lime-400 font-bold">TOTAL: 48,200 KG</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 h-36 items-end pt-4 border-b border-slate-800">
                    {[
                      { day: 'Mon', vol: 8200, pct: 85 },
                      { day: 'Tue', vol: 6400, pct: 65 },
                      { day: 'Wed', vol: 0, pct: 10, rest: true },
                      { day: 'Thu', vol: 9100, pct: 95 },
                      { day: 'Fri', vol: 7800, pct: 80 },
                      { day: 'Sat', vol: 5200, pct: 55 },
                      { day: 'Sun', vol: 0, pct: 10, rest: true }
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.rest ? 'Rest' : `${bar.vol}kg`}
                        </div>
                        <div
                          style={{ height: `${bar.pct}%` }}
                          className={`w-full max-w-[28px] rounded-t-md transition-all ${
                            bar.rest
                              ? 'bg-slate-800 border-t border-slate-700'
                              : 'bg-lime-400 group-hover:bg-lime-300 shadow-sm'
                          }`}
                        />
                        <div className="text-[10px] font-mono text-slate-400">{bar.day}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-6 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">ADHERENCE:</span>{' '}
                        <span className="text-lime-400 font-bold">96%</span>
                      </div>
                      <div>
                        <span className="text-slate-500">SETS COMPLETED:</span>{' '}
                        <span className="text-white font-bold">48 Sets</span>
                      </div>
                      <div>
                        <span className="text-slate-500">PRS SET:</span>{' '}
                        <span className="text-amber-400 font-bold">+3 Records</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('/progress')}
                      className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Explore Analytics Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 6: AI Recovery Insights Sandbox */}
            {activeExploreTab === 'ai-insights' && (
              <motion.div
                key="tab-insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Biomechanical AI Recommendation Engine</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Adaptive health suggestions derived from real training logs, water pacing, and muscle fatigue.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-300">Select Test Scenario:</div>
                    {[
                      { id: 'hydration', label: 'Low Water Pacing Alert' },
                      { id: 'recovery', label: 'Post-Leg Day Soreness' },
                      { id: 'tomorrow', label: 'Sleep & Testosterone Optimization' }
                    ].map((sc) => (
                      <button
                        key={sc.id}
                        onClick={() => setSandboxInsightScenario(sc.id as any)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                          sandboxInsightScenario === sc.id
                            ? 'bg-lime-400/10 border-lime-400 text-white font-bold'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 bg-black/60 rounded-xl border border-lime-400/30 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-lime-400 uppercase font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI RECOVERY ADVISOR</span>
                      </span>
                      <span className="text-slate-400">HIGH PRIORITY</span>
                    </div>

                    <div className="text-base font-bold text-white">
                      {sandboxInsightScenario === 'hydration'
                        ? 'Hydration Pacing Deficit: Drink 500ml Prior to Next Set'
                        : sandboxInsightScenario === 'recovery'
                        ? 'Glute & Hamstring Glycogen Depletion Detected'
                        : 'Circadian Sleep Target: 7.5+ Hours Tonight'}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sandboxInsightScenario === 'hydration'
                        ? 'You have recorded 4 of 10 targeted glasses today. Fluid deficits above 2% reduce myofibrillar power output by 12% and elevate tendon strain. Drink 2 glasses with a pinch of pink salt before your evening workout.'
                        : sandboxInsightScenario === 'recovery'
                        ? 'Yesterday included 12 heavy squat sets. Elevate today’s dinner protein with dal and paneer, and schedule a 15-minute foam rolling session targeting your hip flexors and vastus lateralis.'
                        : 'Your deep sleep average has hovered at 6.2 hours. Growth hormone pulses peak during slow-wave sleep. Avoid blue-light screens 45 minutes before bed to prime neuromuscular recovery.'}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate('/progress')}
                        className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <span>View All Insights in App</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Module Catalog Cards (Click to open full deep dive modal) */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">All Platform Modules</h3>
            <span className="text-xs text-slate-400">Click any card to preview full specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.id}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedModule(feat)}
                  className="bg-[#111622] border border-slate-800/80 hover:border-lime-400/50 hover:shadow-xl hover:shadow-lime-400/5 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-lime-400 group-hover:text-slate-950 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                        {feat.title}
                      </h3>
                      <div className="text-[11px] font-mono text-lime-400/80 mt-0.5 uppercase tracking-wide">
                        {feat.subtitle}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-lime-400 flex items-center gap-1.5 group-hover:text-lime-300">
                      <span>Explore module & sandbox</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#171E2E] text-slate-400 border border-slate-700">
                      Preview
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE EXPLORE MODULE MODAL & SANDBOX */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#111622] border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
                    <selectedModule.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-lime-400 uppercase">
                      INTERACTIVE MODULE EXPLORER
                    </div>
                    <h2 className="text-xl font-extrabold text-white">{selectedModule.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
                  aria-label="Close module preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Module Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedModule.description}
              </p>

              {/* DYNAMIC INTERACTIVE PLAYGROUND PER MODULE */}
              <div className="bg-[#171E2E] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    <span>Live Module Sandbox</span>
                  </span>
                  <span className="text-[10px] font-mono text-lime-400 uppercase">Interactive Control</span>
                </div>

                {/* 1. Live AI Workout Coach Sandbox */}
                {selectedModule.id === 'ai-coach' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-2">
                        <span>Test Joint Flexion Angle (Simulate Squat/Press):</span>
                        <span className="font-mono text-lime-400 font-bold">{sandboxAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min={75}
                        max={180}
                        value={sandboxAngle}
                        onChange={(e) => setSandboxAngle(Number(e.target.value))}
                        className="w-full accent-lime-400 cursor-pointer"
                      />
                    </div>

                    <div className="p-3 bg-black/60 rounded-xl border border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Real-Time Coach Response</div>
                        <div className="text-sm font-bold text-lime-300 mt-0.5">
                          {sandboxAngle <= 95
                            ? '✓ Parallel Depth Reached! Drive through heels.'
                            : sandboxAngle < 150
                            ? 'Descend deeper — hinge hips back and down.'
                            : 'Starting Lockout Position. Begin eccentric drop.'}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-slate-400">QUALITY</div>
                        <div className="text-xs font-bold text-lime-400">
                          {sandboxAngle <= 95 ? '98%' : '84%'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Personalized Diet Planner Sandbox */}
                {selectedModule.id === 'diet-planner' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex gap-2">
                      {(['muscle', 'fatloss', 'balanced'] as const).map((goal) => (
                        <button
                          key={goal}
                          onClick={() => setSandboxDietGoal(goal)}
                          className={`flex-1 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-colors border ${
                            sandboxDietGoal === goal
                              ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold'
                              : 'bg-[#121622] text-slate-300 border-slate-700'
                          }`}
                        >
                          {goal === 'muscle' ? 'Muscle Gain' : goal === 'fatloss' ? 'Fat Loss' : 'Maintenance'}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center p-3 bg-black/50 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400">Daily Calories</div>
                        <div className="text-base font-bold text-white font-mono mt-0.5">
                          {sandboxDietGoal === 'muscle' ? '2,350' : sandboxDietGoal === 'fatloss' ? '1,850' : '2,100'} kcal
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Protein Target</div>
                        <div className="text-base font-bold text-lime-400 font-mono mt-0.5">
                          {sandboxDietGoal === 'muscle' ? '135g' : sandboxDietGoal === 'fatloss' ? '125g' : '110g'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Sample Meal</div>
                        <div className="text-xs font-semibold text-slate-300 mt-1 truncate">
                          Paneer Bhurji & Dal
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Smart Workout Planner Sandbox */}
                {selectedModule.id === 'workout-planner' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex gap-2">
                      {(['4day', '5day', '3day'] as const).map((sp) => (
                        <button
                          key={sp}
                          onClick={() => setSandboxWorkoutSplit(sp)}
                          className={`flex-1 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-colors border ${
                            sandboxWorkoutSplit === sp
                              ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold'
                              : 'bg-[#121622] text-slate-300 border-slate-700'
                          }`}
                        >
                          {sp === '4day' ? '4-Day Split' : sp === '5day' ? '5-Day Split' : '3-Day Full Body'}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-black/50 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-slate-300 font-semibold">
                        <span>Periodized Breakdown:</span>
                        <span className="text-lime-400 font-mono">
                          {sandboxWorkoutSplit === '4day'
                            ? 'Upper / Lower / Pull / Push'
                            : sandboxWorkoutSplit === '5day'
                            ? 'Push / Pull / Legs / Upper / Conditioning'
                            : 'Full Body Heavy / Light / Medium'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Includes camera-compatible compound movements with programmed rest days for safe muscle growth.
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Daily Habit Tracker Sandbox */}
                {selectedModule.id === 'habit-tracker' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Interactive Habit Checklist (Click to Earn Points):</span>
                      <span className="font-mono text-lime-400 font-bold text-sm">{sandboxPoints} Pts</span>
                    </div>

                    <div className="space-y-1.5">
                      {sandboxHabits.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleSandboxHabit(item.id)}
                          className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                            item.done
                              ? 'bg-lime-400/15 border-lime-400/40 text-slate-200'
                              : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${item.done ? 'bg-lime-400 text-slate-950' : 'border border-slate-600'}`}>
                              {item.done && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={item.done ? 'line-through text-slate-400' : ''}>{item.title}</span>
                          </div>
                          <span className="font-mono text-lime-400 font-bold text-[10px]">+{item.pts} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Progress Analytics Sandbox */}
                {selectedModule.id === 'analytics' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-black/50 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between font-mono text-[11px] text-slate-300">
                        <span>Consistency Multiplier: 94%</span>
                        <span className="text-lime-400">14 Workouts Completed</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-lime-400 h-full rounded-full w-[94%]" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Tracks training velocity, repetition counts, and daily hydration compliance over 7, 30, and 90-day timeframes.
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Personalized AI Insights Sandbox */}
                {selectedModule.id === 'ai-insights' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-2">
                      {(['hydration', 'recovery', 'tomorrow'] as const).map((sc) => (
                        <button
                          key={sc}
                          onClick={() => setSandboxInsightScenario(sc)}
                          className={`flex-1 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-colors border ${
                            sandboxInsightScenario === sc
                              ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold'
                              : 'bg-[#121622] text-slate-300 border-slate-700'
                          }`}
                        >
                          {sc === 'hydration' ? 'Low Water' : sc === 'recovery' ? 'Post-Leg Day' : 'Night Prep'}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-black/60 rounded-xl border border-lime-400/30 text-[11px] space-y-1">
                      <div className="font-bold text-lime-300">
                        {sandboxInsightScenario === 'hydration'
                          ? 'Hydration Pacing Alert: 4 of 10 glasses logged'
                          : sandboxInsightScenario === 'recovery'
                          ? 'Hamstring & Glute Glycogen Replenishment'
                          : 'Tomorrow Focus: Upper Body Push'}
                      </div>
                      <div className="text-slate-400">
                        {sandboxInsightScenario === 'hydration'
                          ? 'Drink 2 glasses before your evening set to ensure joint fluid lubrication and optimal neuromuscular drive.'
                          : sandboxInsightScenario === 'recovery'
                          ? 'Pair dinner with 30g slow-digesting protein (such as dal and paneer) to promote myofibrillar repair.'
                          : 'Aim for 7.5+ hours of sleep tonight to maximize testosterone and growth hormone pulses.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400">Module Capabilities:</div>
                <div className="space-y-1.5">
                  {selectedModule.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Close Preview
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const r = selectedModule.route;
                    setSelectedModule(null);
                    onNavigate(r);
                  }}
                  className="flex-1 py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md glow-lime flex items-center justify-center gap-2"
                >
                  <span>Open {selectedModule.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#0F131D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How FitLife AI Works
            </h2>
            <p className="mt-3 text-slate-400 text-base">
              Four streamlined steps from initial onboarding to sustained athletic progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-[#141A28] border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="text-3xl font-extrabold text-lime-400 font-mono tabular-nums mb-3 flex items-center justify-between">
                    <span>{st.num}</span>
                    <div className="w-2 h-2 rounded-full bg-lime-400/40" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-20 lg:py-28 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 bg-lime-400/10 border border-lime-400/30 rounded-md text-lime-400 text-xs font-mono uppercase mb-3">
              Illustrative Dashboard Preview
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Unified Data, Frictionless Flow
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Your workouts, macro targets, and daily checklist synthesized on a single command screen.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-5xl mx-auto"
          >
            {/* Top Preview Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Welcome Back, Arjun</div>
                <div className="text-lg font-bold text-white">Tuesday Strength & Hypertrophy</div>
              </div>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Open Live Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid of Preview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Card 1: Today's Workout */}
              <div className="bg-[#171E2E] p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Today's Workout</span>
                  <span className="text-lime-400 font-mono">40 Min</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">Lower Body Foundation</div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>· Squats: 3 sets × 12 reps</div>
                  <div>· Walking Lunges: 3 sets × 10 reps</div>
                  <div>· Forearm Plank: 3 sets × 45s</div>
                </div>
              </div>

              {/* Card 2: Nutrition */}
              <div className="bg-[#171E2E] p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Daily Nutrition</span>
                  <span className="text-lime-400 font-mono tabular-nums">1,100 / 2,150 kcal</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Protein</span>
                    <span className="font-mono tabular-nums">60g / 120g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-lime-400 h-full rounded-full w-1/2" />
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">Breakfast & lunch completed</div>
                </div>
              </div>

              {/* Card 3: Daily Habits */}
              <div className="bg-[#171E2E] p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Daily Checklist</span>
                  <span className="text-lime-400 font-mono tabular-nums">135 Points</span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Hydration: 6 of 10 glasses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>8k Daily Walking Steps</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-3.5 h-3.5 rounded border border-slate-700" />
                    <span>Evening Hip Mobility</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#0F131D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Built to Remove the Guesswork from Fitness
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Whether you're starting your first week or refining an intermediate split, FitLife AI eliminates friction by coordinating training, meal timing, and recovery into one continuous feedback loop.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Safe & Friendly for Beginners</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Clear visual checkpoints and real-time audio guidance protect your lower back and joints from common beginner movement errors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Indian Staple Meal Compatibility</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No exotic or difficult ingredients. Follow macro-balanced plans built around dal, roti, paneer, sprouts, curd, and wholesome regional staples.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Transparent Points, Zero Penalties</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Rest days and mobility work are recognized as active recovery rather than failures. Points are calculated fairly and transparently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media showcase */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-xl overflow-hidden border border-slate-800 bg-[#121622] group"
              >
                <img
                  src="/src/assets/images/exercise_squat_1793202694984.jpg"
                  alt="Squat form demonstration"
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 text-xs">
                  <div className="font-semibold text-white">Squat Biomechanics</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Quadriceps & Gluteal Recruitment</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-xl overflow-hidden border border-slate-800 bg-[#121622] group"
              >
                <img
                  src="/src/assets/images/nutrition_meal_bowl_1793202697381.jpg"
                  alt="High protein fitness bowl"
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 text-xs">
                  <div className="font-semibold text-white">Balanced Macro Fuel</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Paneer, Quinoa & Greens</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-28 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold mx-auto cursor-pointer"
          >
            <Zap className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The FitLife AI Vision
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Most fitness apps either offer isolated calorie logs or pre-recorded video playlists. FitLife AI bridges the gap by making the device camera your active training partner, verifying that every repetition counts, while integrating your nutrition and daily habits into a cohesive lifestyle system.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#0F131D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Answers regarding camera privacy, workout plans, and health safety.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#141A28] border border-slate-800/80 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-lime-300 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-lime-400' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 lg:py-24 relative overflow-hidden text-center border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your Fitness Journey Starts Today.
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Set up your personalized workout schedule, nutrition preferences, and live AI camera coach in under three minutes.
          </p>
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('/signup')}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl transition-all shadow-xl shadow-lime-400/25 glow-lime inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0E14] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">
                FitLife<span className="text-lime-400">AI</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <button onClick={() => onNavigate('/workouts/library')} className="hover:text-white">
                Exercises
              </button>
              <button onClick={() => onNavigate('/diet')} className="hover:text-white">
                Nutrition
              </button>
              <button onClick={() => onNavigate('/login')} className="hover:text-white">
                Sign In
              </button>
              <button onClick={() => onNavigate('/signup')} className="hover:text-white">
                Register
              </button>
            </div>
          </div>

          <div className="text-slate-500 text-[11px] leading-relaxed max-w-4xl mx-auto text-center space-y-2">
            <p>
              Health & Medical Disclaimer: FitLife AI is an educational fitness and training technology application designed to support personal exercise habits. The information, movement evaluations, and meal plans provided do not constitute medical, diagnostic, or clinical physical therapy advice. Consult a qualified medical practitioner before undertaking strenuous physical exercise.
            </p>
            <p>© {new Date().getFullYear()} FitLife AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
