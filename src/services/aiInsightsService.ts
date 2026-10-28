import { AIInsight } from '../types';
import { INITIAL_AI_INSIGHTS } from './sampleData';
import { trackerService } from './trackerService';
import { nutritionService } from './nutritionService';
import { workoutService } from './workoutService';

export const aiInsightsService = {
  getInsights(): AIInsight[] {
    const tracker = trackerService.getState();
    const nutrition = nutritionService.getDailyTotals();
    const workoutPlan = workoutService.getWorkoutPlan();

    const insights: AIInsight[] = [...INITIAL_AI_INSIGHTS];

    // Dynamic rule-based insights grounded in current state
    if (tracker.waterGlasses < 6) {
      insights.unshift({
        id: 'ins_hydration_' + Date.now(),
        type: 'recovery',
        title: 'Hydration Target Needed',
        message: `You've logged ${tracker.waterGlasses} of 10 glasses today. Maintaining intracellular hydration improves joint lubrication and muscle protein synthesis.`,
        actionableStep: 'Drink 2 glasses of water before your next workout session.',
        relatedModule: 'tracker',
        createdAt: new Date().toISOString()
      });
    }

    if (nutrition.protein < nutrition.targetProtein * 0.7) {
      insights.push({
        id: 'ins_protein_' + Date.now(),
        type: 'nutrition',
        title: 'Protein Pacing Alert',
        message: `Currently at ${nutrition.protein}g of ${nutrition.targetProtein}g daily target. Prioritize lean protein with dinner (such as paneer, dal or tofu) to stimulate recovery.`,
        actionableStep: 'Review the high-protein dinner recommendations.',
        relatedModule: 'diet',
        createdAt: new Date().toISOString()
      });
    }

    const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
    const todayPlanDay = workoutPlan.days.find((d) => d.dayName === todayDayName);
    if (todayPlanDay && !todayPlanDay.isRestDay && !todayPlanDay.isCompleted) {
      insights.unshift({
        id: 'ins_workout_' + Date.now(),
        type: 'technique',
        title: `Today's Session: ${todayPlanDay.focus}`,
        message: `You have ${todayPlanDay.exercises.length} planned exercises scheduled today. Complete camera-based pose analysis on your compound lifts for real-time rep checking.`,
        actionableStep: 'Launch Live AI Workout for today.',
        relatedModule: 'live-workout',
        createdAt: new Date().toISOString()
      });
    }

    return insights;
  },

  async fetchAiInsightsFromServer(
    userProfile?: any,
    workoutLog?: any,
    waterGlasses?: number,
    fatigueLevel?: string
  ): Promise<AIInsight[]> {
    try {
      const res = await fetch('/api/ai/coach-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, workoutLog, waterGlasses, fatigueLevel })
      });
      if (!res.ok) throw new Error('Backend request failed');
      const json = await res.json();
      if (json.data?.insights && Array.isArray(json.data.insights)) {
        return json.data.insights.map((item: any, idx: number) => ({
          id: `ins_server_${Date.now()}_${idx}`,
          type: item.type || 'recovery',
          title: item.title,
          message: item.message,
          actionableStep: item.actionableStep,
          relatedModule: item.type === 'nutrition' ? 'diet' : item.type === 'technique' ? 'live-workout' : 'tracker',
          createdAt: new Date().toISOString()
        }));
      }
    } catch {
      // Graceful fallback to client-side rules
    }
    return this.getInsights();
  }
};
