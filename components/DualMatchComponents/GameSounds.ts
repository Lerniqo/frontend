"use client";

// Simple sound effect simulation using Web Audio API
export class GameSounds {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  correctAnswer() {
    // Play ascending notes for correct answer
    this.playTone(523.25, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.3), 200); // G5
  }

  incorrectAnswer() {
    // Play descending notes for incorrect answer
    this.playTone(349.23, 0.3, 'square'); // F4
    setTimeout(() => this.playTone(293.66, 0.5, 'square'), 150); // D4
  }

  countdown() {
    // Short beep for countdown
    this.playTone(880, 0.1); // A5
  }

  gameStart() {
    // Game start fanfare
    this.playTone(523.25, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2), 200); // G5
    setTimeout(() => this.playTone(1046.50, 0.4), 300); // C6
  }

  matchFound() {
    // Match found notification
    this.playTone(659.25, 0.2); // E5
    setTimeout(() => this.playTone(783.99, 0.2), 150); // G5
  }

  timerWarning() {
    // Timer warning beep
    this.playTone(1174.66, 0.1, 'triangle'); // D6
  }

  victory() {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 1174.66]; // C5, E5, G5, C6, D6
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.3), index * 100);
    });
  }

  defeat() {
    // Defeat sound
    this.playTone(196.00, 0.5, 'sawtooth'); // G3
    setTimeout(() => this.playTone(146.83, 0.8, 'sawtooth'), 200); // D3
  }
}

export const gameSounds = new GameSounds();
