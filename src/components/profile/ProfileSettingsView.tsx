import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  Volume2,
  Camera,
  CheckCircle2,
  Save,
  RotateCcw,
  LogOut,
  Download,
  Trash2,
  Dumbbell
} from 'lucide-react';
import { UserProfile, FitnessGoal, DietaryPreference, UnitSystem } from '../../types';
import { profileService } from '../../services/profileService';
import { voiceService } from '../../services/voiceFeedbackService';

interface ProfileSettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onLogout
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'camera_voice' | 'privacy'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Voice feedback local state
  const [voiceMuted, setVoiceMuted] = useState(voiceService.getMuted());
  const [voiceVolume, setVoiceVolume] = useState(voiceService.getVolume());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = profileService.saveProfile(formData);
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleVoiceVolumeChange = (vol: number) => {
    setVoiceVolume(vol);
    voiceService.setVolume(vol);
  };

  const handleVoiceMuteToggle = () => {
    const next = !voiceMuted;
    setVoiceMuted(next);
    voiceService.setMuted(next);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'fitlife_athlete_profile.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset local demo profile to default values?')) {
      const reset = profileService.resetToDemo();
      setFormData(reset);
      onUpdateProfile(reset);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Athlete Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal metrics, dietary targets, camera audio coach, and privacy preferences.
          </p>
        </div>

        {saveSuccess && (
          <div className="p-2.5 bg-lime-950/80 border border-lime-800 text-lime-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-lime-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#111622]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Biometric Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'preferences'
              ? 'bg-lime-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#111622]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Training & Diet</span>
        </button>

        <button
          onClick={() => setActiveTab('camera_voice')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'camera_voice'
              ? 'bg-lime-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#111622]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Camera & Audio Coach</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'bg-lime-400 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#111622]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Data</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Biometrics */}
        {activeTab === 'profile' && (
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white">Biometric & Identity Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-[#171E2E]/60 border border-slate-800 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unit System</label>
                <select
                  value={formData.unitSystem}
                  onChange={(e) => setFormData({ ...formData, unitSystem: e.target.value as UnitSystem })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white"
                >
                  <option value="metric">Metric (cm, kg)</option>
                  <option value="imperial">Imperial (inches, lbs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Height ({formData.unitSystem === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Training & Diet */}
        {activeTab === 'preferences' && (
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white">Fitness Goals & Nutrition Patterns</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Fitness Goal</label>
                <select
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as FitnessGoal })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white capitalize"
                >
                  <option value="muscle_gain">Muscle Gain & Hypertrophy</option>
                  <option value="fat_loss">Fat Loss & Conditioning</option>
                  <option value="strength">Strength Development</option>
                  <option value="general_fitness">General Health</option>
                  <option value="endurance">Endurance</option>
                  <option value="mobility">Mobility & Flexibility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Dietary Pattern</label>
                <select
                  value={formData.dietaryPreference}
                  onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value as DietaryPreference })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white capitalize"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food Allergies</label>
                <input
                  type="text"
                  value={formData.foodAllergies.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      foodAllergies: e.target.value.split(',').map((s) => s.trim())
                    })
                  }
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Training Days per Week</label>
                <select
                  value={formData.trainingDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, trainingDaysPerWeek: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#171E2E] border border-slate-700 rounded-xl text-sm text-white font-mono"
                >
                  <option value={3}>3 Days</option>
                  <option value={4}>4 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={6}>6 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Camera & Audio Coach */}
        {activeTab === 'camera_voice' && (
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white">Camera & Spoken Voice Feedback</h3>

            <div className="space-y-5 max-w-lg">
              <div className="flex items-center justify-between p-4 bg-[#171E2E] rounded-xl border border-slate-800">
                <div>
                  <div className="font-semibold text-white text-sm">Spoken Audio Coach</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Announce repetition counts and form cues using browser text-to-speech.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleVoiceMuteToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    !voiceMuted
                      ? 'bg-lime-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {!voiceMuted ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Audio Coach Volume</span>
                  <span className="font-mono text-lime-400">{Math.round(voiceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={voiceVolume}
                  onChange={(e) => handleVoiceVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-lime-400"
                />
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-lime-400" />
                  <span>Privacy Architecture</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  FitLife AI computes pose landmarks directly on your device via client-side WebAssembly. No video feeds or images are ever transmitted to external servers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Privacy & Data */}
        {activeTab === 'privacy' && (
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white">Local Data Management & Account</h3>

            <div className="space-y-4 max-w-lg">
              <div className="p-4 bg-[#171E2E] rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Export Athlete Profile</div>
                  <div className="text-xs text-slate-400">Download your settings and split data as JSON.</div>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              <div className="p-4 bg-[#171E2E] rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Reset to Demo Defaults</div>
                  <div className="text-xs text-slate-400">Restore factory sample workouts and profile.</div>
                </div>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/40 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-red-300">Sign Out of Session</div>
                  <div className="text-xs text-slate-400">Clears the active browser session.</div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
