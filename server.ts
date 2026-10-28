import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI() : null;

function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI model call timed out')), ms))
  ]);
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'FitLife AI Full-Stack Server',
    geminiConfigured: Boolean(apiKey),
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. AI Coach Insight Generation endpoint
app.post('/api/ai/coach-insight', async (req: Request, res: Response) => {
  const { userProfile, workoutLog, waterGlasses, fatigueLevel } = req.body || {};

  try {
    if (ai) {
      const prompt = `You are FitLife AI, a sports science coach and biomechanics specialist.
User Profile:
- Goal: ${userProfile?.primaryGoal || 'general fitness'}
- Experience Tier: ${userProfile?.experienceLevel || 'intermediate'}
- Water Consumed Today: ${waterGlasses ?? 4} / 10 glasses
- Reported Fatigue Level: ${fatigueLevel || 'moderate'}
- Recent Exercises: ${JSON.stringify(workoutLog || ['Squats', 'Push-ups'])}

Provide 2 concise, highly actionable, science-grounded recovery or training recommendations in valid JSON format:
{
  "insights": [
    {
      "type": "recovery" | "nutrition" | "technique",
      "title": "Short title under 6 words",
      "message": "Scientific explanation in 1-2 sentences",
      "actionableStep": "Direct imperative action under 12 words"
    }
  ]
}
Return ONLY valid JSON.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
            maxOutputTokens: 600
          }
        }),
        3500
      );

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, source: 'gemini-3.8-flash', data: parsed });
    }
  } catch (err: any) {
    console.error('Gemini API call failed, falling back to sports science heuristics:', err?.message);
  }

  // Graceful, high-fidelity sports science fallback
  const fallbackInsights = [
    {
      type: (waterGlasses ?? 4) < 6 ? 'recovery' : 'technique',
      title: (waterGlasses ?? 4) < 6 ? 'Hydration Pacing Alert' : 'Eccentric Tempo Check',
      message:
        (waterGlasses ?? 4) < 6
          ? `You have recorded ${waterGlasses ?? 4} of 10 targeted glasses today. Fluid deficits above 2% reduce myofibrillar power output by 12%.`
          : 'Controlling your downward eccentric phase for 2.5–3 seconds increases mechanical tension and joint safety.',
      actionableStep:
        (waterGlasses ?? 4) < 6
          ? 'Drink 2 glasses with electrolytes before your next session.'
          : 'Focus on deliberate 3-second descent on compound lifts.'
    },
    {
      type: 'nutrition',
      title: 'Post-Workout Leucine Target',
      message: 'Pair your post-workout meal with 30g slow-digesting protein and complex carbohydrates to maximize glycogen replenishment.',
      actionableStep: 'Include moong dal, paneer, or sprouted legumes with dinner.'
    }
  ];

  return res.json({ success: true, source: 'sports-science-heuristics', data: { insights: fallbackInsights } });
});

// 3. AI Diet Substitution endpoint
app.post('/api/ai/diet-swap', async (req: Request, res: Response) => {
  const { currentMeal, dietaryPreference, targetCalories, targetProtein } = req.body || {};

  try {
    if (ai) {
      const prompt = `You are a clinical sports nutritionist specializing in authentic Indian diets (vegetarian, vegan, eggetarian).
Current meal: "${currentMeal || 'Paneer Bhurji & Roti'}"
Target Dietary Style: "${dietaryPreference || 'vegetarian'}"
Target Calories: ${targetCalories || 450} kcal
Target Protein: ${targetProtein || 30}g

Suggest an authentic, whole-food Indian alternative with exact macro estimates in valid JSON:
{
  "name": "Recipe Name",
  "calories": 420,
  "protein": 28,
  "carbs": 45,
  "fat": 14,
  "description": "Brief description and why it fits the macro target",
  "ingredients": ["Item 1 (100g)", "Item 2 (50g)"]
}
Return ONLY valid JSON.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
            maxOutputTokens: 500
          }
        }),
        3500
      );

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({ success: true, source: 'gemini-3.8-flash', meal: parsed });
    }
  } catch (err: any) {
    console.error('Diet swap generation fallback:', err?.message);
  }

  // Fallback authentic Indian meal alternatives
  const fallbackSwap = {
    name: dietaryPreference === 'vegan' ? 'High-Protein Tofu Bhurji & Multigrain Rotis' : 'Sprouted Moong Dal Chilla & Mint Curd',
    calories: targetCalories || 430,
    protein: targetProtein || 32,
    carbs: 48,
    fat: 12,
    description: 'Rich in branched-chain amino acids with complex carbs for steady energy and zero sugar spikes.',
    ingredients: ['Sprouted green gram (150g)', 'Mint curd or soy yogurt (100g)', 'Grated paneer or tofu (50g)', 'Spices (Cumin, Turmeric, Ginger)']
  };

  return res.json({ success: true, source: 'calibrated-nutrition-rules', meal: fallbackSwap });
});

// 4. AI Workout Adjuster endpoint
app.post('/api/ai/workout-adjust', async (req: Request, res: Response) => {
  const { exercise, reportedPain, fatigue } = req.body || {};

  try {
    if (ai) {
      const prompt = `A user training on FitLife AI reports:
Exercise: ${exercise || 'Barbell Squat'}
Reported Sensation/Pain: ${reportedPain || 'Knee discomfort during bottom flexion'}
Fatigue Tier: ${fatigue || 'moderate'}

Suggest a biomechanically safer alternative or modification in valid JSON:
{
  "alternativeExercise": "Name of replacement",
  "cue": "Coaching cue to protect the joint",
  "recommendedSets": "3 sets × 10 reps",
  "biomechanicalRationale": "Why this modification protects the joint"
}
Return ONLY valid JSON.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.5,
            maxOutputTokens: 400
          }
        }),
        3500
      );

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({ success: true, source: 'gemini-3.8-flash', modification: parsed });
    }
  } catch (err: any) {
    console.error('Workout adjust fallback:', err?.message);
  }

  return res.json({
    success: true,
    source: 'biomechanical-safety-heuristics',
    modification: {
      alternativeExercise: 'Goblet Box Squat',
      cue: 'Hinge hips to touch the box, keeping shins more vertical to reduce patellofemoral shear forces.',
      recommendedSets: '3 sets × 10 reps',
      biomechanicalRationale: 'Limits knee forward translation while preserving posterior chain activation.'
    }
  });
});

// ==========================================
// VITE MIDDLEWARE & STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FitLife AI] Full-Stack server listening on port ${PORT} (0.0.0.0)`);
  });
}

startServer().catch((err) => {
  console.error('[FitLife AI] Failed to start server:', err);
  process.exit(1);
});
