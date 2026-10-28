import React, { useState } from 'react';
import {
  Utensils,
  CheckCircle2,
  RefreshCw,
  Plus,
  Flame,
  ArrowRight,
  Info,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Meal, FoodItem } from '../../types';
import { nutritionService, NUTRITION_SUBSTITUTIONS } from '../../services/nutritionService';
import { trackerService } from '../../services/trackerService';

interface DietPlannerViewProps {
  onNavigate: (route: string) => void;
}

export const DietPlannerView: React.FC<DietPlannerViewProps> = ({ onNavigate }) => {
  const [meals, setMeals] = useState<Meal[]>(nutritionService.getMeals());
  const [substitutingMealId, setSubstitutingMealId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totals = nutritionService.getDailyTotals();

  const handleToggleMeal = (mealId: string) => {
    const updated = nutritionService.toggleMealCompletion(mealId);
    setMeals([...updated]);
    trackerService.toggleMeal(mealId);
  };

  const handleSubstitute = (mealId: string, newMeal: Meal) => {
    const updated = nutritionService.substituteMeal(mealId, newMeal);
    setMeals([...updated]);
    setSubstitutingMealId(null);
    setToastMessage(`Substituted with ${newMeal.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentMealToSubstitute = meals.find((m) => m.id === substitutingMealId);
  const availableSubs = currentMealToSubstitute
    ? NUTRITION_SUBSTITUTIONS[currentMealToSubstitute.mealType] || []
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Nutrition & Diet Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Macro-calibrated meal schedules with authentic Indian vegetarian & whole-food staples.
          </p>
        </div>

        {toastMessage && (
          <div className="p-2.5 bg-lime-950/80 border border-lime-800 text-lime-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Daily Macro Targets Card */}
      <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-lime-400 font-mono font-bold uppercase">DAILY TARGETS</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
              {totals.calories}{' '}
              <span className="text-sm font-sans font-normal text-slate-400">
                / {totals.targetCalories} kcal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Pattern: <strong className="text-white">Vegetarian High-Protein</strong></span>
          </div>
        </div>

        {/* 3 Macro Progress Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
          {/* Protein */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Protein Target</span>
              <span className="font-mono text-lime-400 font-bold tabular-nums">
                {totals.protein}g / {totals.targetProtein}g
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-lime-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totals.protein / totals.targetProtein) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">Essential for lean muscle preservation</div>
          </div>

          {/* Carbs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Complex Carbohydrates</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {totals.carbs}g / {totals.targetCarbs}g
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totals.carbs / totals.targetCarbs) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">Slow-digesting grains & pulses</div>
          </div>

          {/* Fats */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Healthy Dietary Fats</span>
              <span className="font-mono text-amber-400 font-bold tabular-nums">
                {totals.fat}g / {totals.targetFat}g
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totals.fat / totals.targetFat) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">Nuts, seeds & cold-pressed oils</div>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className={`bg-[#111622] border rounded-2xl p-6 transition-all ${
              meal.isCompleted ? 'border-lime-400/40 bg-[#121922]' : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleMeal(meal.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    meal.isCompleted ? 'bg-lime-400 text-slate-950' : 'border border-slate-600 hover:border-slate-400'
                  }`}
                  title={meal.isCompleted ? 'Mark unconsumed' : 'Mark meal eaten'}
                >
                  {meal.isCompleted && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </button>
                <div>
                  <div className="text-xs font-mono font-bold text-lime-400 uppercase">
                    {meal.mealType}
                  </div>
                  <h3 className={`text-base font-bold ${meal.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                    {meal.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-white">{meal.totalCalories} kcal</div>
                  <div className="text-slate-400 text-[11px]">
                    {meal.totalProtein}g P · {meal.totalCarbs}g C · {meal.totalFat}g F
                  </div>
                </div>

                <button
                  onClick={() => setSubstitutingMealId(meal.id)}
                  className="px-3 py-1.5 bg-[#171E2E] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                  <span>Substitute</span>
                </button>
              </div>
            </div>

            {/* Food items breakdown */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {meal.items.map((item) => (
                <div key={item.id} className="p-3 bg-[#171E2E] rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-slate-400 text-[11px] flex justify-between">
                    <span>Portion: {item.portion}</span>
                    <span className="font-mono text-lime-400">{item.calories} kcal</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {item.proteinGrams}g Protein
                  </div>
                </div>
              ))}
            </div>

            {meal.instructions && (
              <div className="mt-3 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-slate-300">Prep tip:</strong> {meal.instructions}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Substitute Meal Drawer Modal */}
      {substitutingMealId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111622] border border-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Substitute {currentMealToSubstitute?.mealType}</h3>
              <button
                onClick={() => setSubstitutingMealId(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {availableSubs.map((sub, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSubstitute(substitutingMealId, sub)}
                  className="p-4 rounded-xl bg-[#171E2E] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{sub.name}</span>
                    <span className="text-xs font-mono font-bold text-lime-400">{sub.totalCalories} kcal</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {sub.totalProtein}g Protein · {sub.totalCarbs}g Carbs · {sub.totalFat}g Fat
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{sub.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
