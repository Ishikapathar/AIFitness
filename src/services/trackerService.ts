import { DailyTrackerState } from '../types';

const TRACKER_STORAGE_KEY = 'fitlife_daily_tracker';

const DEFAULT_TRACKER: DailyTrackerState = {
  date: new Date().toISOString().split('T')[0],
  waterGlasses: 6,
  targetWaterGlasses: 10,
  completedMealIds: ['meal_breakfast', 'meal_lunch'],
  completedWorkoutDays: ['day_mon'],
  completedCustomTasks: [
    { id: 'task_walk', title: '8,000 brisk steps walk', completed: true, points: 20, category: 'exercise' },
    { id: 'task_stretch', title: '10 min hamstring & hip mobility', completed: false, points: 15, category: 'recovery' },
    { id: 'task_sleep', title: '7.5+ hours quality recovery sleep', completed: true, points: 25, category: 'recovery' },
    { id: 'task_prep', title: 'Pack tomorrow morning healthy snack', completed: false, points: 10, category: 'nutrition' }
  ],
  points: 135,
  currentStreak: 5,
  weightRecordedKg: 74.2
};

export const trackerService = {
  getState(): DailyTrackerState {
    try {
      const data = localStorage.getItem(TRACKER_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return { ...DEFAULT_TRACKER };
  },

  saveState(state: DailyTrackerState): DailyTrackerState {
    // Recalculate transparent points deterministically
    let totalPoints = 0;
    // 25 pts per completed workout day
    totalPoints += state.completedWorkoutDays.length * 25;
    // 10 pts per completed meal
    totalPoints += state.completedMealIds.length * 10;
    // 5 pts for every 2 glasses of water
    totalPoints += Math.floor(state.waterGlasses / 2) * 5;
    // Custom task points
    for (const task of state.completedCustomTasks) {
      if (task.completed) {
        totalPoints += task.points;
      }
    }

    state.points = totalPoints;

    try {
      localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(state));
    } catch {}
    return state;
  },

  addWater(delta: number): DailyTrackerState {
    const state = this.getState();
    state.waterGlasses = Math.max(0, Math.min(20, state.waterGlasses + delta));
    return this.saveState(state);
  },

  toggleMeal(mealId: string): DailyTrackerState {
    const state = this.getState();
    if (state.completedMealIds.includes(mealId)) {
      state.completedMealIds = state.completedMealIds.filter((id) => id !== mealId);
    } else {
      state.completedMealIds.push(mealId);
    }
    return this.saveState(state);
  },

  toggleWorkoutDay(dayId: string): DailyTrackerState {
    const state = this.getState();
    if (state.completedWorkoutDays.includes(dayId)) {
      state.completedWorkoutDays = state.completedWorkoutDays.filter((id) => id !== dayId);
    } else {
      state.completedWorkoutDays.push(dayId);
    }
    return this.saveState(state);
  },

  toggleCustomTask(taskId: string): DailyTrackerState {
    const state = this.getState();
    state.completedCustomTasks = state.completedCustomTasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    return this.saveState(state);
  },

  addCustomTask(title: string, category: 'habit' | 'recovery' | 'nutrition' | 'exercise', points: number = 15): DailyTrackerState {
    const state = this.getState();
    state.completedCustomTasks.push({
      id: 'task_' + Date.now(),
      title,
      category,
      completed: false,
      points
    });
    return this.saveState(state);
  },

  recordWeight(weightKg: number): DailyTrackerState {
    const state = this.getState();
    state.weightRecordedKg = weightKg;
    return this.saveState(state);
  }
};
