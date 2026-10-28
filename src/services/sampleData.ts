import { Exercise, Meal, UserProfile, WorkoutPlan } from '../types';

export const SAMPLE_PROFILE: UserProfile = {
  id: 'usr_demo_101',
  fullName: 'Arjun Sharma',
  email: 'arjun.fitlife@example.com',
  age: 27,
  gender: 'male',
  heightCm: 178,
  weightKg: 74,
  unitSystem: 'metric',
  fitnessGoal: 'muscle_gain',
  experienceLevel: 'intermediate',
  trainingDaysPerWeek: 4,
  sessionDurationMinutes: 45,
  preferredWorkoutTime: 'morning',
  trainingLocation: 'gym',
  availableEquipment: ['gym', 'dumbbells', 'barbell', 'bodyweight_only'],
  dietaryPreference: 'vegetarian',
  foodAllergies: ['None'],
  dietaryRestrictions: ['High protein'],
  dislikedFoods: ['Bitter gourd'],
  cuisinePreference: 'North & South Indian',
  dailyBudgetRange: 'Moderate',
  activityLevel: 'moderately_active',
  sleepHours: 7.5,
  physicalLimitations: ['Mild wrist stiffness on heavy push'],
  isOnboardingCompleted: true,
  avatarUrl: '/src/assets/images/user_avatar_trainer_1793202696748.jpg',
  createdAt: '2026-10-01T08:00:00Z',
};

export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'ex_squats',
    name: 'Bodyweight & Goblet Squat',
    slug: 'squats',
    category: 'strength',
    primaryMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core'],
    equipment: ['bodyweight_only', 'dumbbells', 'kettlebell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Brace your core, hinge your hips back and bend your knees simultaneously.',
      'Descend until your thighs are at least parallel to the floor, keeping your chest proud and spine neutral.',
      'Drive powerfully through your heels and mid-foot to return to full hip extension.'
    ],
    stages: [
      {
        name: 'Standing Setup',
        description: 'Hips and knees locked, posture tall, shoulders back.',
        keyLandmarkCue: 'Hip-Knee-Ankle vertical angle > 165°'
      },
      {
        name: 'Bottom Squat Depth',
        description: 'Thighs parallel to floor, knees tracking over toes without caving in.',
        keyLandmarkCue: 'Hip-Knee-Ankle flexion angle < 95°'
      },
      {
        name: 'Ascent & Lockout',
        description: 'Squeeze glutes at top, maintain steady breathing.',
        keyLandmarkCue: 'Return to vertical angle > 165°'
      }
    ],
    safetyTips: [
      'Avoid letting your knees collapse inward (valgus collapse).',
      'Keep your heels firmly grounded throughout the entire repetition.',
      'Do not round your lower back at bottom depth (butt wink).'
    ],
    about: 'The squat is the king of lower-body compound movements. It recruits the quadriceps, hamstrings, gluteus maximus, and stabilizes the spinal erectors and core.',
    imageUrl: '/src/assets/images/exercise_squat_1793202694984.jpg',
    isAiSupported: true,
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60
  },
  {
    id: 'ex_pushups',
    name: 'Standard Push-Up',
    slug: 'push-ups',
    category: 'calisthenics',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'core'],
    equipment: ['bodyweight_only'],
    difficulty: 'beginner',
    instructions: [
      'Place hands slightly wider than shoulder-width, fingers spread, wrists under shoulders.',
      'Form a straight plank from crown to heels, engaging glutes and abdomen.',
      'Lower your chest until your elbows form approximately a 90-degree angle, keeping elbows tucked at 45 degrees to the torso.',
      'Press firmly through your palms to return to full arm extension without hyper-extending the elbows.'
    ],
    stages: [
      {
        name: 'High Plank Setup',
        description: 'Straight line from heels to head, arms fully extended.',
        keyLandmarkCue: 'Elbow angle > 160°, Hip alignment angle 170°–180°'
      },
      {
        name: 'Chest Descent',
        description: 'Chest hovering 2 inches off the mat, elbows tucked.',
        keyLandmarkCue: 'Elbow angle < 90°'
      },
      {
        name: 'Press Back Up',
        description: 'Push floor away, maintain rigid trunk.',
        keyLandmarkCue: 'Elbows back to > 160°'
      }
    ],
    safetyTips: [
      'Do not let your hips sag towards the floor or pike upward.',
      'Keep your neck neutral; avoid reaching forward with your chin.',
      'Do not flare your elbows 90 degrees out to the sides to protect the rotator cuff.'
    ],
    about: 'A premier upper-body calisthenics exercise developing pectoral density, anterior deltoids, triceps brachii, and anti-extension trunk stability.',
    imageUrl: '/src/assets/images/exercise_pushup_1793202696566.jpg',
    isAiSupported: true,
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60
  },
  {
    id: 'ex_bicep_curls',
    name: 'Dumbbell Bicep Curl',
    slug: 'bicep-curls',
    category: 'hypertrophy',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['shoulders'],
    equipment: ['dumbbells', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Stand upright holding dumbbells at arm’s length with palms facing forward.',
      'Keep your upper arms stationary and elbows pinned close to your torso.',
      'Curl the weights upward contracting your biceps until the dumbbells are at shoulder level.',
      'Pause for a brief peak contraction, then lower slowly back to the starting position.'
    ],
    stages: [
      {
        name: 'Extension Setup',
        description: 'Arms lengthened, elbows at sides, shoulders relaxed.',
        keyLandmarkCue: 'Shoulder-Elbow-Wrist angle > 155°'
      },
      {
        name: 'Peak Flexion',
        description: 'Forearms curled upward, maximum bicep tension without elbow drift.',
        keyLandmarkCue: 'Shoulder-Elbow-Wrist angle < 55°'
      },
      {
        name: 'Eccentric Release',
        description: 'Control the descent over 2-3 seconds.',
        keyLandmarkCue: 'Elbow angle returning to > 155°'
      }
    ],
    safetyTips: [
      'Avoid swinging your hips or arching your lower back to generate momentum.',
      'Do not pull your elbows forward during the movement.',
      'Control the descent to maximize hypertrophic tension on the eccentric phase.'
    ],
    about: 'Isolation movement targeting the long and short heads of the bicep brachii as well as the brachialis and brachioradialis.',
    imageUrl: '/src/assets/images/hero_workout_ai_1793202694656.jpg',
    isAiSupported: true,
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45
  },
  {
    id: 'ex_lunges',
    name: 'Walking & Reverse Lunges',
    slug: 'lunges',
    category: 'strength',
    primaryMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core'],
    equipment: ['bodyweight_only', 'dumbbells'],
    difficulty: 'intermediate',
    instructions: [
      'Step backward or forward with one leg, keeping your torso upright.',
      'Lower your back knee smoothly toward the ground until both knees are bent at roughly 90 degrees.',
      'Push off the front foot to return to the starting position.'
    ],
    stages: [
      { name: 'Step & Drop', description: 'Knees at 90°, upright spine.', keyLandmarkCue: 'Front knee angle ~90°' },
      { name: 'Drive Up', description: 'Drive through front heel to standing.', keyLandmarkCue: 'Return to neutral' }
    ],
    safetyTips: ['Do not let the front knee shift past the toes excessively.', 'Keep hips level.'],
    about: 'Unilateral leg exercise addressing strength imbalances between limbs and enhancing functional hip stability.',
    imageUrl: '/src/assets/images/exercise_squat_1793202694984.jpg',
    isAiSupported: false,
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60
  },
  {
    id: 'ex_shoulder_press',
    name: 'Overhead Dumbbell Shoulder Press',
    slug: 'shoulder-press',
    category: 'strength',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['core'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    instructions: [
      'Hold dumbbells at ear height with elbows flared at about 60 degrees.',
      'Press upward overhead until arms are extended but not locked.',
      'Lower smoothly back to ear height with full control.'
    ],
    stages: [
      { name: 'Rack Position', description: 'Weights at shoulder level.', keyLandmarkCue: 'Elbows at 90°' },
      { name: 'Overhead Lockout', description: 'Biceps next to ears.', keyLandmarkCue: 'Elbows extended overhead' }
    ],
    safetyTips: ['Avoid hyper-extending the lumbar spine.', 'Keep ribcage tucked down.'],
    about: 'Vertical pressing staple developing the anterior and lateral deltoid heads and tricep lockouts.',
    imageUrl: '/src/assets/images/hero_workout_ai_1793202694656.jpg',
    isAiSupported: false,
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60
  },
  {
    id: 'ex_plank',
    name: 'Forearm Plank',
    slug: 'plank',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: ['bodyweight_only'],
    difficulty: 'beginner',
    instructions: [
      'Rest on forearms with elbows directly beneath your shoulders.',
      'Extend legs back, balance on toes, and hold body in a rigid straight line.',
      'Engage glutes and pull navel toward your spine, breathing evenly.'
    ],
    stages: [
      { name: 'Isometric Hold', description: 'Neutral neck, flat back, active core.', keyLandmarkCue: 'Spine in line' }
    ],
    safetyTips: ['Do not allow lower back to sag or shoulder blades to wing.', 'Breathe continuously.'],
    about: 'Fundamental isometric core exercise that reinforces anti-extension resistance and spinal stiffness.',
    imageUrl: '/src/assets/images/exercise_pushup_1793202696566.jpg',
    isAiSupported: false,
    defaultSets: 3,
    defaultReps: 45, // seconds
    restSeconds: 45
  },
  {
    id: 'ex_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    slug: 'dumbbell-row',
    category: 'strength',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['core'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    instructions: [
      'Hinge forward with one hand on a bench or knee for support, back flat.',
      'Hold dumbbell with arm extended downward, pulling elbow straight up toward your hip pocket.',
      'Squeeze your lats and mid-back at the top, then lower smoothly.'
    ],
    stages: [
      { name: 'Stretch', description: 'Full lat stretch at bottom.', keyLandmarkCue: 'Arm extended' },
      { name: 'Pull', description: 'Elbow past torso, scapula retracted.', keyLandmarkCue: 'Elbow flexed to hip' }
    ],
    safetyTips: ['Do not twist your torso excessively to jerk the weight up.', 'Keep neck relaxed.'],
    about: 'Unilateral horizontal pulling builder targeting the latissimus dorsi, rhomboids, and rear delts.',
    imageUrl: '/src/assets/images/hero_workout_ai_1793202694656.jpg',
    isAiSupported: false,
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60
  },
  {
    id: 'ex_lat_pulldown',
    name: 'Lat Pulldown / Band Pull-Down',
    slug: 'lat-pulldown',
    category: 'strength',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['core'],
    equipment: ['gym', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Grip the bar slightly wider than shoulder width with palms facing forward.',
      'Pull the bar down toward your upper chest while leaning back very slightly.',
      'Pause and squeeze your shoulder blades, then return with control to full overhead extension.'
    ],
    stages: [
      { name: 'Full Extension', description: 'Arms stretched upward.', keyLandmarkCue: 'Arms straight' },
      { name: 'Chest Pull', description: 'Bar touched to collarbone, elbows driving down.', keyLandmarkCue: 'Lats engaged' }
    ],
    safetyTips: ['Never pull behind the neck.', 'Avoid leaning back excessively to use bodyweight.'],
    about: 'Foundational vertical pulling exercise essential for back width, postural balance, and grip endurance.',
    imageUrl: '/src/assets/images/exercise_pushup_1793202696566.jpg',
    isAiSupported: false,
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60
  }
];

export const INITIAL_WORKOUT_PLAN: WorkoutPlan = {
  id: 'plan_balanced_split',
  name: 'Adaptive Strength & Hypertrophy Split',
  goal: 'muscle_gain',
  experienceLevel: 'intermediate',
  notes: '4-day upper/lower athletic hypertrophy progression with AI camera movement checks.',
  updatedAt: '2026-10-28T08:00:00Z',
  days: [
    {
      id: 'day_mon',
      dayName: 'Monday',
      focus: 'Upper Body Push & Calisthenics',
      isRestDay: false,
      estimatedDurationMinutes: 45,
      isCompleted: true,
      exercises: [
        { exerciseId: 'ex_pushups', exercise: SAMPLE_EXERCISES[1], sets: 3, reps: 12, restSeconds: 60, completed: true },
        { exerciseId: 'ex_shoulder_press', exercise: SAMPLE_EXERCISES[4], sets: 3, reps: 10, restSeconds: 60, completed: true },
        { exerciseId: 'ex_plank', exercise: SAMPLE_EXERCISES[5], sets: 3, reps: 45, restSeconds: 45, completed: true }
      ]
    },
    {
      id: 'day_tue',
      dayName: 'Tuesday',
      focus: 'Lower Body Foundation & Core',
      isRestDay: false,
      estimatedDurationMinutes: 40,
      isCompleted: false,
      exercises: [
        { exerciseId: 'ex_squats', exercise: SAMPLE_EXERCISES[0], sets: 3, reps: 12, restSeconds: 60, completed: false },
        { exerciseId: 'ex_lunges', exercise: SAMPLE_EXERCISES[3], sets: 3, reps: 10, restSeconds: 60, completed: false },
        { exerciseId: 'ex_plank', exercise: SAMPLE_EXERCISES[5], sets: 3, reps: 45, restSeconds: 45, completed: false }
      ]
    },
    {
      id: 'day_wed',
      dayName: 'Wednesday',
      focus: 'Active Recovery & Mobility',
      isRestDay: true,
      estimatedDurationMinutes: 20,
      isCompleted: false,
      exercises: []
    },
    {
      id: 'day_thu',
      dayName: 'Thursday',
      focus: 'Upper Body Pull & Arms',
      isRestDay: false,
      estimatedDurationMinutes: 45,
      isCompleted: false,
      exercises: [
        { exerciseId: 'ex_dumbbell_row', exercise: SAMPLE_EXERCISES[6], sets: 3, reps: 12, restSeconds: 60, completed: false },
        { exerciseId: 'ex_bicep_curls', exercise: SAMPLE_EXERCISES[2], sets: 3, reps: 12, restSeconds: 45, completed: false },
        { exerciseId: 'ex_lat_pulldown', exercise: SAMPLE_EXERCISES[7], sets: 3, reps: 12, restSeconds: 60, completed: false }
      ]
    },
    {
      id: 'day_fri',
      dayName: 'Friday',
      focus: 'Full Body Conditioning & Core',
      isRestDay: false,
      estimatedDurationMinutes: 40,
      isCompleted: false,
      exercises: [
        { exerciseId: 'ex_squats', exercise: SAMPLE_EXERCISES[0], sets: 3, reps: 12, restSeconds: 60, completed: false },
        { exerciseId: 'ex_pushups', exercise: SAMPLE_EXERCISES[1], sets: 3, reps: 10, restSeconds: 60, completed: false },
        { exerciseId: 'ex_bicep_curls', exercise: SAMPLE_EXERCISES[2], sets: 3, reps: 10, restSeconds: 45, completed: false }
      ]
    },
    {
      id: 'day_sat',
      dayName: 'Saturday',
      focus: 'Outdoor Walk & Light Mobility',
      isRestDay: true,
      estimatedDurationMinutes: 30,
      isCompleted: false,
      exercises: []
    },
    {
      id: 'day_sun',
      dayName: 'Sunday',
      focus: 'Full Rest & Weekly Prep',
      isRestDay: true,
      estimatedDurationMinutes: 0,
      isCompleted: false,
      exercises: []
    }
  ]
};

export const INITIAL_MEALS: Meal[] = [
  {
    id: 'meal_breakfast',
    mealType: 'breakfast',
    name: 'High-Protein Paneer Bhurji & Multigrain Toast',
    isCompleted: true,
    totalCalories: 480,
    totalProtein: 28,
    totalCarbs: 42,
    totalFat: 20,
    instructions: 'Saute crumbled paneer with turmeric, diced tomatoes, onions, and green chilies. Serve with 2 toasted multigrain rotis or bread slices.',
    items: [
      { id: 'f_paneer', name: 'Low-fat fresh paneer', portion: '150g', grams: 150, calories: 260, proteinGrams: 24, carbsGrams: 5, fatGrams: 16 },
      { id: 'f_bread', name: 'Multigrain toast', portion: '2 slices', grams: 60, calories: 150, proteinGrams: 4, carbsGrams: 28, fatGrams: 2 },
      { id: 'f_veggies', name: 'Sauteed tomatoes & onions', portion: '1 cup', grams: 100, calories: 70, proteinGrams: 0, carbsGrams: 9, fatGrams: 2 }
    ]
  },
  {
    id: 'meal_lunch',
    mealType: 'lunch',
    name: 'Tadka Dal, Brown Basmati Rice & Steamed Greens',
    isCompleted: true,
    totalCalories: 620,
    totalProtein: 32,
    totalCarbs: 88,
    totalFat: 14,
    instructions: 'Yellow moong and toor dal tempered with cumin, garlic and hing. Accompanied by steamed brown rice, cucumber-tomato salad and curd.',
    items: [
      { id: 'f_dal', name: 'Yellow Moong & Toor Dal', portion: '1.5 bowls', grams: 250, calories: 240, proteinGrams: 15, carbsGrams: 36, fatGrams: 4 },
      { id: 'f_rice', name: 'Steamed Brown Rice', portion: '1.5 cups', grams: 180, calories: 215, proteinGrams: 5, carbsGrams: 45, fatGrams: 2 },
      { id: 'f_curd', name: 'Fresh low-fat curd (dahi)', portion: '1 bowl', grams: 150, calories: 95, proteinGrams: 8, carbsGrams: 7, fatGrams: 4 },
      { id: 'f_salad', name: 'Kachumber Salad', portion: '1 plate', grams: 120, calories: 70, proteinGrams: 4, carbsGrams: 0, fatGrams: 4 }
    ]
  },
  {
    id: 'meal_snack',
    mealType: 'snack',
    name: 'Roasted Chana & Sprouted Moong Chaat',
    isCompleted: false,
    totalCalories: 280,
    totalProtein: 16,
    totalCarbs: 38,
    totalFat: 6,
    instructions: 'Toss boiled sprouted moong with chopped cucumber, lemon juice, chaat masala, and roasted chana.',
    items: [
      { id: 'f_moong', name: 'Sprouted Green Moong', portion: '1 cup', grams: 120, calories: 140, proteinGrams: 10, carbsGrams: 22, fatGrams: 1 },
      { id: 'f_chana', name: 'Roasted Bengal Gram (Chana)', portion: '40g', grams: 40, calories: 140, proteinGrams: 6, carbsGrams: 16, fatGrams: 5 }
    ]
  },
  {
    id: 'meal_dinner',
    mealType: 'dinner',
    name: 'Grilled Tofu Steak with Quinoa & Stir-Fry Veggies',
    isCompleted: false,
    totalCalories: 540,
    totalProtein: 34,
    totalCarbs: 56,
    totalFat: 18,
    instructions: 'Marinated firm tofu grilled with olive oil and spices, paired with steamed quinoa and broccoli florets.',
    items: [
      { id: 'f_tofu', name: 'Organic Firm Tofu', portion: '180g', grams: 180, calories: 250, proteinGrams: 25, carbsGrams: 6, fatGrams: 14 },
      { id: 'f_quinoa', name: 'Steamed Quinoa', portion: '1 cup', grams: 140, calories: 190, proteinGrams: 6, carbsGrams: 34, fatGrams: 3 },
      { id: 'f_broccoli', name: 'Steamed Broccoli & Bell Peppers', portion: '1.5 cups', grams: 150, calories: 100, proteinGrams: 3, carbsGrams: 16, fatGrams: 1 }
    ]
  }
];

export const INITIAL_AI_INSIGHTS = [
  {
    id: 'ins_1',
    type: 'technique' as const,
    title: 'Squat Depth & Knee Alignment',
    message: 'In your last live workout, your bottom squat depth averaged 88° flexion with consistent foot contact. Focus on driving knees slightly outward during the bottom transition.',
    actionableStep: 'Review the squat guide before your Tuesday session.',
    relatedModule: 'live-workout' as const,
    createdAt: '2026-10-28T07:30:00Z'
  },
  {
    id: 'ins_2',
    type: 'nutrition' as const,
    title: 'Protein Distribution Target',
    message: 'You have logged 60g of your 110g daily protein goal across breakfast and lunch. Completing your afternoon snack and dinner keeps you on pace for muscle recovery.',
    actionableStep: 'Log your evening sprout chaat to hit afternoon targets.',
    relatedModule: 'diet' as const,
    createdAt: '2026-10-28T08:15:00Z'
  },
  {
    id: 'ins_3',
    type: 'tomorrow_prep' as const,
    title: 'Tomorrow: Tuesday Lower Body',
    message: 'Tomorrow features Goblet Squats and Lunges. Aim for 7.5 hours of sleep tonight to optimize quadriceps and gluteal glycogen replenishment.',
    actionableStep: 'Set a bedtime reminder for 10:30 PM.',
    relatedModule: 'workouts' as const,
    createdAt: '2026-10-28T08:30:00Z'
  }
];
