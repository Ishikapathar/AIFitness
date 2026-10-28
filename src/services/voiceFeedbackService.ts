class VoiceFeedbackService {
  private isMuted: boolean = false;
  private volume: number = 0.85;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;
  private minIntervalMs: number = 3200; // minimum seconds between repeated guidance

  constructor() {
    try {
      const savedMute = localStorage.getItem('fitlife_voice_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('fitlife_voice_vol');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
      }
    } catch {}
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('fitlife_voice_muted', String(muted));
      if (muted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('fitlife_voice_vol', String(this.volume));
    } catch {}
  }

  public getVolume(): number {
    return this.volume;
  }

  public speak(text: string, force: boolean = false): void {
    if (this.isMuted || !('speechSynthesis' in window)) {
      return;
    }

    const now = Date.now();
    if (!force && text === this.lastSpokenText && now - this.lastSpokenTime < this.minIntervalMs) {
      return;
    }
    if (!force && now - this.lastSpokenTime < 1800) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel previous queued utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.volume;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      this.lastSpokenText = text;
      this.lastSpokenTime = now;

      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const voiceService = new VoiceFeedbackService();
