import { Meal, FoodItem } from '../types';
import { INITIAL_MEALS } from './sampleData';

const MEALS_KEY = 'fitlife_meals_plan';

export const NUTRITION_SUBSTITUTIONS: Record<string, Meal[]> = {
  breakfast: [
    {
      id: 'sub_b_1',
      mealType: 'breakfast',
      name: 'High-Protein Paneer Bhurji & Multigrain Toast',
      isCompleted: false,
      totalCalories: 480,
      totalProtein: 28,
      totalCarbs: 42,
      totalFat: 20,
      instructions: 'Crumbled low-fat paneer cooked with onions, tomatoes and cumin on toasted multigrain bread.',
      items: [
        { id: 'sb_1', name: 'Low-fat paneer', portion: '150g', grams: 150, calories: 260, proteinGrams: 24, carbsGrams: 5, fatGrams: 16 },
        { id: 'sb_2', name: 'Multigrain bread', portion: '2 slices', grams: 60, calories: 150, proteinGrams: 4, carbsGrams: 28, fatGrams: 2 },
        { id: 'sb_3', name: 'Sauteed tomatoes & onions', portion: '1 cup', grams: 100, calories: 70, proteinGrams: 0, carbsGrams: 9, fatGrams: 2 }
      ]
    },
    {
      id: 'sub_b_2',
      mealType: 'breakfast',
      name: 'Sprouted Moong Dosa with Mint Chutney & Sambhar',
      isCompleted: false,
      totalCalories: 420,
      totalProtein: 22,
      totalCarbs: 58,
      totalFat: 10,
      instructions: 'Crisp green moong batter crepe paired with lentil vegetable stew and fresh mint chutney.',
      items: [
        { id: 'sb_4', name: 'Moong Dal Dosa (Pesarattu)', portion: '2 dosas', grams: 160, calories: 280, proteinGrams: 16, carbsGrams: 42, fatGrams: 6 },
        { id: 'sb_5', name: 'Vegetable Sambhar', portion: '1 bowl', grams: 180, calories: 95, proteinGrams: 5, carbsGrams: 14, fatGrams: 2 },
        { id: 'sb_6', name: 'Pudina Mint Chutney', portion: '2 tbsp', grams: 30, calories: 45, proteinGrams: 1, carbsGrams: 2, fatGrams: 2 }
      ]
    },
    {
      id: 'sub_b_3',
      mealType: 'breakfast',
      name: 'Rolled Oats Porridge with Whey, Chia & Almonds',
      isCompleted: false,
      totalCalories: 460,
      totalProtein: 32,
      totalCarbs: 54,
      totalFat: 12,
      instructions: 'Warm rolled oats simmered in soy or skim milk, folded with plant/whey protein and sliced almonds.',
      items: [
        { id: 'sb_7', name: 'Rolled Oats', portion: '60g', grams: 60, calories: 230, proteinGrams: 8, carbsGrams: 40, fatGrams: 4 },
        { id: 'sb_8', name: 'Protein Powder Scoop', portion: '1 scoop', grams: 30, calories: 120, proteinGrams: 22, carbsGrams: 2, fatGrams: 1 },
        { id: 'sb_9', name: 'Almonds & Chia Seeds', portion: '15g', grams: 15, calories: 110, proteinGrams: 2, carbsGrams: 12, fatGrams: 7 }
      ]
    }
  ],
  lunch: [
    {
      id: 'sub_l_1',
      mealType: 'lunch',
      name: 'Tadka Dal, Brown Basmati Rice & Steamed Greens',
      isCompleted: false,
      totalCalories: 620,
      totalProtein: 32,
      totalCarbs: 88,
      totalFat: 14,
      instructions: 'Yellow moong and toor dal tempered with cumin, garlic and hing with brown rice and salad.',
      items: [
        { id: 'sl_1', name: 'Yellow Moong & Toor Dal', portion: '1.5 bowls', grams: 250, calories: 240, proteinGrams: 15, carbsGrams: 36, fatGrams: 4 },
        { id: 'sl_2', name: 'Steamed Brown Rice', portion: '1.5 cups', grams: 180, calories: 215, proteinGrams: 5, carbsGrams: 45, fatGrams: 2 },
        { id: 'sl_3', name: 'Fresh low-fat curd (dahi)', portion: '1 bowl', grams: 150, calories: 95, proteinGrams: 8, carbsGrams: 7, fatGrams: 4 },
        { id: 'sl_4', name: 'Kachumber Salad', portion: '1 plate', grams: 120, calories: 70, proteinGrams: 4, carbsGrams: 0, fatGrams: 4 }
      ]
    },
    {
      id: 'sub_l_2',
      mealType: 'lunch',
      name: 'Rajma Masala with Quinoa & Cucumber Raita',
      isCompleted: false,
      totalCalories: 590,
      totalProtein: 29,
      totalCarbs: 82,
      totalFat: 12,
      instructions: 'Hearty kidney beans slow-simmered in aromatic tomato gravy, paired with fluffy quinoa and cooling raita.',
      items: [
        { id: 'sl_5', name: 'Kashmiri Rajma Masala', portion: '1.5 bowls', grams: 240, calories: 260, proteinGrams: 16, carbsGrams: 40, fatGrams: 4 },
        { id: 'sl_6', name: 'Steamed Quinoa', portion: '1 cup', grams: 140, calories: 190, proteinGrams: 6, carbsGrams: 34, fatGrams: 3 },
        { id: 'sl_7', name: 'Cucumber Mint Raita', portion: '1 bowl', grams: 150, calories: 140, proteinGrams: 7, carbsGrams: 8, fatGrams: 5 }
      ]
    }
  ],
  dinner: [
    {
      id: 'sub_d_1',
      mealType: 'dinner',
      name: 'Grilled Tofu Steak with Quinoa & Stir-Fry Veggies',
      isCompleted: false,
      totalCalories: 540,
      totalProtein: 34,
      totalCarbs: 56,
      totalFat: 18,
      instructions: 'Marinated firm tofu grilled with olive oil and spices, paired with steamed quinoa and broccoli florets.',
      items: [
        { id: 'sd_1', name: 'Organic Firm Tofu', portion: '180g', grams: 180, calories: 250, proteinGrams: 25, carbsGrams: 6, fatGrams: 14 },
        { id: 'sd_2', name: 'Steamed Quinoa', portion: '1 cup', grams: 140, calories: 190, proteinGrams: 6, carbsGrams: 34, fatGrams: 3 },
        { id: 'sd_3', name: 'Steamed Broccoli & Bell Peppers', portion: '1.5 cups', grams: 150, calories: 100, proteinGrams: 3, carbsGrams: 16, fatGrams: 1 }
      ]
    },
    {
      id: 'sub_d_2',
      mealType: 'dinner',
      name: 'Soya Chunk Curry & 2 Bajra Rotis with Salad',
      isCompleted: false,
      totalCalories: 510,
      totalProtein: 38,
      totalCarbs: 62,
      totalFat: 11,
      instructions: 'High-protein soya chunks cooked in home-style onion-tomato gravy with pearl millet (bajra) rotis.',
      items: [
        { id: 'sd_4', name: 'Soya Chunk Curry', portion: '1.5 bowls', grams: 220, calories: 240, proteinGrams: 28, carbsGrams: 18, fatGrams: 4 },
        { id: 'sd_5', name: 'Bajra Roti (Millet)', portion: '2 rotis', grams: 80, calories: 210, proteinGrams: 7, carbsGrams: 40, fatGrams: 4 },
        { id: 'sd_6', name: 'Fresh Green Salad', portion: '1 bowl', grams: 100, calories: 60, proteinGrams: 3, carbsGrams: 4, fatGrams: 3 }
      ]
    }
  ],
  snack: [
    {
      id: 'sub_s_1',
      mealType: 'snack',
      name: 'Roasted Chana & Sprouted Moong Chaat',
      isCompleted: false,
      totalCalories: 280,
      totalProtein: 16,
      totalCarbs: 38,
      totalFat: 6,
      instructions: 'Toss boiled sprouted moong with chopped cucumber, lemon juice, chaat masala, and roasted chana.',
      items: [
        { id: 'ss_1', name: 'Sprouted Green Moong', portion: '1 cup', grams: 120, calories: 140, proteinGrams: 10, carbsGrams: 22, fatGrams: 1 },
        { id: 'ss_2', name: 'Roasted Bengal Gram (Chana)', portion: '40g', grams: 40, calories: 140, proteinGrams: 6, carbsGrams: 16, fatGrams: 5 }
      ]
    },
    {
      id: 'sub_s_2',
      mealType: 'snack',
      name: 'Greek Yogurt Bowl with Berries & Walnuts',
      isCompleted: false,
      totalCalories: 260,
      totalProtein: 18,
      totalCarbs: 24,
      totalFat: 8,
      instructions: 'Plain unsweetened thick yogurt topped with fresh seasonal berries and crushed walnuts.',
      items: [
        { id: 'ss_3', name: 'Plain Greek Yogurt', portion: '150g', grams: 150, calories: 130, proteinGrams: 15, carbsGrams: 6, fatGrams: 3 },
        { id: 'ss_4', name: 'Mixed Berries & Walnuts', portion: '1/2 cup', grams: 80, calories: 130, proteinGrams: 3, carbsGrams: 18, fatGrams: 5 }
      ]
    }
  ]
};

export const nutritionService = {
  getMeals(): Meal[] {
    try {
      const data = localStorage.getItem(MEALS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [...INITIAL_MEALS];
  },

  saveMeals(meals: Meal[]): Meal[] {
    try {
      localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
    } catch {}
    return meals;
  },

  toggleMealCompletion(mealId: string): Meal[] {
    const meals = this.getMeals();
    const updated = meals.map((m) => {
      if (m.id === mealId) {
        return { ...m, isCompleted: !m.isCompleted };
      }
      return m;
    });
    return this.saveMeals(updated);
  },

  substituteMeal(mealId: string, newMeal: Meal): Meal[] {
    const meals = this.getMeals();
    const index = meals.findIndex((m) => m.id === mealId);
    if (index !== -1) {
      meals[index] = { ...newMeal, id: mealId, isCompleted: meals[index].isCompleted };
    }
    return this.saveMeals(meals);
  },

  updateFoodItemQuantity(mealId: string, itemId: string, multiplier: number): Meal[] {
    const meals = this.getMeals();
    const updated = meals.map((m) => {
      if (m.id === mealId) {
        const items = m.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              grams: Math.round(item.grams * multiplier),
              calories: Math.round(item.calories * multiplier),
              proteinGrams: Math.round(item.proteinGrams * multiplier),
              carbsGrams: Math.round(item.carbsGrams * multiplier),
              fatGrams: Math.round(item.fatGrams * multiplier)
            };
          }
          return item;
        });
        const totalCalories = items.reduce((acc, i) => acc + i.calories, 0);
        const totalProtein = items.reduce((acc, i) => acc + i.proteinGrams, 0);
        const totalCarbs = items.reduce((acc, i) => acc + i.carbsGrams, 0);
        const totalFat = items.reduce((acc, i) => acc + i.fatGrams, 0);
        return { ...m, items, totalCalories, totalProtein, totalCarbs, totalFat };
      }
      return m;
    });
    return this.saveMeals(updated);
  },

  getDailyTotals(): {
    calories: number;
    targetCalories: number;
    protein: number;
    targetProtein: number;
    carbs: number;
    targetCarbs: number;
    fat: number;
    targetFat: number;
  } {
    const meals = this.getMeals();
    const loggedMeals = meals.filter((m) => m.isCompleted);

    const calories = loggedMeals.reduce((acc, m) => acc + m.totalCalories, 0);
    const protein = loggedMeals.reduce((acc, m) => acc + m.totalProtein, 0);
    const carbs = loggedMeals.reduce((acc, m) => acc + m.totalCarbs, 0);
    const fat = loggedMeals.reduce((acc, m) => acc + m.totalFat, 0);

    return {
      calories,
      targetCalories: 2150,
      protein,
      targetProtein: 120,
      carbs,
      targetCarbs: 235,
      fat,
      targetFat: 55
    };
  }
};
