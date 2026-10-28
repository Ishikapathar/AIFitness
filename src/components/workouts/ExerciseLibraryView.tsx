import React, { useState } from 'react';
import { Search, Filter, Camera, Play, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Exercise, ExerciseCategory, MuscleGroup, EquipmentOption } from '../../types';
import { exerciseService } from '../../services/exerciseService';

interface ExerciseLibraryViewProps {
  onNavigate: (route: string) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOption | 'all'>('all');
  const [aiOnly, setAiOnly] = useState(false);
  const [selectedDetailExercise, setSelectedDetailExercise] = useState<Exercise | null>(null);

  const exercises = exerciseService.getExercises({
    search,
    muscle: selectedMuscle,
    category: selectedCategory,
    equipment: selectedEquipment,
    aiOnly
  });

  const muscleFilters: { id: MuscleGroup | 'all'; label: string }[] = [
    { id: 'all', label: 'All Muscles' },
    { id: 'legs', label: 'Legs & Quads' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back & Lats' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps & Arms' },
    { id: 'core', label: 'Core & Abs' },
    { id: 'glutes', label: 'Glutes' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Exercise Discovery & Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore movement guides with biomechanical checkpoints, safety cues, and real-time AI camera tracking.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search squats, pushups, dumbbell rows..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
            />
          </div>

          <button
            onClick={() => setAiOnly(!aiOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 border w-full sm:w-auto justify-center ${
              aiOnly
                ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold'
                : 'bg-[#171E2E] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Camera Guided Only</span>
          </button>
        </div>

        {/* Muscle group filter pills (interactive button controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {muscleFilters.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedMuscle === m.id
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-[#171E2E] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-[#111622] border border-slate-800/80 hover:border-lime-400/50 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden">
                <img
                  src={ex.imageUrl}
                  alt={ex.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {ex.isAiSupported && (
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-lime-400 border border-lime-400/40 flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>AI POSE READY</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <div className="text-white font-medium capitalize">
                    {ex.primaryMuscles.join(' · ')}
                  </div>
                  <span className="text-slate-400 capitalize">{ex.difficulty}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {ex.about}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize">{ex.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{ex.equipment.join(', ').replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-2">
              <button
                onClick={() => setSelectedDetailExercise(ex)}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171E2E] hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/80"
              >
                View Guide
              </button>
              {ex.isAiSupported ? (
                <button
                  onClick={() => onNavigate(`/live-workout/${ex.id}`)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>AI Coach</span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedDetailExercise(ex)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 rounded-xl flex items-center gap-1 shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="p-12 text-center bg-[#111622] rounded-2xl border border-slate-800 text-slate-400">
          No exercises matched your current search and filter combination.
        </div>
      )}

      {/* Exercise Detail Slide-Over Modal */}
      {selectedDetailExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111622] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-lime-400 uppercase">
                  {selectedDetailExercise.category} · {selectedDetailExercise.difficulty}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5">
                  {selectedDetailExercise.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDetailExercise(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-black">
              <img
                src={selectedDetailExercise.imageUrl}
                alt={selectedDetailExercise.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">About This Movement</h4>
                <p className="text-slate-300 leading-relaxed">{selectedDetailExercise.about}</p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-2">Step-by-Step Instructions</h4>
                <div className="space-y-2">
                  {selectedDetailExercise.instructions.map((inst, i) => (
                    <div key={i} className="p-2.5 bg-[#171E2E] rounded-lg border border-slate-800 flex gap-2.5">
                      <span className="font-bold text-lime-400 font-mono">{i + 1}.</span>
                      <span className="text-slate-200">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-2">Biomechanical Stages</h4>
                <div className="space-y-2">
                  {selectedDetailExercise.stages.map((st, i) => (
                    <div key={i} className="p-2.5 bg-[#171E2E] rounded-lg border border-slate-800">
                      <div className="font-semibold text-lime-300">{st.name}</div>
                      <div className="text-slate-300 mt-0.5">{st.description}</div>
                      <div className="text-[10px] text-lime-400 font-mono mt-1">Landmark Check: {st.keyLandmarkCue}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-xl text-amber-300">
                <span className="font-bold">Safety Notes:</span> {selectedDetailExercise.safetyTips.join(' ')}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSelectedDetailExercise(null)}
                className="flex-1 py-3 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl"
              >
                Close
              </button>
              {selectedDetailExercise.isAiSupported && (
                <button
                  onClick={() => {
                    const id = selectedDetailExercise.id;
                    setSelectedDetailExercise(null);
                    onNavigate(`/live-workout/${id}`);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Live AI Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
