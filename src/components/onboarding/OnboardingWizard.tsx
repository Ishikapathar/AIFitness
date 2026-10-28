import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Target,
  Flame,
  Award,
  Heart,
  Zap,
  Activity,
  Home,
  Utensils,
  Moon,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import {
  UserProfile,
  FitnessGoal,
  ExperienceLevel,
  EquipmentOption,
  DietaryPreference,
  UnitSystem
} from '../../types';
import { profileService } from '../../services/profileService';

interface OnboardingWizardProps {
  onComplete: () => void;
  onNavigate: (route: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [direction, setDirection] = useState<number>(1);

  const initialProfile = profileService.getProfile();

  const [formData, setFormData] = useState<UserProfile>({
    ...initialProfile,
    fullName: initialProfile.fullName || 'Arjun Sharma',
    age: initialProfile.age || 26,
    heightCm: initialProfile.heightCm || 176,
    weightKg: initialProfile.weightKg || 72,
    unitSystem: initialProfile.unitSystem || 'metric',
    fitnessGoal: initialProfile.fitnessGoal || 'muscle_gain',
    experienceLevel: initialProfile.experienceLevel || 'intermediate',
    trainingDaysPerWeek: initialProfile.trainingDaysPerWeek || 4,
    sessionDurationMinutes: initialProfile.sessionDurationMinutes || 45,
    preferredWorkoutTime: initialProfile.preferredWorkoutTime || 'morning',
    trainingLocation: initialProfile.trainingLocation || 'gym',
    availableEquipment: initialProfile.availableEquipment || ['dumbbells', 'bodyweight_only'],
    dietaryPreference: initialProfile.dietaryPreference || 'vegetarian',
    foodAllergies: initialProfile.foodAllergies || ['None'],
    dietaryRestrictions: initialProfile.dietaryRestrictions || ['High protein'],
    dislikedFoods: initialProfile.dislikedFoods || ['Bitter gourd'],
    cuisinePreference: initialProfile.cuisinePreference || 'Indian Traditional & Fusion',
    activityLevel: initialProfile.activityLevel || 'moderately_active',
    sleepHours: initialProfile.sleepHours || 7.5,
    physicalLimitations: initialProfile.physicalLimitations || ['None'],
    isOnboardingCompleted: false
  });

  const goals: { id: FitnessGoal; title: string; desc: string; icon: any }[] = [
    {
      id: 'muscle_gain',
      title: 'Muscle Gain & Hypertrophy',
      desc: 'Progressive overload focused on building lean contractile tissue.',
      icon: Dumbbell
    },
    {
      id: 'fat_loss',
      title: 'Fat Loss & Conditioning',
      desc: 'Optimized caloric burn while protecting active lean mass.',
      icon: Flame
    },
    {
      id: 'strength',
      title: 'Strength Development',
      desc: 'Maximal compound lift output and neuromuscular efficiency.',
      icon: Zap
    },
    {
      id: 'general_fitness',
      title: 'General Health & Vitality',
      desc: 'Balanced cardiorespiratory and functional daily movement.',
      icon: Heart
    },
    {
      id: 'endurance',
      title: 'Improved Endurance',
      desc: 'Aerobic threshold and stamina for sports and daily energy.',
      icon: Activity
    },
    {
      id: 'mobility',
      title: 'Mobility & Flexibility',
      desc: 'Joint decompression, postural alignment and deep range of motion.',
      icon: Target
    }
  ];

  const experienceOptions: { id: ExperienceLevel; title: string; desc: string }[] = [
    {
      id: 'beginner',
      title: 'Beginner (0 – 1 Year)',
      desc: 'New or returning to structured training; seeking biomechanical guidance and foundational habits.'
    },
    {
      id: 'intermediate',
      title: 'Intermediate (1 – 3 Years)',
      desc: 'Comfortable with standard compound lifts; looking for adaptive split programming and form precision.'
    },
    {
      id: 'advanced',
      title: 'Advanced (3+ Years)',
      desc: 'Experienced lifter seeking fine-tuned volume progression, velocity cues, and recovery pacing.'
    }
  ];

  const equipmentList: { id: EquipmentOption; label: string }[] = [
    { id: 'bodyweight_only', label: 'Bodyweight Only' },
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'barbell', label: 'Barbell & Plates' },
    { id: 'resistance_bands', label: 'Resistance Bands' },
    { id: 'kettlebell', label: 'Kettlebells' },
    { id: 'pullup_bar', label: 'Pull-Up Bar' },
    { id: 'gym', label: 'Full Commercial Gym' }
  ];

  const toggleEquipment = (id: EquipmentOption) => {
    setFormData((prev) => {
      const exists = prev.availableEquipment.includes(id);
      const updated = exists
        ? prev.availableEquipment.filter((item) => item !== id)
        : [...prev.availableEquipment, id];
      return { ...prev, availableEquipment: updated.length ? updated : ['bodyweight_only'] };
    });
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(7, prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      const completedProfile: UserProfile = {
        ...formData,
        isOnboardingCompleted: true
      };
      profileService.saveProfile(completedProfile);
      onComplete();
      onNavigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress Bar & Header */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-lime-400 font-mono">
              STEP {currentStep} OF 7
            </span>
            <span className="font-mono">{Math.round((currentStep / 7) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-lime-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 7) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: direction * 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -25 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">Personal Information</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Baseline biometrics are used to calibrate safe training volume and caloric baselines.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Age</label>
                        <input
                          type="number"
                          min={14}
                          max={99}
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400 font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Units</label>
                        <select
                          value={formData.unitSystem}
                          onChange={(e) => setFormData({ ...formData, unitSystem: e.target.value as UnitSystem })}
                          className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                        >
                          <option value="metric">Metric (cm / kg)</option>
                          <option value="imperial">Imperial (ft / lbs)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Height ({formData.unitSystem === 'metric' ? 'cm' : 'inches'})
                        </label>
                        <input
                          type="number"
                          value={formData.heightCm}
                          onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400 font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={formData.weightKg}
                          onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400 font-mono tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Fitness Goal */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">What is your primary fitness goal?</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      We customize both your weekly training split and macronutrient targets accordingly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {goals.map((g) => {
                      const Icon = g.icon;
                      const isSelected = formData.fitnessGoal === g.id;
                      return (
                        <motion.button
                          key={g.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, fitnessGoal: g.id })}
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-lime-400/10 border-lime-400 text-white glow-lime-subtle'
                              : 'bg-[#171E2E] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{g.title}</div>
                            <div className="text-xs text-slate-400 mt-1 leading-relaxed">{g.desc}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Fitness Experience */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">Training Experience</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Ensures realistic starting volume and appropriate biomechanical progression.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {experienceOptions.map((opt) => {
                      const isSelected = formData.experienceLevel === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setFormData({ ...formData, experienceLevel: opt.id })}
                          className={`w-full p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-lime-400/10 border-lime-400 glow-lime-subtle'
                              : 'bg-[#171E2E] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-white text-sm">{opt.title}</div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Training Preferences */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">Training Preferences & Equipment</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Select where you train, what equipment is on hand, and your weekly availability.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Available Equipment</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {equipmentList.map((eq) => {
                          const isChecked = formData.availableEquipment.includes(eq.id);
                          return (
                            <button
                              key={eq.id}
                              type="button"
                              onClick={() => toggleEquipment(eq.id)}
                              className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                                isChecked
                                  ? 'bg-lime-400/15 border-lime-400 text-lime-300 font-semibold'
                                  : 'bg-[#171E2E] border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span>{eq.label}</span>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Training Days / Week</label>
                        <select
                          value={formData.trainingDaysPerWeek}
                          onChange={(e) => setFormData({ ...formData, trainingDaysPerWeek: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400 font-mono"
                        >
                          <option value={3}>3 Days (Full Body Split)</option>
                          <option value={4}>4 Days (Upper / Lower Split)</option>
                          <option value={5}>5 Days (Push / Pull / Legs)</option>
                          <option value={6}>6 Days (Athletic Hypertrophy)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Session Duration</label>
                        <select
                          value={formData.sessionDurationMinutes}
                          onChange={(e) => setFormData({ ...formData, sessionDurationMinutes: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400 font-mono"
                        >
                          <option value={30}>30 Minutes</option>
                          <option value={45}>45 Minutes (Recommended)</option>
                          <option value={60}>60 Minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Nutrition Preferences */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">Nutrition & Diet Preferences</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Tailored with authentic Indian staples (dal, paneer, sprouts, roti) to match your lifestyle.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Dietary Pattern</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['vegetarian', 'vegan', 'eggetarian', 'non_vegetarian'] as DietaryPreference[]).map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setFormData({ ...formData, dietaryPreference: d })}
                            className={`p-3 rounded-xl border text-center text-xs capitalize transition-all ${
                              formData.dietaryPreference === d
                                ? 'bg-lime-400/15 border-lime-400 text-lime-300 font-bold'
                                : 'bg-[#171E2E] border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {d.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Food Allergies (or type 'None')
                      </label>
                      <input
                        type="text"
                        value={formData.foodAllergies.join(', ')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            foodAllergies: e.target.value.split(',').map((s) => s.trim())
                          })
                        }
                        placeholder="e.g. Peanuts, Lactose, Gluten, None"
                        className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Dietary Focus / Restrictions
                      </label>
                      <input
                        type="text"
                        value={formData.dietaryRestrictions.join(', ')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dietaryRestrictions: e.target.value.split(',').map((s) => s.trim())
                          })
                        }
                        placeholder="e.g. High Protein, Low Sodium"
                        className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Lifestyle & Limitations */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">Daily Lifestyle & Joint Health</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Helps our AI suggest appropriate rest periods and avoid stressful joint loading.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">General Activity Level</label>
                      <select
                        value={formData.activityLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            activityLevel: e.target.value as any
                          })
                        }
                        className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                      >
                        <option value="sedentary">Desk job / mostly seated</option>
                        <option value="lightly_active">Light daily walking (4,000–6,000 steps)</option>
                        <option value="moderately_active">Moderately active (7,000–10,000 steps)</option>
                        <option value="very_active">Physically demanding work / high athlete volume</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Average Sleep per Night: <span className="text-lime-400 font-mono">{formData.sleepHours} Hours</span>
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={10}
                        step={0.5}
                        value={formData.sleepHours}
                        onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
                        className="w-full accent-lime-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Physical Limitations or Joint Cautions
                      </label>
                      <input
                        type="text"
                        value={formData.physicalLimitations.join(', ')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            physicalLimitations: e.target.value.split(',').map((s) => s.trim())
                          })
                        }
                        placeholder="e.g. Mild wrist stiffness, Right knee sensitivity, None"
                        className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Review & Final Confirmation */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">Review Your Profile</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Everything looks primed. Confirm your setup to generate your custom dashboard and workout split.
                    </p>
                  </div>

                  <div className="bg-[#171E2E] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-slate-400">Athlete Name:</span>
                        <div className="font-semibold text-white text-sm">{formData.fullName}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Primary Goal:</span>
                        <div className="font-semibold text-lime-400 text-sm capitalize">
                          {formData.fitnessGoal.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400">Schedule:</span>
                        <div className="font-medium text-slate-200">{formData.trainingDaysPerWeek} Days / {formData.sessionDurationMinutes}m</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Experience:</span>
                        <div className="font-medium text-slate-200 capitalize">{formData.experienceLevel}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Dietary Pattern:</span>
                        <div className="font-medium text-slate-200 capitalize">{formData.dietaryPreference.replace('_', ' ')}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Estimated Daily Calorie Target:</span>
                      <span className="text-sm font-bold font-mono text-lime-400">~2,150 kcal (120g Protein)</span>
                    </div>
                  </div>

                  {isFinishing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-lime-950/40 border border-lime-800/80 rounded-xl text-center space-y-2"
                    >
                      <Sparkles className="w-5 h-5 text-lime-400 animate-spin mx-auto" />
                      <div className="text-xs font-semibold text-lime-300">
                        Calibrating your adaptive training split and nutrition plan...
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-800/80">
            {currentStep > 1 ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handlePrev}
                className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </motion.button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-md glow-lime-subtle"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                disabled={isFinishing}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-lime-400/20 glow-lime"
              >
                <span>Launch My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
