import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Utensils,
  Plus,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  Scale
} from 'lucide-react';
import { DailyTrackerState, Meal, WorkoutPlan } from '../../types';
import { trackerService } from '../../services/trackerService';
import { nutritionService } from '../../services/nutritionService';
import { workoutService } from '../../services/workoutService';

interface DailyTrackerViewProps {
  onNavigate: (route: string) => void;
}

export const DailyTrackerView: React.FC<DailyTrackerViewProps> = ({ onNavigate }) => {
  const [trackerState, setTrackerState] = useState<DailyTrackerState>(trackerService.getState());
  const [meals, setMeals] = useState<Meal[]>(nutritionService.getMeals());
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(workoutService.getWorkoutPlan());
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [weightInput, setWeightInput] = useState<string>(String(trackerState.weightRecordedKg || 74.2));
  const [pointsToast, setPointsToast] = useState<{ text: string; id: number } | null>(null);

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayWorkout = workoutPlan.days.find((d) => d.dayName === todayDayName) || workoutPlan.days[1];

  const triggerPointsToast = (pts: number, label: string) => {
    setPointsToast({ text: `+${pts} Pts: ${label}`, id: Date.now() });
    setTimeout(() => setPointsToast(null), 1800);
  };

  const handleToggleTask = (taskId: string) => {
    const isDone = trackerState.completedCustomTasks.find((t) => t.id === taskId)?.completed;
    const updated = trackerService.toggleCustomTask(taskId);
    setTrackerState({ ...updated });
    if (!isDone) {
      triggerPointsToast(15, 'Habit Completed');
    }
  };

  const handleToggleMeal = (mealId: string) => {
    const isDone = meals.find((m) => m.id === mealId)?.isCompleted;
    nutritionService.toggleMealCompletion(mealId);
    setMeals(nutritionService.getMeals());
    const updated = trackerService.toggleMeal(mealId);
    setTrackerState({ ...updated });
    if (!isDone) {
      triggerPointsToast(10, 'Meal Logged');
    }
  };

  const handleToggleWorkout = (dayId: string) => {
    const isDone = todayWorkout.isCompleted;
    workoutService.toggleDayCompletion(dayId);
    setWorkoutPlan(workoutService.getWorkoutPlan());
    const updated = trackerService.toggleWorkoutDay(dayId);
    setTrackerState({ ...updated });
    if (!isDone) {
      triggerPointsToast(25, 'Workout Complete');
    }
  };

  const handleWaterDelta = (delta: number) => {
    const updated = trackerService.addWater(delta);
    setTrackerState({ ...updated });
    if (delta > 0) {
      triggerPointsToast(5, 'Hydration +250ml');
    }
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const updated = trackerService.addCustomTask(newHabitTitle.trim(), 'habit', 15);
    setTrackerState({ ...updated });
    setNewHabitTitle('');
    setIsAddingHabit(false);
  };

  const handleSaveWeight = () => {
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 30 && val < 300) {
      const updated = trackerService.recordWeight(val);
      setTrackerState({ ...updated });
      triggerPointsToast(10, 'Weight Recorded');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {pointsToast && (
          <motion.div
            key={pointsToast.id}
            initial={{ opacity: 0, y: 25, scale: 0.8 }}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily Habit & Accountability Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Check off completed routines. Every action transparently compounds your daily fitness score.
          </p>
        </div>

        {/* Streak & Points Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 flex items-center gap-2 text-xs font-bold font-mono">
            <Flame className="w-4 h-4 fill-amber-400 animate-flame" />
            <span>{trackerState.currentStreak} DAY STREAK</span>
          </div>

          <div className="px-3.5 py-2 bg-lime-400/15 border border-lime-400/40 rounded-xl text-lime-400 flex items-center gap-2 text-xs font-bold font-mono glow-lime-subtle">
            <Award className="w-4 h-4" />
            <span>{trackerState.points} PTS TODAY</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workouts & Meals */}
        <div className="lg:col-span-7 space-y-6">
          {/* Workouts Checklist */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                <h3 className="text-base font-bold text-white">Scheduled Training</h3>
              </div>
              <span className="text-xs font-mono font-bold text-lime-400">+25 PTS</span>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleToggleWorkout(todayWorkout.id)}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                todayWorkout.isCompleted
                  ? 'bg-lime-400/10 border-lime-400/40'
                  : 'bg-[#171E2E] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                    todayWorkout.isCompleted ? 'bg-lime-400 text-slate-950 scale-105' : 'border border-slate-600'
                  }`}
                >
                  {todayWorkout.isCompleted && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold ${todayWorkout.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                    {todayWorkout.focus}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {todayWorkout.isRestDay ? 'Rest Recovery' : `${todayWorkout.exercises.length} Exercises · ${todayWorkout.estimatedDurationMinutes} mins`}
                  </div>
                </div>
              </div>

              {!todayWorkout.isRestDay && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/live-workout/${todayWorkout.exercises[0]?.exerciseId || 'ex_squats'}`);
                  }}
                  className="px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase rounded-lg transition-colors ml-2 shrink-0 shadow-sm"
                >
                  Live AI
                </button>
              )}
            </motion.div>
          </div>

          {/* Meals Checklist */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-lime-400" />
                <h3 className="text-base font-bold text-white">Diet & Fuel Logs</h3>
              </div>
              <span className="text-xs font-mono font-bold text-lime-400">+10 PTS / MEAL</span>
            </div>

            <div className="space-y-2.5">
              {meals.map((meal) => (
                <motion.div
                  key={meal.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleToggleMeal(meal.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    meal.isCompleted
                      ? 'bg-lime-400/10 border-lime-400/30'
                      : 'bg-[#171E2E] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-transform ${
                        meal.isCompleted ? 'bg-lime-400 text-slate-950 scale-105' : 'border border-slate-600'
                      }`}
                    >
                      {meal.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-lime-400 uppercase font-bold">
                        {meal.mealType}
                      </div>
                      <div className={`text-xs sm:text-sm font-semibold truncate ${meal.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {meal.name}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs text-slate-400 shrink-0 ml-2">
                    {meal.totalCalories} kcal
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hydration & Custom Habits */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hydration Card with Animated Glass Grid */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Daily Hydration</h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">+5 PTS / 2 GLASSES</span>
            </div>

            <div className="text-center py-2 space-y-2">
              <div className="text-4xl font-black text-cyan-400 font-mono tabular-nums">
                {trackerState.waterGlasses}{' '}
                <span className="text-sm font-normal text-slate-400 font-sans">
                  / {trackerState.targetWaterGlasses} glasses
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {trackerState.waterGlasses * 250} ml / {trackerState.targetWaterGlasses * 250} ml target
              </div>
            </div>

            {/* Visual Glass Tracker */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {Array.from({ length: trackerState.targetWaterGlasses }).map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleWaterDelta(i < trackerState.waterGlasses ? -1 : 1)}
                  className={`h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    i < trackerState.waterGlasses
                      ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'bg-[#171E2E] border border-slate-800 text-slate-600 hover:border-slate-700'
                  }`}
                >
                  <Droplets className="w-4 h-4" />
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleWaterDelta(-1)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                -1 Glass
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleWaterDelta(1)}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md"
              >
                +1 Glass (250ml)
              </motion.button>
            </div>
          </div>

          {/* Custom Daily Habits */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-lime-400" />
                <h3 className="text-base font-bold text-white">Daily Wellness Habits</h3>
              </div>
              <button
                onClick={() => setIsAddingHabit(!isAddingHabit)}
                className="text-xs text-lime-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Habit</span>
              </button>
            </div>

            {isAddingHabit && (
              <form onSubmit={handleAddCustomHabit} className="flex gap-2 pb-2">
                <input
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="e.g. 15 min sun exposure"
                  className="flex-1 px-3 py-1.5 bg-[#171E2E] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-lime-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-2">
              {trackerState.completedCustomTasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-lime-400/10 border-lime-400/30'
                      : 'bg-[#171E2E] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-transform ${
                        task.completed ? 'bg-lime-400 text-slate-950 scale-105' : 'border border-slate-600'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-lime-400 font-bold">+{task.points} pts</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Body Weight Check-in */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-lime-400" />
                <h3 className="text-base font-bold text-white">Weight Check-in</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Optional</span>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="74.2"
                className="w-28 px-3 py-2 bg-[#171E2E] border border-slate-700 rounded-lg text-sm text-white font-mono"
              />
              <span className="text-xs text-slate-400">kg</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveWeight}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold ml-auto transition-colors"
              >
                Log Weight
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
