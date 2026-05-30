// Tactile keypress & game sound effects synthesizer using the Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(type: 'mechanical' | 'bubble' | 'synth' | 'laser') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'mechanical') {
      // Create a double-click sound: brief pop then immediate high click
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.015);
      
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);

      // Noise component for tactile feel
      const bufferSize = ctx.sampleRate * 0.01; // 10ms white noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.015);

    } else if (type === 'bubble') {
      // Plop sound
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

    } else if (type === 'synth') {
      // Retro chime synth blip
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      // randomize pitch slightly to sound like a composition
      const randomFreq = 440 + Math.floor(Math.random() * 4) * 110;
      osc.frequency.setValueAtTime(randomFreq, now);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

    } else if (type === 'laser') {
      // High to low futuristic swipe sound
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      // Simple low pass filter to make it sound premium
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    console.warn('Audio playback not started/allowed:', e);
  }
}

export function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Beautiful retro level up sound sequence: G4 -> C5 -> E5 -> G5
    const freqs = [392.00, 523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gainNode.gain.setValueAtTime(0, now + idx * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Joyful mission completion/unlock sound: C5 -> E5 -> G5
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gainNode.gain.setValueAtTime(0, now + idx * 0.06);
      gainNode.gain.linearRampToValueAtTime(0.1, now + idx * 0.06 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}
