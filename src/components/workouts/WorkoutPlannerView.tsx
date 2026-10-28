import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Camera,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  ArrowRight,
  Save,
  Dumbbell
} from 'lucide-react';
import { WorkoutPlan, WorkoutDay, WorkoutExercise, Exercise } from '../../types';
import { workoutService } from '../../services/workoutService';
import { exerciseService } from '../../services/exerciseService';

interface WorkoutPlannerViewProps {
  onNavigate: (route: string) => void;
}

export const WorkoutPlannerView: React.FC<WorkoutPlannerViewProps> = ({ onNavigate }) => {
  const [plan, setPlan] = useState<WorkoutPlan>(workoutService.getWorkoutPlan());
  const [selectedDayId, setSelectedDayId] = useState<string>('day_tue');
  const [isSavedMessage, setIsSavedMessage] = useState(false);
  const [isReplacingExercise, setIsReplacingExercise] = useState<{ dayId: string; index: number } | null>(null);

  const allExercises = exerciseService.getExercises();

  const activeDay = plan.days.find((d) => d.id === selectedDayId) || plan.days[0];

  const handleToggleDayComplete = (dayId: string) => {
    const updated = workoutService.toggleDayCompletion(dayId);
    setPlan({ ...updated });
  };

  const handleSavePlan = () => {
    workoutService.saveWorkoutPlan(plan);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 3000);
  };

  const handleUpdateSets = (dayId: string, exIndex: number, delta: number) => {
    const updatedDays = plan.days.map((d) => {
      if (d.id === dayId) {
        const exercises = [...d.exercises];
        const current = exercises[exIndex];
        if (current) {
          exercises[exIndex] = {
            ...current,
            sets: Math.max(1, Math.min(6, current.sets + delta))
          };
        }
        return { ...d, exercises };
      }
      return d;
    });
    setPlan({ ...plan, days: updatedDays });
  };

  const handleUpdateReps = (dayId: string, exIndex: number, delta: number) => {
    const updatedDays = plan.days.map((d) => {
      if (d.id === dayId) {
        const exercises = [...d.exercises];
        const current = exercises[exIndex];
        if (current) {
          exercises[exIndex] = {
            ...current,
            reps: Math.max(1, Math.min(30, current.reps + delta))
          };
        }
        return { ...d, exercises };
      }
      return d;
    });
    setPlan({ ...plan, days: updatedDays });
  };

  const handleReplaceExercise = (newEx: Exercise) => {
    if (!isReplacingExercise) return;
    const { dayId, index } = isReplacingExercise;

    const updatedDays = plan.days.map((d) => {
      if (d.id === dayId) {
        const exercises = [...d.exercises];
        exercises[index] = {
          exerciseId: newEx.id,
          exercise: newEx,
          sets: newEx.defaultSets,
          reps: newEx.defaultReps,
          restSeconds: newEx.restSeconds,
          completed: false
        };
        return { ...d, exercises };
      }
      return d;
    });

    setPlan({ ...plan, days: updatedDays });
    setIsReplacingExercise(null);
  };

  const handleToggleRestDay = (dayId: string) => {
    const updatedDays = plan.days.map((d) => {
      if (d.id === dayId) {
        return { ...d, isRestDay: !d.isRestDay };
      }
      return d;
    });
    setPlan({ ...plan, days: updatedDays });
  };

  return (
    <div className="space-y-6">
      {/* Title & Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Workout Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Weekly periodization split. Adjust exercises, rep schemes, or trigger live camera sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSavedMessage && (
            <span className="text-xs text-lime-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Plan updated
            </span>
          )}
          <button
            onClick={handleSavePlan}
            className="px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Custom Plan</span>
          </button>
        </div>
      </div>

      {/* 7-Day Weekly Calendar Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {plan.days.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-lime-400/15 border-lime-400 text-white shadow-sm'
                  : 'bg-[#111622] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-lime-400">
                  {day.dayName.substring(0, 3)}
                </span>
                {day.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
              </div>
              <div className="text-xs font-semibold text-white mt-1.5 truncate">
                {day.isRestDay ? 'Rest Recovery' : day.focus.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {day.isRestDay ? 'Active Rest' : `${day.exercises.length} Movements`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Workspace Card */}
      <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-lime-400 uppercase">
                {activeDay.dayName}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                {activeDay.estimatedDurationMinutes} Minutes
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">{activeDay.focus}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleRestDay(activeDay.id)}
              className="px-3 py-1.5 bg-[#171E2E] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700"
            >
              {activeDay.isRestDay ? 'Convert to Workout Day' : 'Mark as Rest Day'}
            </button>
            <button
              onClick={() => handleToggleDayComplete(activeDay.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeDay.isCompleted
                  ? 'bg-lime-400 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeDay.isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>

        {/* Exercises list for selected day */}
        {activeDay.isRestDay ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Scheduled Active Recovery</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Allow skeletal muscle tissue to repair and replenish glycogen reserves. Light walking, stretching, and 8+ glasses of water are recommended.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDay.exercises.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#171E2E] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-black overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={item.exercise?.imageUrl || '/src/assets/images/exercise_squat_1793202694984.jpg'}
                      alt={item.exercise?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">
                      {item.exercise?.name || 'Exercise'}
                    </div>
                    <div className="text-xs text-slate-400 capitalize">
                      Primary: {item.exercise?.primaryMuscles.join(', ') || 'Muscle'}
                    </div>
                  </div>
                </div>

                {/* Adjuster controls */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Sets Adjuster */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Sets:</span>
                    <button
                      onClick={() => handleUpdateSets(activeDay.id, idx, -1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white tabular-nums w-4 text-center">
                      {item.sets}
                    </span>
                    <button
                      onClick={() => handleUpdateSets(activeDay.id, idx, 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Reps Adjuster */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Reps:</span>
                    <button
                      onClick={() => handleUpdateReps(activeDay.id, idx, -1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white tabular-nums w-6 text-center">
                      {item.reps}
                    </span>
                    <button
                      onClick={() => handleUpdateReps(activeDay.id, idx, 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Replace Button */}
                  <button
                    onClick={() => setIsReplacingExercise({ dayId: activeDay.id, index: idx })}
                    className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800/60"
                    title="Replace with alternative movement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Live AI Launch Button */}
                  <button
                    onClick={() => onNavigate(`/live-workout/${item.exerciseId}`)}
                    className="px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Live AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Replace Exercise Modal */}
      {isReplacingExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111622] border border-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Substitute Movement</h3>
              <button
                onClick={() => setIsReplacingExercise(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="space-y-2">
              {allExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleReplaceExercise(ex)}
                  className="p-3 rounded-xl bg-[#171E2E] hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-white">{ex.name}</div>
                    <div className="text-xs text-slate-400 capitalize">
                      {ex.primaryMuscles.join(', ')} · {ex.category}
                    </div>
                  </div>
                  <span className="text-xs text-lime-400 font-semibold">Select</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
