import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type MovementPhase = 'ready' | 'starting' | 'eccentric' | 'inflection' | 'concentric' | 'completed';

export interface PoseAnalysisResult {
  landmarks: Landmark[] | null;
  exerciseId: string;
  repCount: number;
  currentPhase: MovementPhase;
  primaryAngle: number;
  secondaryAngle?: number;
  feedbackMessage: string;
  formScore: number; // 0 to 100
  isBodyVisible: boolean;
  confidence: number;
  repJustFinished: boolean;
  status: 'active' | 'searching' | 'low_confidence';
}

export interface LandmarkConnection {
  start: number;
  end: number;
}

export const POSE_CONNECTIONS: LandmarkConnection[] = [
  // Face & Torso
  { start: 11, end: 12 }, // left shoulder to right shoulder
  { start: 11, end: 23 }, // left shoulder to left hip
  { start: 12, end: 24 }, // right shoulder to right hip
  { start: 23, end: 24 }, // left hip to right hip
  // Left arm
  { start: 11, end: 13 }, // shoulder to elbow
  { start: 13, end: 15 }, // elbow to wrist
  // Right arm
  { start: 12, end: 14 },
  { start: 14, end: 16 },
  // Left leg
  { start: 23, end: 25 }, // hip to knee
  { start: 25, end: 27 }, // knee to ankle
  // Right leg
  { start: 24, end: 26 },
  { start: 26, end: 28 }
];

export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const baX = a.x - b.x;
  const baY = a.y - b.y;
  const bcX = c.x - b.x;
  const bcY = c.y - b.y;

  const dot = baX * bcX + baY * bcY;
  const magBA = Math.sqrt(baX * baX + baY * baY);
  const magBC = Math.sqrt(bcX * bcX + bcY * bcY);

  if (magBA * magBC === 0) return 180;
  const cosine = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
  return Math.round((Math.acos(cosine) * 180) / Math.PI);
}

// MediaPipe Pose indices
export const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28
};

class PoseAnalysisEngine {
  private landmarker: PoseLandmarker | null = null;
  private isInitializing: boolean = false;
  private isModelLoaded: boolean = false;

  // Exercise state tracking
  private currentExerciseId: string = 'ex_squats';
  private repCount: number = 0;
  private movementPhase: MovementPhase = 'ready';
  private stage: 'up' | 'down' | 'neutral' = 'neutral';
  private repHistory: { angle: number; timestamp: number }[] = [];
  private lastFeedbackTime: number = 0;
  private activeFeedback: string = 'Stand in front of the camera with your whole body in view.';

  public async initialize(): Promise<boolean> {
    if (this.isModelLoaded) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );
      this.landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      this.isModelLoaded = true;
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.warn('MediaPipe Model load notice (using fallback analysis pipeline):', err);
      this.isInitializing = false;
      return false;
    }
  }

  public getModelLoaded(): boolean {
    return this.isModelLoaded;
  }

  public resetExercise(exerciseId: string): void {
    this.currentExerciseId = exerciseId;
    this.repCount = 0;
    this.movementPhase = 'ready';
    this.stage = 'neutral';
    this.repHistory = [];
    this.activeFeedback = 'Move into starting position.';
  }

  public getRepCount(): number {
    return this.repCount;
  }

  public setRepCount(count: number): void {
    this.repCount = count;
  }

  public processVideoFrame(
    video: HTMLVideoElement,
    timestampMs: number,
    isSimulationMode: boolean = false
  ): PoseAnalysisResult {
    let landmarks: Landmark[] | null = null;
    let confidence = 0.85;

    if (!isSimulationMode && this.landmarker && video.readyState >= 2) {
      try {
        const results = this.landmarker.detectForVideo(video, timestampMs);
        if (results.landmarks && results.landmarks.length > 0) {
          landmarks = results.landmarks[0] as Landmark[];
          confidence = 0.9;
        }
      } catch (err) {
        console.warn('Frame detection error:', err);
      }
    }

    // If simulation mode or no direct landmarks, calculate simulated landmarks with realistic sinusoidal human kinematics
    if (isSimulationMode || !landmarks) {
      if (isSimulationMode) {
        landmarks = this.generateSimulatedLandmarks(this.currentExerciseId, timestampMs);
        confidence = 0.95;
      }
    }

    if (!landmarks || landmarks.length < 29) {
      return {
        landmarks: null,
        exerciseId: this.currentExerciseId,
        repCount: this.repCount,
        currentPhase: 'ready',
        primaryAngle: 180,
        feedbackMessage: 'Step back so your full body is visible in the frame.',
        formScore: 80,
        isBodyVisible: false,
        confidence: 0,
        repJustFinished: false,
        status: 'searching'
      };
    }

    // Analyze specific exercise kinematics
    return this.analyzeExercise(landmarks, this.currentExerciseId);
  }

  private analyzeExercise(landmarks: Landmark[], exerciseId: string): PoseAnalysisResult {
    let repJustFinished = false;
    let primaryAngle = 180;
    let secondaryAngle: number | undefined;
    let isBodyVisible = true;
    let formScore = 90;
    const now = Date.now();

    if (exerciseId === 'ex_squats' || exerciseId === 'squats') {
      // Squat analysis: Hip-Knee-Ankle angle
      const lHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
      const lKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
      const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
      const rHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
      const rKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
      const rAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

      // Use the more visible leg
      const leftVis = (lHip?.visibility ?? 1) + (lKnee?.visibility ?? 1) + (lAnkle?.visibility ?? 1);
      const rightVis = (rHip?.visibility ?? 1) + (rKnee?.visibility ?? 1) + (rAnkle?.visibility ?? 1);

      const [hip, knee, ankle] = leftVis >= rightVis ? [lHip, lKnee, lAnkle] : [rHip, rKnee, rAnkle];

      if (!hip || !knee || !ankle) {
        return this.createNotVisibleResult('Legs or hips not clearly visible.');
      }

      primaryAngle = calculateAngle(hip, knee, ankle);

      // Squat state machine
      if (primaryAngle > 160) {
        if (this.stage === 'down') {
          // Rep completed
          this.repCount += 1;
          this.stage = 'up';
          this.movementPhase = 'completed';
          repJustFinished = true;
          this.activeFeedback = 'Excellent repetition! Lockout achieved.';
          this.lastFeedbackTime = now;
        } else {
          this.stage = 'up';
          this.movementPhase = 'ready';
          if (now - this.lastFeedbackTime > 4000) {
            this.activeFeedback = 'Ready. Lower your hips back and down with control.';
            this.lastFeedbackTime = now;
          }
        }
      } else if (primaryAngle < 100) {
        this.stage = 'down';
        this.movementPhase = 'inflection';
        if (primaryAngle <= 90) {
          formScore = 98;
          this.activeFeedback = 'Great depth! Drive smoothly through your heels.';
        } else {
          this.activeFeedback = 'Good descent. Aim for parallel thigh depth.';
        }
        this.lastFeedbackTime = now;
      } else {
        // In transit
        if (this.stage === 'up' || this.stage === 'neutral') {
          this.movementPhase = 'eccentric';
        } else {
          this.movementPhase = 'concentric';
        }
      }
    } else if (exerciseId === 'ex_pushups' || exerciseId === 'push-ups') {
      // Push-up analysis: Shoulder-Elbow-Wrist angle & Torso alignment
      const shoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const elbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
      const wrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
      const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
      const ankle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

      if (!shoulder || !elbow || !wrist || !hip) {
        return this.createNotVisibleResult('Upper body and torso not fully visible.');
      }

      primaryAngle = calculateAngle(shoulder, elbow, wrist);
      if (ankle) {
        secondaryAngle = calculateAngle(shoulder, hip, ankle); // torso plank line
      }

      // Check plank sag
      if (secondaryAngle && secondaryAngle < 150) {
        formScore = 75;
        this.activeFeedback = 'Brace core: avoid sagging your lower hips.';
      } else if (primaryAngle > 155) {
        if (this.stage === 'down') {
          this.repCount += 1;
          this.stage = 'up';
          this.movementPhase = 'completed';
          repJustFinished = true;
          this.activeFeedback = 'Full extension. Solid rep!';
          this.lastFeedbackTime = now;
        } else {
          this.stage = 'up';
          this.movementPhase = 'ready';
          if (now - this.lastFeedbackTime > 4000) {
            this.activeFeedback = 'In plank. Lower chest smoothly towards floor.';
            this.lastFeedbackTime = now;
          }
        }
      } else if (primaryAngle < 90) {
        this.stage = 'down';
        this.movementPhase = 'inflection';
        this.activeFeedback = 'Good 90° chest depth! Press firmly through palms.';
        this.lastFeedbackTime = now;
      } else {
        this.movementPhase = this.stage === 'up' ? 'eccentric' : 'concentric';
      }
    } else if (exerciseId === 'ex_bicep_curls' || exerciseId === 'bicep-curls') {
      // Bicep Curl: Shoulder-Elbow-Wrist angle
      const shoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      const elbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
      const wrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

      if (!shoulder || !elbow || !wrist) {
        return this.createNotVisibleResult('Arm and shoulder landmarks not visible.');
      }

      primaryAngle = calculateAngle(shoulder, elbow, wrist);

      if (primaryAngle > 150) {
        if (this.stage === 'up') {
          this.repCount += 1;
          this.stage = 'down';
          this.movementPhase = 'completed';
          repJustFinished = true;
          this.activeFeedback = 'Full stretch completed. Squeeze up for the next rep.';
          this.lastFeedbackTime = now;
        } else {
          this.stage = 'down';
          this.movementPhase = 'ready';
          if (now - this.lastFeedbackTime > 4000) {
            this.activeFeedback = 'Keep elbow pinned. Curl dumbbell toward shoulder.';
            this.lastFeedbackTime = now;
          }
        }
      } else if (primaryAngle < 55) {
        this.stage = 'up';
        this.movementPhase = 'inflection';
        this.activeFeedback = 'Peak bicep contraction! Control the descent.';
        this.lastFeedbackTime = now;
      } else {
        this.movementPhase = this.stage === 'down' ? 'concentric' : 'eccentric';
      }
    } else {
      // Generic isometric / movement tracker
      primaryAngle = 180;
      this.movementPhase = 'ready';
      this.activeFeedback = 'Hold steady posture. AI tracking active.';
    }

    return {
      landmarks,
      exerciseId,
      repCount: this.repCount,
      currentPhase: this.movementPhase,
      primaryAngle,
      secondaryAngle,
      feedbackMessage: this.activeFeedback,
      formScore,
      isBodyVisible,
      confidence: 0.92,
      repJustFinished,
      status: 'active'
    };
  }

  private createNotVisibleResult(msg: string): PoseAnalysisResult {
    return {
      landmarks: null,
      exerciseId: this.currentExerciseId,
      repCount: this.repCount,
      currentPhase: 'ready',
      primaryAngle: 180,
      feedbackMessage: msg,
      formScore: 70,
      isBodyVisible: false,
      confidence: 0.3,
      repJustFinished: false,
      status: 'low_confidence'
    };
  }

  // Generates smooth, realistic kinematic 33-point pose landmark coordinates for simulation testing
  private generateSimulatedLandmarks(exerciseId: string, timestampMs: number): Landmark[] {
    const landmarks: Landmark[] = [];
    const t = (timestampMs % 4000) / 4000; // 4-second rep cycle
    // Sinusoidal rep curve: 0 -> down -> 1 -> up
    const cycle = Math.sin(t * Math.PI * 2);

    for (let i = 0; i < 33; i++) {
      landmarks.push({ x: 0.5, y: 0.5, z: 0, visibility: 0.95 });
    }

    // Head
    landmarks[0] = { x: 0.5, y: 0.16 + cycle * 0.08, z: 0, visibility: 0.98 };

    // Shoulders
    const shoulderY = 0.28 + (exerciseId.includes('squat') ? (1 - Math.cos(t * Math.PI * 2)) * 0.08 : 0);
    landmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.42, y: shoulderY, z: 0, visibility: 0.95 };
    landmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.58, y: shoulderY, z: 0, visibility: 0.95 };

    if (exerciseId.includes('bicep')) {
      // Right arm curls up and down
      const armAngle = ((1 + cycle) / 2) * 1.8; // 0 to 1.8 rad
      landmarks[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.60, y: 0.48, z: 0, visibility: 0.95 };
      landmarks[POSE_LANDMARKS.RIGHT_WRIST] = {
        x: 0.60 - Math.sin(armAngle) * 0.15,
        y: 0.48 - Math.cos(armAngle) * 0.18,
        z: 0,
        visibility: 0.95
      };
      // Left arm neutral
      landmarks[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.40, y: 0.48, z: 0, visibility: 0.95 };
      landmarks[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.40, y: 0.68, z: 0, visibility: 0.95 };
    } else {
      // Normal arms
      landmarks[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.38, y: shoulderY + 0.18, z: 0, visibility: 0.95 };
      landmarks[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.62, y: shoulderY + 0.18, z: 0, visibility: 0.95 };
      landmarks[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.36, y: shoulderY + 0.35, z: 0, visibility: 0.95 };
      landmarks[POSE_LANDMARKS.RIGHT_WRIST] = { x: 0.64, y: shoulderY + 0.35, z: 0, visibility: 0.95 };
    }

    // Hips
    const hipY = 0.50 + (exerciseId.includes('squat') ? (1 - Math.cos(t * Math.PI * 2)) * 0.12 : 0);
    landmarks[POSE_LANDMARKS.LEFT_HIP] = { x: 0.44, y: hipY, z: 0, visibility: 0.95 };
    landmarks[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.56, y: hipY, z: 0, visibility: 0.95 };

    // Knees & Ankles
    const kneeSpread = exerciseId.includes('squat') ? 0.05 + (1 - Math.cos(t * Math.PI * 2)) * 0.04 : 0.05;
    const kneeY = 0.70 + (exerciseId.includes('squat') ? (1 - Math.cos(t * Math.PI * 2)) * 0.06 : 0);
    landmarks[POSE_LANDMARKS.LEFT_KNEE] = { x: 0.45 - kneeSpread, y: kneeY, z: 0, visibility: 0.95 };
    landmarks[POSE_LANDMARKS.RIGHT_KNEE] = { x: 0.55 + kneeSpread, y: kneeY, z: 0, visibility: 0.95 };

    landmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.43, y: 0.90, z: 0, visibility: 0.95 };
    landmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.57, y: 0.90, z: 0, visibility: 0.95 };

    return landmarks;
  }

  // Draw overlay skeleton on HTML5 canvas
  public drawSkeleton(ctx: CanvasRenderingContext2D, landmarks: Landmark[], width: number, height: number): void {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#CCFF00'; // Neon lime
    ctx.lineCap = 'round';

    for (const conn of POSE_CONNECTIONS) {
      const p1 = landmarks[conn.start];
      const p2 = landmarks[conn.end];
      if (p1 && p2 && (p1.visibility ?? 1) > 0.4 && (p2.visibility ?? 1) > 0.4) {
        ctx.beginPath();
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
        ctx.stroke();
      }
    }

    // Draw landmark joint dots
    for (let i = 0; i < landmarks.length; i++) {
      const pt = landmarks[i];
      if (pt && (pt.visibility ?? 1) > 0.4) {
        const x = pt.x * width;
        const y = pt.y * height;

        // Key major joints
        const isMajorJoint = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].includes(i);
        ctx.beginPath();
        ctx.arc(x, y, isMajorJoint ? 5 : 3, 0, 2 * Math.PI);
        ctx.fillStyle = isMajorJoint ? '#FFFFFF' : '#A3E635';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0B0E14';
        ctx.stroke();
      }
    }
  }
}

export const poseAnalysisService = new PoseAnalysisEngine();
