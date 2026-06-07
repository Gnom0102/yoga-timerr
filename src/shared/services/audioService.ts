// file: src/shared/services/audioService.ts

type TimerSound = "start" | "phaseChange" | "complete";

type OscillatorKind = OscillatorType;

interface SoundTone {
  frequency: number;
  duration: number;
  gain: number;
  delay?: number;
  type?: OscillatorKind;
}

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

class AudioService {
  private audioContext: AudioContext | undefined;
  private masterGain: GainNode | undefined;

  async unlock(): Promise<void> {
    const context = this.getAudioContext();

    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      await context.resume();
    }
  }

  playStart(): void {
    this.play("start");
  }

  playPhaseChange(): void {
    this.play("phaseChange");
  }

  playComplete(): void {
    this.play("complete");
  }

  private play(sound: TimerSound): void {
    void this.playSequence(this.getSoundTones(sound));
  }

  private async playSequence(tones: SoundTone[]): Promise<void> {
    const context = this.getAudioContext();

    if (!context || !this.masterGain) {
      return;
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    const startedAt = context.currentTime;

    tones.forEach((tone) => {
      this.playTone(context, this.masterGain as GainNode, tone, startedAt);
    });
  }

  private playTone(
    context: AudioContext,
    destination: AudioNode,
    tone: SoundTone,
    startedAt: number,
  ): void {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const startTime = startedAt + (tone.delay ?? 0);
    const attackEndTime = startTime + 0.02;
    const endTime = startTime + tone.duration;

    oscillator.type = tone.type ?? "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(tone.gain, attackEndTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gain);
    gain.connect(destination);

    oscillator.start(startTime);
    oscillator.stop(endTime + 0.05);
  }

  private getAudioContext(): AudioContext | undefined {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (this.audioContext) {
      return this.audioContext;
    }

    const audioWindow = window as WindowWithWebkitAudioContext;
    const AudioContextConstructor =
      audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      return undefined;
    }

    this.audioContext = new AudioContextConstructor();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.setValueAtTime(0.22, this.audioContext.currentTime);
    this.masterGain.connect(this.audioContext.destination);

    return this.audioContext;
  }

  private getSoundTones(sound: TimerSound): SoundTone[] {
    switch (sound) {
      case "start":
        return [
          {
            frequency: 523.25,
            duration: 0.18,
            gain: 0.18,
            type: "sine",
          },
          {
            frequency: 659.25,
            duration: 0.28,
            gain: 0.14,
            delay: 0.16,
            type: "sine",
          },
        ];

      case "phaseChange":
        return [
          {
            frequency: 783.99,
            duration: 0.22,
            gain: 0.16,
            type: "triangle",
          },
        ];

      case "complete":
        return [
          {
            frequency: 392,
            duration: 0.32,
            gain: 0.16,
            type: "sine",
          },
          {
            frequency: 523.25,
            duration: 0.38,
            gain: 0.15,
            delay: 0.24,
            type: "sine",
          },
          {
            frequency: 659.25,
            duration: 0.5,
            gain: 0.12,
            delay: 0.48,
            type: "sine",
          },
        ];
    }
  }
}

export const audioService = new AudioService();
