export type FitnessGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'general_fitness'
  | 'strength'
  | 'endurance'
  | 'mobility';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type EquipmentOption =
  | 'gym'
  | 'dumbbells'
  | 'barbell'
  | 'resistance_bands'
  | 'bodyweight_only'
  | 'kettlebell'
  | 'pullup_bar';

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'non_vegetarian';

export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  age: number;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  heightCm: number;
  weightKg: number;
  unitSystem: UnitSystem;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  sessionDurationMinutes: number;
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening';
  trainingLocation: 'gym' | 'home' | 'outdoor';
  availableEquipment: EquipmentOption[];
  dietaryPreference: DietaryPreference;
  foodAllergies: string[];
  dietaryRestrictions: string[];
  dislikedFoods: string[];
  cuisinePreference: string;
  dailyBudgetRange?: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  sleepHours: number;
  physicalLimitations: string[];
  isOnboardingCompleted: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type ExerciseCategory = 'strength' | 'hypertrophy' | 'calisthenics' | 'core' | 'cardio';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'glutes';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentOption[];
  difficulty: ExperienceLevel;
  instructions: string[];
  stages: {
    name: string;
    description: string;
    keyLandmarkCue: string;
  }[];
  safetyTips: string[];
  about: string;
  imageUrl: string;
  isAiSupported: boolean;
  defaultSets: number;
  defaultReps: number;
  restSeconds: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
  completed?: boolean;
}

export interface WorkoutDay {
  id: string;
  dayName: string; // e.g. "Monday"
  focus: string; // e.g. "Upper Body Strength"
  isRestDay: boolean;
  exercises: WorkoutExercise[];
  estimatedDurationMinutes: number;
  isCompleted?: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  days: WorkoutDay[];
  notes: string;
  updatedAt: string;
}

export interface LiveSessionSummary {
  id: string;
  exerciseId: string;
  exerciseName: string;
  completedReps: number;
  targetReps: number;
  completedSets: number;
  targetSets: number;
  durationSeconds: number;
  avgRepQualityScore: number;
  formNotes: string[];
  timestamp: string;
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  grams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface Meal {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  instructions?: string;
  isCompleted?: boolean;
}

export interface DietPlanDay {
  id: string;
  dayName: string;
  meals: Meal[];
  dailyTargetCalories: number;
  dailyTargetProtein: number;
  dailyTargetCarbs: number;
  dailyTargetFat: number;
}

export interface DailyTrackerState {
  date: string;
  waterGlasses: number;
  targetWaterGlasses: number;
  completedMealIds: string[];
  completedWorkoutDays: string[];
  completedCustomTasks: {
    id: string;
    title: string;
    completed: boolean;
    points: number;
    category: 'habit' | 'recovery' | 'nutrition' | 'exercise';
  }[];
  points: number;
  currentStreak: number;
  weightRecordedKg?: number;
}

export interface AIInsight {
  id: string;
  type: 'celebration' | 'technique' | 'nutrition' | 'recovery' | 'tomorrow_prep';
  title: string;
  message: string;
  actionableStep?: string;
  relatedModule?: 'live-workout' | 'diet' | 'workouts' | 'tracker';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  token?: string;
}
