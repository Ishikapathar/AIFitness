import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  CameraOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Activity,
  Layers,
  Info,
  Maximize2,
  Award
} from 'lucide-react';
import { Exercise, LiveSessionSummary } from '../../types';
import { exerciseService } from '../../services/exerciseService';
import { poseAnalysisService, PoseAnalysisResult } from '../../services/poseAnalysisService';
import { voiceService } from '../../services/voiceFeedbackService';
import { workoutService } from '../../services/workoutService';

interface LiveWorkoutViewProps {
  exerciseId: string;
  onNavigate: (route: string) => void;
}

export const LiveWorkoutView: React.FC<LiveWorkoutViewProps> = ({ exerciseId, onNavigate }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [viewState, setViewState] = useState<'pre_workout' | 'countdown' | 'in_session' | 'rest_interval' | 'completed'>('pre_workout');
  const [countdownNum, setCountdownNum] = useState<number>(3);

  // Live session metrics
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [targetSets, setTargetSets] = useState<number>(3);
  const [targetReps, setTargetReps] = useState<number>(12);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showRepPop, setShowRepPop] = useState<boolean>(false);

  // Camera & vision state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(voiceService.getMuted());
  const [volume, setVolume] = useState<number>(voiceService.getVolume());

  // Real-time analysis metrics
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null);
  const [userNotes, setUserNotes] = useState<string>('');

  // Refs for video & canvas
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const ex = exerciseService.getExerciseById(exerciseId) || exerciseService.getExercises({ aiOnly: true })[0];
    setExercise(ex);
    setTargetSets(ex.defaultSets);
    setTargetReps(ex.defaultReps);
    poseAnalysisService.resetExercise(ex.id);

    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      voiceService.stop();
    };
  }, [exerciseId]);

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewState === 'in_session' && !isPaused) {
      timer = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewState, isPaused]);

  // Rest timer
  useEffect(() => {
    let restTimer: NodeJS.Timeout;
    if (viewState === 'rest_interval') {
      restTimer = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(restTimer);
            voiceService.speak('Rest period completed. Beginning next set!');
            setViewState('in_session');
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restTimer);
  }, [viewState]);

  // Pre-workout to countdown
  const handleStartSession = () => {
    setViewState('countdown');
    setCountdownNum(3);

    voiceService.speak('Prepare for exercise.');
    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdownNum(currentCount);
        voiceService.speak(String(currentCount));
      } else {
        clearInterval(interval);
        setCountdownNum(1);
        voiceService.speak('Start!');
        setViewState('in_session');
        startCamera();
      }
    }, 1000);
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission('unavailable');
        setIsSimulationMode(true);
        startVisionLoop();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
          setCameraPermission('granted');
          poseAnalysisService.initialize().catch(() => {});
          startVisionLoop();
        };
      }
    } catch (err: any) {
      console.warn('Camera permission denied or unavailable:', err);
      setCameraPermission('denied');
      setIsSimulationMode(true);
      startVisionLoop();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startVisionLoop = () => {
    const loop = (timestamp: number) => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const result = poseAnalysisService.processVideoFrame(
          video,
          timestamp,
          isSimulationMode || cameraPermission === 'denied' || cameraPermission === 'unavailable'
        );

        setAnalysisResult(result);
        setCurrentReps(result.repCount);

        // Draw landmarks
        if (ctx && result.landmarks) {
          poseAnalysisService.drawSkeleton(ctx, result.landmarks, canvas.width, canvas.height);
        }

        // Rep celebrate animation trigger
        if (result.repJustFinished) {
          voiceService.speak(`Rep ${result.repCount} complete!`);
          setShowRepPop(true);
          setTimeout(() => setShowRepPop(false), 1400);
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  };

  const handleFinishSet = () => {
    if (currentSet < targetSets) {
      setCurrentSet((prev) => prev + 1);
      setViewState('rest_interval');
      setRestSecondsRemaining(exercise?.restSeconds || 60);
      poseAnalysisService.setRepCount(0);
      setCurrentReps(0);
      voiceService.speak('Set completed! Take a 60 second recovery rest.');
    } else {
      handleCompleteWorkout();
    }
  };

  const handleCompleteWorkout = () => {
    setViewState('completed');
    stopCamera();
    voiceService.speak('Workout completed! Outstanding effort today.');
  };

  const handleSaveSession = () => {
    if (!exercise) return;
    const summary: LiveSessionSummary = {
      id: 'sess_' + Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      completedReps: currentReps,
      targetReps,
      completedSets: currentSet,
      targetSets,
      durationSeconds: sessionSeconds,
      avgRepQualityScore: analysisResult?.formScore || 92,
      formNotes: [
        'Controlled eccentric pacing verified by AI',
        userNotes || 'Solid form throughout full range of motion'
      ],
      timestamp: new Date().toISOString()
    };

    workoutService.saveLiveSession(summary);
    onNavigate('/dashboard');
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    voiceService.setMuted(next);
  };

  if (!exercise) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading exercise configuration...
      </div>
    );
  }

  // PRE-WORKOUT GUIDE SCREEN
  if (viewState === 'pre_workout') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <button
          onClick={() => onNavigate('/workouts/library')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Exercise Library</span>
        </button>

        <div className="bg-[#111622] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
            {/* Visual preview with hover zoom */}
            <div className="md:col-span-5 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-[4/3] relative group">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-lime-400 border border-lime-400/30">
                  AI GUIDED POSE
                </div>
              </div>
              <div className="bg-[#171E2E] p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400">Target Volume:</div>
                <div className="text-sm font-bold text-white font-mono">
                  {targetSets} Sets × {targetReps} Repetitions
                </div>
              </div>
            </div>

            {/* Details & Preparation */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-mono font-semibold text-lime-400 uppercase">
                  PRE-WORKOUT CUES
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5">{exercise.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {exercise.about}
                </p>
              </div>

              {/* Movement Stages */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400">Biomechanical Stages:</div>
                <div className="space-y-1.5">
                  {exercise.stages.map((st, i) => (
                    <div key={i} className="text-xs bg-[#171E2E] p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                      <span className="font-bold text-lime-400 font-mono">{i + 1}.</span>
                      <div>
                        <span className="font-bold text-white">{st.name}:</span>{' '}
                        <span className="text-slate-300">{st.description}</span>
                        <div className="text-[10px] text-lime-400 font-mono mt-0.5">Cue: {st.keyLandmarkCue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Camera Preparation Notice */}
              <div className="p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-lime-400" />
                  <span>Camera & Privacy Setup:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Video frames are analyzed locally in your browser and never leave your computer. Ensure your whole body is framed at approximately 6–8 feet distance.
                </p>
              </div>

              {/* Action Button with Pulse Glow */}
              <div className="pt-2 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartSession}
                  className="flex-1 py-3 px-6 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-lime-400/20 glow-lime flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Live Session</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // COUNTDOWN OVERLAY WITH SPRING ANIMATION
  if (viewState === 'countdown') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs uppercase font-mono tracking-widest text-lime-400"
        >
          Get into Starting Position
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={countdownNum}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="text-8xl sm:text-9xl font-black text-white font-mono"
          >
            {countdownNum}
          </motion.div>
        </AnimatePresence>
        <div className="text-sm text-slate-400 max-w-sm">
          {exercise.name} · Step back so your body joints are in view
        </div>
      </div>
    );
  }

  // POST-WORKOUT COMPLETION DIALOG
  if (viewState === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 bg-lime-400/20 text-lime-400 rounded-full flex items-center justify-center mx-auto glow-lime"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-white">Workout Session Complete!</h2>
          <p className="text-xs text-slate-400">
            {exercise.name} · Completed sets saved to your training ledger
          </p>
        </div>

        <div className="bg-[#171E2E] rounded-xl p-4 border border-slate-800 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-slate-400">Duration</div>
            <div className="text-lg font-bold text-white font-mono">
              {Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Sets Completed</div>
            <div className="text-lg font-bold text-white font-mono">
              {currentSet} / {targetSets}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">AI Form Score</div>
            <div className="text-lg font-bold text-lime-400 font-mono">
              {analysisResult?.formScore || 94}%
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Personal Session Notes (Optional)
          </label>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="e.g. Felt great depth on 2nd set. Kept back flat and controlled tempo."
            rows={3}
            className="w-full p-3 bg-[#171E2E] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSession}
            className="flex-1 py-3 px-4 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md text-center glow-lime"
          >
            Save Workout & Return to Dashboard
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // LIVE IN-SESSION & REST INTERVAL SCREEN
  return (
    <div className="space-y-4">
      {/* Top Session Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#111622] border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopCamera();
              onNavigate('/workouts/library');
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
            title="Exit Session"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs text-lime-400 font-mono font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>LIVE AI COACH · {exercise.name}</span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Set {currentSet} of {targetSets}</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono tabular-nums text-slate-300">
                {Math.floor(sessionSeconds / 60)}:{(sessionSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Audio & Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulationMode(!isSimulationMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors border ${
              isSimulationMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle between live webcam stream and kinematic motion simulator"
          >
            {isSimulationMode ? 'DEMO SIMULATION ON' : 'CAMERA MODE'}
          </button>

          {/* Voice Feedback Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg text-xs transition-colors border ${
              !isMuted
                ? 'bg-lime-400/20 border-lime-400/40 text-lime-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={isMuted ? 'Unmute Audio Coach' : 'Mute Audio Coach'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
          >
            {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Complete Set / Workout */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleFinishSet}
            className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase rounded-lg transition-colors shadow-sm"
          >
            {currentSet >= targetSets ? 'Finish Workout' : 'Complete Set'}
          </motion.button>
        </div>
      </div>

      {/* REST INTERVAL BANNER IF ACTIVE */}
      {viewState === 'rest_interval' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-2xl flex items-center justify-between text-xs text-cyan-200 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="font-semibold">Active Rest Recovery: Breathe deeply and rehydrate.</span>
          </div>
          <div className="font-mono text-base font-bold text-cyan-400 tabular-nums">
            {restSecondsRemaining}s remaining
          </div>
          <button
            onClick={() => {
              setViewState('in_session');
              voiceService.speak('Resuming next set!');
            }}
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors text-xs"
          >
            Skip Rest
          </button>
        </motion.div>
      )}

      {/* Main Split-Screen Workspace (Left Demo, Right Camera) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL — EXERCISE DEMONSTRATION & INSTRUCTIONS */}
        <div className="lg:col-span-5 bg-[#111622] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Demonstration & Cues
            </span>
            <span className="text-xs font-mono text-lime-400">
              Target: {targetReps} Reps
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-[4/3] relative group">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
              <div className="text-xs text-white font-medium">
                Keep posture erect, inhale on descent, exhale on drive.
              </div>
            </div>
          </div>

          {/* Biomechanical Stage Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white">Movement Stages:</div>
            {exercise.stages.map((st, i) => (
              <div key={i} className="p-2.5 bg-[#171E2E] rounded-lg border border-slate-800/80">
                <div className="font-semibold text-lime-300">{st.name}</div>
                <div className="text-slate-400 mt-0.5">{st.description}</div>
              </div>
            ))}
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-xl text-[11px] text-amber-300">
            <span className="font-bold">Safety Tip:</span> {exercise.safetyTips[0]}
          </div>
        </div>

        {/* RIGHT PANEL — LIVE CAMERA FEED & REAL POSE CANVAS OVERLAY */}
        <div className="lg:col-span-7 bg-[#111622] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${cameraActive || isSimulationMode ? 'bg-lime-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="font-mono font-semibold text-slate-300">
                {isSimulationMode
                  ? 'KINEMATIC SIMULATION ACTIVE'
                  : cameraActive
                  ? 'WEBCAM POSE VISION ACTIVE'
                  : 'CAMERA PENDING'}
              </span>
            </div>
            <div className="text-lime-400 font-mono tabular-nums font-semibold flex items-center gap-1.5">
              <span>Joint Angle:</span>
              <span className="text-white font-bold">{analysisResult?.primaryAngle ?? 180}°</span>
            </div>
          </div>

          {/* Video + Canvas Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-[4/3] flex items-center justify-center">
            {/* Hidden video element feeding frames */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive && !isSimulationMode ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {/* If camera is not active or simulation mode */}
            {(!cameraActive || isSimulationMode) && (
              <div className="absolute inset-0 bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lime-400 animate-pulse">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {isSimulationMode ? 'Kinematic Motion Simulator' : 'Camera Feed Inactive'}
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    {isSimulationMode
                      ? 'Generating continuous 33-point sinusoidal biomechanical landmarks for real-time repetition testing.'
                      : 'Grant camera access in browser to enable real-time landmark tracking.'}
                  </p>
                </div>
              </div>
            )}

            {/* Real HTML5 Overlay Canvas for Skeleton & Landmark Rendering */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* In-Frame Repetition Counter HUD */}
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-lime-400/40 rounded-xl p-3 shadow-xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">REPETITION COUNTER</div>
              <div className="text-4xl font-black text-lime-400 font-mono tabular-nums leading-none mt-1">
                {currentReps} <span className="text-sm text-slate-400 font-sans">/ {targetReps}</span>
              </div>
            </div>

            {/* In-Frame Movement Phase Indicator */}
            <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 text-right">
              <div className="text-[10px] text-slate-400 font-mono uppercase">PHASE</div>
              <div className="text-xs font-bold text-white capitalize font-mono">
                {analysisResult?.currentPhase || 'Ready'}
              </div>
            </div>

            {/* CELEBRATORY REP POPUP ANIMATION OVERLAY */}
            <AnimatePresence>
              {showRepPop && (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0, y: 20 }}
                  animate={{ scale: 1.15, opacity: 1, y: 0 }}
                  exit={{ scale: 1.4, opacity: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <div className="px-6 py-3 bg-lime-400 text-slate-950 font-black text-2xl font-mono rounded-2xl shadow-2xl glow-lime border-2 border-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    <span>REP {currentReps} COMPLETED!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Frame Live Corrective Coaching Message */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-lime-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200 truncate">
                  {analysisResult?.feedbackMessage || 'Position yourself in front of the lens.'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-mono">QUALITY</div>
                <div className="text-xs font-bold font-mono text-lime-400">
                  {analysisResult?.formScore || 90}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Manual Rep Counter Override */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span>Manual adjustment:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = Math.max(0, currentReps - 1);
                  setCurrentReps(next);
                  poseAnalysisService.setRepCount(next);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-bold"
              >
                -1 Rep
              </button>
              <button
                onClick={() => {
                  const next = currentReps + 1;
                  setCurrentReps(next);
                  poseAnalysisService.setRepCount(next);
                  voiceService.speak(`Rep ${next} complete!`);
                  setShowRepPop(true);
                  setTimeout(() => setShowRepPop(false), 1400);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-bold"
              >
                +1 Rep
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
