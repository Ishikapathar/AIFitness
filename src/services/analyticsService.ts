export interface DayAnalytics {
  date: string;
  dayLabel: string;
  workoutsCompleted: number;
  workoutsPlanned: number;
  repsCompleted: number;
  caloriesLogged: number;
  calorieTarget: number;
  proteinGrams: number;
  waterGlasses: number;
  pointsEarned: number;
  weightKg?: number;
}

export const analyticsService = {
  getAnalyticsData(range: '7d' | '30d' | '90d'): {
    days: DayAnalytics[];
    summary: {
      totalWorkouts: number;
      totalReps: number;
      avgProtein: number;
      avgHydrationPercent: number;
      totalPoints: number;
      currentStreak: number;
      completionRate: number;
    };
  } {
    const count = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const days: DayAnalytics[] = [];
    const now = new Date();

    const sampleDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayLabel = sampleDays[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];

      // Simulated authentic history based on real calendar days
      const isRest = d.getDay() === 0 || d.getDay() === 3 || d.getDay() === 6;
      const planned = isRest ? 0 : 1;
      const completed = i === 0 ? 1 : planned && Math.random() > 0.15 ? 1 : 0;
      const reps = completed ? 36 + (i % 3) * 6 : 0;
      const calories = 2050 + ((i * 37) % 250);
      const protein = 112 + ((i * 13) % 20);
      const water = 8 + (i % 4);
      const points = completed * 35 + Math.floor(water / 2) * 5 + 30;
      const weight = 74.8 - ((count - i) * 0.02);

      days.push({
        date: dateStr,
        dayLabel,
        workoutsCompleted: completed,
        workoutsPlanned: planned,
        repsCompleted: reps,
        caloriesLogged: calories,
        calorieTarget: 2150,
        proteinGrams: protein,
        waterGlasses: water,
        pointsEarned: points,
        weightKg: Number(weight.toFixed(1))
      });
    }

    const totalWorkouts = days.reduce((acc, d) => acc + d.workoutsCompleted, 0);
    const totalPlanned = days.reduce((acc, d) => acc + d.workoutsPlanned, 0);
    const totalReps = days.reduce((acc, d) => acc + d.repsCompleted, 0);
    const avgProtein = Math.round(days.reduce((acc, d) => acc + d.proteinGrams, 0) / days.length);
    const avgHydrationPercent = Math.round(
      (days.reduce((acc, d) => acc + d.waterGlasses, 0) / (days.length * 10)) * 100
    );
    const totalPoints = days.reduce((acc, d) => acc + d.pointsEarned, 0);
    const completionRate = totalPlanned > 0 ? Math.round((totalWorkouts / totalPlanned) * 100) : 100;

    return {
      days,
      summary: {
        totalWorkouts,
        totalReps,
        avgProtein,
        avgHydrationPercent,
        totalPoints,
        currentStreak: 5,
        completionRate
      }
    };
  }
};
