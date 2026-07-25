// Native Web Audio API and Audio streaming engine for UI Sounds and Ambient Focus Tracks
// Clean, soothing, high performance, and fully responsive

let audioCtx = null;
let activeAmbientAudio = null; // Holds the currently playing HTML5 Audio element

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Check if sound is enabled globally in settings
function isSoundEnabled() {
  return localStorage.getItem('sound-effects-enabled') !== 'false';
}

const TRACK_URLS = {
  lofi: '/audio/lofi.ogg',
  rain: '/audio/rain.mp3',
  waves: '/audio/waves.mp3'
};

/* ─── Ambient Focus Tracks ─── */

export function startAmbientSound(trackType, volume = 0.5) {
  try {
    // Stop any currently playing audio track first
    stopAmbientSound();

    const trackUrl = TRACK_URLS[trackType];
    if (!trackUrl) return;

    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.volume = volume;
    
    // Play with browser autoplay bypass handler
    audio.play().catch(err => {
      console.log('Audio playback delayed or blocked by browser policy:', err);
    });

    activeAmbientAudio = audio;
  } catch (err) {
    console.error("Failed to start ambient audio playback:", err);
  }
}

export function stopAmbientSound() {
  if (activeAmbientAudio) {
    try {
      activeAmbientAudio.pause();
      activeAmbientAudio.currentTime = 0;
    } catch (e) {
      console.warn("Error stopping active audio element:", e);
    }
    activeAmbientAudio = null;
  }
}

export function setAmbientVolume(volume) {
  if (activeAmbientAudio) {
    try {
      activeAmbientAudio.volume = volume;
    } catch (e) {
      console.warn("Error setting active audio volume:", e);
    }
  }
}

/* ─── UI Sound Effects (Chimes) ─── */

export function playClick() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio Context click failed:', e);
  }
}

export function playSuccess() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
    const duration = 0.12;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.06 + duration);

      osc.start(ctx.currentTime + index * 0.06);
      osc.stop(ctx.currentTime + index * 0.06 + duration);
    });
  } catch (e) {
    console.warn('Audio Context success failed:', e);
  }
}

export function playLevelUp() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 -> C6
    const duration = 0.25;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + duration);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + duration);
    });
  } catch (e) {
    console.warn('Audio Context level-up failed:', e);
  }
}
