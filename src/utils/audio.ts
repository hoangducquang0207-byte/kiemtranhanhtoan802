/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Offline Web Audio API Synthesizer for high-fidelity interactive SFX

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume if suspended by browser autoplay policy
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a tiny clean click sound for buttons, checkboxes, and general selection.
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    // Fast frequency sweep down
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (err) {
    console.warn('Audio click failed:', err);
  }
}

/**
 * Play a sweet ascending chime for a correct answer.
 */
export function playCorrectChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gainNode.gain.setValueAtTime(vol, start);
      gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;
    // Ascending arpeggio C5 -> E5 -> G5 -> C6
    playTone(523.25, now, 0.15, 0.1); // C5
    playTone(659.25, now + 0.08, 0.15, 0.1); // E5
    playTone(783.99, now + 0.16, 0.15, 0.1); // G5
    playTone(1046.50, now + 0.24, 0.35, 0.12); // C6
  } catch (err) {
    console.warn('Audio correct chime failed:', err);
  }
}

/**
 * Play a low warning double buzz for incorrect answers.
 */
export function playIncorrectChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sawtooth'; // Buzzier tone
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.linearRampToValueAtTime(freq - 30, start + duration); // Pitch bend down
      
      gainNode.gain.setValueAtTime(vol, start);
      gainNode.gain.linearRampToValueAtTime(0.001, start + duration);

      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;
    // Dissonant descending steps
    playTone(180, now, 0.15, 0.08); // Low tone 1
    playTone(140, now + 0.12, 0.25, 0.08); // Low tone 2
  } catch (err) {
    console.warn('Audio incorrect chime failed:', err);
  }
}

/**
 * Play an elegant celebratory fanfare when test is finished.
 */
export function playCelebrationFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playTone = (freq: number, start: number, duration: number, vol: number, type: 'sine' | 'triangle' = 'sine') => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      
      gainNode.gain.setValueAtTime(vol, start);
      gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;
    // Upbeat celebratory melody (C major scale vibe)
    playTone(523.25, now, 0.12, 0.1, 'triangle');       // C5
    playTone(587.33, now + 0.1, 0.12, 0.1, 'triangle');  // D5
    playTone(659.25, now + 0.2, 0.12, 0.1, 'triangle');  // E5
    playTone(783.99, now + 0.3, 0.12, 0.1, 'triangle');  // G5
    playTone(880.00, now + 0.4, 0.12, 0.1, 'triangle');  // A5
    playTone(1046.50, now + 0.5, 0.4, 0.15, 'sine');     // C6 (Sustained)
  } catch (err) {
    console.warn('Audio celebration fanfare failed:', err);
  }
}

/**
 * Play a light modal pop sound for opening modals, options or menus.
 */
export function playModalPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    // Sweeps up very fast
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (err) {
    console.warn('Audio pop sound failed:', err);
  }
}
