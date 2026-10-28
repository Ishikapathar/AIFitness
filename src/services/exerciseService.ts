import { Exercise, ExerciseCategory, MuscleGroup, EquipmentOption } from '../types';
import { SAMPLE_EXERCISES } from './sampleData';

export const exerciseService = {
  getExercises(filters?: {
    search?: string;
    category?: ExerciseCategory | 'all';
    muscle?: MuscleGroup | 'all';
    equipment?: EquipmentOption | 'all';
    aiOnly?: boolean;
  }): Exercise[] {
    let list = [...SAMPLE_EXERCISES];

    if (!filters) return list;

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
          ex.category.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter((ex) => ex.category === filters.category);
    }

    if (filters.muscle && filters.muscle !== 'all') {
      list = list.filter(
        (ex) =>
          ex.primaryMuscles.includes(filters.muscle as MuscleGroup) ||
          ex.secondaryMuscles.includes(filters.muscle as MuscleGroup)
      );
    }

    if (filters.equipment && filters.equipment !== 'all') {
      list = list.filter((ex) => ex.equipment.includes(filters.equipment as EquipmentOption));
    }

    if (filters.aiOnly) {
      list = list.filter((ex) => ex.isAiSupported);
    }

    return list;
  },

  getExerciseById(id: string): Exercise | undefined {
    return SAMPLE_EXERCISES.find((ex) => ex.id === id || ex.slug === id);
  },

  getExerciseBySlug(slug: string): Exercise | undefined {
    return SAMPLE_EXERCISES.find((ex) => ex.slug === slug || ex.id === slug);
  }
};
