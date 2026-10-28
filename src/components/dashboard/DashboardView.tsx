import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Utensils,
  CheckCircle2,
  Dumbbell,
  Droplets,
  Flame,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Play,
  Award
} from 'lucide-react';
import { UserProfile, WorkoutPlan, Meal, DailyTrackerState, AIInsight } from '../../types';
import { workoutService } from '../../services/workoutService';
import { nutritionService } from '../../services/nutritionService';
import { trackerService } from '../../services/trackerService';
import { aiInsightsService } from '../../services/aiInsightsService';

interface DashboardViewProps {
  profile: UserProfile;
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ profile, onNavigate }) => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(workoutService.getWorkoutPlan());
  const [meals, setMeals] = useState<Meal[]>(nutritionService.getMeals());
  const [trackerState, setTrackerState] = useState<DailyTrackerState>(trackerService.getState());
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [pointsToast, setPointsToast] = useState<{ text: string; id: number } | null>(null);

  useEffect(() => {
    setWorkoutPlan(workoutService.getWorkoutPlan());
    setMeals(nutritionService.getMeals());
    setTrackerState(trackerService.getState());
    setInsights(aiInsightsService.getInsights());
  }, []);

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayWorkout = workoutPlan.days.find((d) => d.dayName === todayDayName) || workoutPlan.days[1];

  const nutritionTotals = nutritionService.getDailyTotals();

  const triggerPointsAnimation = (pts: number) => {
    setPointsToast({ text: `+${pts} Points Earned!`, id: Date.now() });
    setTimeout(() => setPointsToast(null), 1800);
  };

  const handleToggleTask = (taskId: string) => {
    const isCurrentlyDone = trackerState.completedCustomTasks.find((t) => t.id === taskId)?.completed;
    const updated = trackerService.toggleCustomTask(taskId);
    setTrackerState({ ...updated });
    if (!isCurrentlyDone) {
      triggerPointsAnimation(15);
    }
  };

  const handleToggleMeal = (mealId: string) => {
    const isCurrentlyDone = meals.find((m) => m.id === mealId)?.isCompleted;
    nutritionService.toggleMealCompletion(mealId);
    setMeals(nutritionService.getMeals());
    const updatedTracker = trackerService.toggleMeal(mealId);
    setTrackerState({ ...updatedTracker });
    if (!isCurrentlyDone) {
      triggerPointsAnimation(10);
    }
  };

  const handleAddWater = (delta: number) => {
    const updated = trackerService.addWater(delta);
    setTrackerState({ ...updated });
    if (delta > 0) {
      triggerPointsAnimation(5);
    }
  };

  const primaryInsight = insights[0] || {
    title: 'First-Day Recommendation',
    message: 'Welcome to FitLife AI! Start by reviewing the exercise library or test your camera positioning in Live AI Workout.',
    actionableStep: 'Open Live Workout.'
  };

  return (
    <div className="space-y-8 relative">
      {/* Floating Points Toast Overlay */}
      <AnimatePresence>
        {pointsToast && (
          <motion.div
            key={pointsToast.id}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="fixed top-20 right-8 z-50 bg-lime-400 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 glow-lime"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>{pointsToast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {profile.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Focus: <span className="text-lime-400 font-semibold capitalize">{profile.fitnessGoal.replace('_', ' ')}</span> · Today is {todayDayName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('/live-workout/ex_squats')}
            className="px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md glow-lime-subtle flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Live AI Workout</span>
          </motion.button>
        </div>
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#111622] border border-slate-800/80 rounded-2xl p-4 sm:p-5 transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Today's Session</span>
            <Dumbbell className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white truncate">
            {todayWorkout.isRestDay ? 'Rest & Recovery' : todayWorkout.focus.split('&')[0]}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{todayWorkout.estimatedDurationMinutes} mins planned</span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#111622] border border-slate-800/80 rounded-2xl p-4 sm:p-5 transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Logged Calories</span>
            <Utensils className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
            {nutritionTotals.calories} <span className="text-xs text-slate-400 font-sans">/ {nutritionTotals.targetCalories} kcal</span>
          </div>
          <div className="text-[11px] text-lime-400 mt-1 font-mono">
            {nutritionTotals.protein}g protein logged
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#111622] border border-slate-800/80 rounded-2xl p-4 sm:p-5 transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Water Hydration</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
            {trackerState.waterGlasses} <span className="text-xs text-slate-400 font-sans">/ {trackerState.targetWaterGlasses} glasses</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleAddWater(1)}
              className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-semibold transition-colors"
            >
              +1 Glass
            </motion.button>
            <span className="text-[11px] text-slate-400 font-mono">{(trackerState.waterGlasses * 250)}ml</span>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#111622] border border-slate-800/80 rounded-2xl p-4 sm:p-5 transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Habit Score</span>
            <Flame className="w-4 h-4 text-amber-400 animate-flame" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
            {trackerState.points} <span className="text-xs text-slate-400 font-sans">Points</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-semibold">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{trackerState.currentStreak} day consistency streak</span>
          </div>
        </motion.div>
      </div>

      {/* Main 2-Column Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Workout & Habit Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Workout Card */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-lime-400 font-semibold font-mono uppercase">
                  {todayWorkout.isRestDay ? 'RECOVERY DAY' : "TODAY'S WORKOUT"}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">{todayWorkout.focus}</h3>
              </div>
              {!todayWorkout.isRestDay && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(`/live-workout/${todayWorkout.exercises[0]?.exerciseId || 'ex_squats'}`)}
                  className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Start Workout</span>
                </motion.button>
              )}
            </div>

            {todayWorkout.isRestDay ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-sm text-slate-300">
                  Scheduled active recovery day. Focus on light walking, hydration, and muscle tissue recovery.
                </p>
                <button
                  onClick={() => onNavigate('/workouts/library')}
                  className="text-xs text-lime-400 hover:underline"
                >
                  Browse exercise guides →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60 pt-2">
                {todayWorkout.exercises.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-lime-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {item.exercise?.name || 'Compound Movement'}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {item.sets} Sets × {item.reps} Reps · Rest {item.restSeconds}s
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate(`/live-workout/${item.exerciseId}`)}
                      className="px-3 py-1.5 bg-[#171E2E] hover:bg-lime-400 hover:text-slate-950 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Live AI</span>
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Habit Checklist Preview with Pop Feedback */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Daily Habit Checklist</h3>
              <button
                onClick={() => onNavigate('/tracker')}
                className="text-xs text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-4">
              {trackerState.completedCustomTasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-lime-400/10 border-lime-400/40 text-slate-200'
                      : 'bg-[#171E2E] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        task.completed ? 'bg-lime-400 text-slate-950 scale-105' : 'border border-slate-600'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-lime-400">+{task.points} pts</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Nutrition Progress & AI Recommendation */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Recommendation Card with subtle ambient border pulse */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-[#17221A] to-[#111622] border border-lime-400/50 rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-mono mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Personalized AI Coach Insight</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">{primaryInsight.title}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {primaryInsight.message}
            </p>
            {primaryInsight.actionableStep && (
              <div className="p-3 bg-black/40 rounded-xl border border-lime-400/20 text-xs text-lime-300 font-medium flex items-center justify-between">
                <span>{primaryInsight.actionableStep}</span>
                <button
                  onClick={() => onNavigate(primaryInsight.relatedModule ? `/${primaryInsight.relatedModule}` : '/dashboard')}
                  className="underline hover:text-white shrink-0 ml-2 font-bold"
                >
                  Action
                </button>
              </div>
            )}
          </motion.div>

          {/* Nutrition Summary Card with Animated Progress Widths */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Today's Nutrition</h3>
              <button
                onClick={() => onNavigate('/diet')}
                className="text-xs text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Meal Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {/* Macro bars */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Protein ({nutritionTotals.protein}g / {nutritionTotals.targetProtein}g)</span>
                  <span className="font-mono text-lime-400 font-semibold">
                    {Math.round((nutritionTotals.protein / nutritionTotals.targetProtein) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-lime-400 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (nutritionTotals.protein / nutritionTotals.targetProtein) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Carbohydrates ({nutritionTotals.carbs}g / {nutritionTotals.targetCarbs}g)</span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {Math.round((nutritionTotals.carbs / nutritionTotals.targetCarbs) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-cyan-400 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (nutritionTotals.carbs / nutritionTotals.targetCarbs) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Fats ({nutritionTotals.fat}g / {nutritionTotals.targetFat}g)</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    {Math.round((nutritionTotals.fat / nutritionTotals.targetFat) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-amber-400 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (nutritionTotals.fat / nutritionTotals.targetFat) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Meals list */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {meals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleToggleMeal(meal.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#171E2E] hover:bg-slate-800 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                          meal.isCompleted ? 'bg-lime-400 text-slate-950 scale-105' : 'border border-slate-600'
                        }`}
                      >
                        {meal.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`truncate font-medium ${meal.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {meal.name}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0 ml-2">{meal.totalCalories} kcal</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
