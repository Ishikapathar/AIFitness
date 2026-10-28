import { WorkoutPlan, WorkoutDay, LiveSessionSummary } from '../types';
import { INITIAL_WORKOUT_PLAN } from './sampleData';

const WORKOUT_PLAN_KEY = 'fitlife_workout_plan';
const SESSIONS_HISTORY_KEY = 'fitlife_sessions_history';

export const workoutService = {
  getWorkoutPlan(): WorkoutPlan {
    try {
      const data = localStorage.getItem(WORKOUT_PLAN_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return { ...INITIAL_WORKOUT_PLAN };
  },

  saveWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
    try {
      localStorage.setItem(WORKOUT_PLAN_KEY, JSON.stringify(plan));
    } catch {}
    return plan;
  },

  updateWorkoutDay(dayId: string, updatedFields: Partial<WorkoutDay>): WorkoutPlan {
    const plan = this.getWorkoutPlan();
    plan.days = plan.days.map((day) => {
      if (day.id === dayId) {
        return { ...day, ...updatedFields };
      }
      return day;
    });
    plan.updatedAt = new Date().toISOString();
    return this.saveWorkoutPlan(plan);
  },

  toggleDayCompletion(dayId: string): WorkoutPlan {
    const plan = this.getWorkoutPlan();
    plan.days = plan.days.map((day) => {
      if (day.id === dayId) {
        const nextState = !day.isCompleted;
        return {
          ...day,
          isCompleted: nextState,
          exercises: day.exercises.map((ex) => ({ ...ex, completed: nextState }))
        };
      }
      return day;
    });
    return this.saveWorkoutPlan(plan);
  },

  saveLiveSession(summary: LiveSessionSummary): void {
    try {
      const history: LiveSessionSummary[] = JSON.parse(localStorage.getItem(SESSIONS_HISTORY_KEY) || '[]');
      history.unshift(summary);
      localStorage.setItem(SESSIONS_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    } catch {}
  },

  getLiveSessions(): LiveSessionSummary[] {
    try {
      const data = localStorage.getItem(SESSIONS_HISTORY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [
      {
        id: 'sess_1',
        exerciseId: 'ex_squats',
        exerciseName: 'Bodyweight & Goblet Squat',
        completedReps: 12,
        targetReps: 12,
        completedSets: 3,
        targetSets: 3,
        durationSeconds: 420,
        avgRepQualityScore: 94,
        formNotes: ['Clean depth below parallel', 'Steady tempo during eccentric phase'],
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
};
