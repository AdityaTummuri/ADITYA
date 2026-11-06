/**
 * AudioEngine — Web Audio API singleton for the portfolio soundscape.
 * Unlocked on first user gesture. Never throws; audio is purely progressive enhancement.
 *
 * Layers:
 *  1. Drone  — deep sub-bass oscillator pair with reverb tail, always running
 *  2. Shimmer — filtered noise pads, chapter-dependent filter freq
 *  3. Scroll  — low-pass filtered noise burst on scroll velocity
 *  4. Chime   — sine-bell for chapter transitions
 */

let _ctx: AudioContext | null = null;
let _masterGain: GainNode | null = null;
let _droneGain: GainNode | null = null;
let _shimmerGain: GainNode | null = null;
let _droneOsc1: OscillatorNode | null = null;
let _droneOsc2: OscillatorNode | null = null;
let _shimmerSource: AudioBufferSourceNode | null = null;
let _reverb: ConvolverNode | null = null;
let _analyser: AnalyserNode | null = null;
let _freqBuf: Uint8Array<ArrayBuffer> | null = null;
let _enabled = false;
let _unlocked = false;

/** Build an impulse-response convolver (fake room reverb). */
function buildReverb(ctx: AudioContext, seconds = 2.4, decay = 3): ConvolverNode {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

/** Build a looping noise buffer for shimmer/scroll layers. */
function buildNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  return buf;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    const AC = (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? window.AudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  return _ctx;
}

/** Call on first user gesture to unlock and start the audio graph. */
export function unlockAudio() {
  const ctx = getCtx();
  if (!ctx || _unlocked) return;
  _unlocked = true;

  if (ctx.state === 'suspended') ctx.resume();

  // Master gain
  _masterGain = ctx.createGain();
  _masterGain.gain.value = _enabled ? 0.55 : 0;
  _masterGain.connect(ctx.destination);

  // Analyser — tapped on master output, captures full mix for OLED reactivity
  _analyser = ctx.createAnalyser();
  _analyser.fftSize = 512;
  _analyser.smoothingTimeConstant = 0.75;
  _freqBuf = new Uint8Array(_analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
  _masterGain.connect(_analyser);

  // Reverb (shared)
  _reverb = buildReverb(ctx);
  _reverb.connect(_masterGain);

  // --- Drone layer ---
  _droneGain = ctx.createGain();
  _droneGain.gain.value = 0.18;
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 320;
  droneFilter.Q.value = 1.8;

  _droneOsc1 = ctx.createOscillator();
  _droneOsc1.type = 'sine';
  _droneOsc1.frequency.value = 41.2; // low E
  _droneOsc1.start();

  _droneOsc2 = ctx.createOscillator();
  _droneOsc2.type = 'sine';
  _droneOsc2.frequency.value = 61.7; // ~B below middle C
  _droneOsc2.start();

  _droneOsc1.connect(droneFilter);
  _droneOsc2.connect(droneFilter);
  droneFilter.connect(_droneGain);
  _droneGain.connect(_reverb);
  _droneGain.connect(_masterGain);

  // --- Shimmer layer ---
  _shimmerGain = ctx.createGain();
  _shimmerGain.gain.value = 0.06;
  const shimmerFilter = ctx.createBiquadFilter();
  shimmerFilter.type = 'bandpass';
  shimmerFilter.frequency.value = 1800;
  shimmerFilter.Q.value = 12;

  const noiseBuf = buildNoiseBuffer(ctx, 4);
  _shimmerSource = ctx.createBufferSource();
  _shimmerSource.buffer = noiseBuf;
  _shimmerSource.loop = true;
  _shimmerSource.start();

  _shimmerSource.connect(shimmerFilter);
  shimmerFilter.connect(_shimmerGain);
  _shimmerGain.connect(_reverb);

  applyEnabled();
}

/** Set the master enabled state (persisted to localStorage by the store). */
export function setAudioEnabled(on: boolean) {
  _enabled = on;
  applyEnabled();
}

function applyEnabled() {
  if (!_masterGain || !_ctx) return;
  const now = _ctx.currentTime;
  _masterGain.gain.cancelScheduledValues(now);
  _masterGain.gain.setTargetAtTime(_enabled ? 0.55 : 0, now, 0.6);
}

/** Trigger a scroll swoosh. `velocity` is pixels/s from Lenis, clamped to [0,1]. */
export function playScrollSound(velocity: number) {
  const ctx = getCtx();
  if (!ctx || !_enabled || !_masterGain) return;
  const v = Math.min(Math.abs(velocity) / 3000, 1);
  if (v < 0.08) return;

  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 180 + v * 600;
  filter.Q.value = 3;

  const noise = ctx.createBufferSource();
  const buf = buildNoiseBuffer(ctx, 0.12);
  noise.buffer = buf;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(_masterGain);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(v * 0.08, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  noise.start(now);
  noise.stop(now + 0.15);
}

/** Trigger a chapter-entry chime. `chapterIndex` shifts the pitch. */
export function playChimeSound(chapterIndex: number) {
  const ctx = getCtx();
  if (!ctx || !_enabled || !_masterGain) return;

  const freqs = [220, 246.9, 261.6, 293.7, 329.6, 369.9];
  const freq = freqs[chapterIndex % freqs.length] ?? 220;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(_reverb ?? _masterGain);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

  osc.start(now);
  osc.stop(now + 2.5);
}

/** Update shimmer filter frequency based on chapter look. */
export function setShimmerFrequency(freq: number) {
  // We can't directly get shimmerFilter back, so we drive it via the source rate trick.
  // Instead: use a detune approach on the shimmer source.
  if (!_shimmerSource || !_ctx) return;
  // Approximate: detune the playback rate for tonal shift
  _shimmerSource.detune.setTargetAtTime((freq - 1800) / 10, _ctx.currentTime, 0.8);
}

export function isAudioEnabled() { return _enabled; }
export function isAudioUnlocked() { return _unlocked; }

/**
 * Returns a normalised frequency amplitude [0, 1] averaged across the
 * bass–low-mid band (bins 1-16, ~40–500 Hz). Called each frame inside
 * useFrame — zero allocations (reuses _freqBuf Uint8Array).
 */
export function getAudioFrequency(): number {
  if (!_analyser || !_freqBuf || !_enabled) return 0;
  _analyser.getByteFrequencyData(_freqBuf as Uint8Array<ArrayBuffer>);
  let sum = 0;
  const end = Math.min(16, _freqBuf.length);
  for (let i = 1; i < end; i++) sum += _freqBuf[i];
  return sum / ((end - 1) * 255);
}

/**
 * Returns the high-frequency shimmer amplitude [0, 1] (bins 100-200, ~4–10 kHz).
 * Used to modulate bloom or trace pulse brightness.
 */
export function getAudioShimmer(): number {
  if (!_analyser || !_freqBuf || !_enabled) return 0;
  _analyser.getByteFrequencyData(_freqBuf as Uint8Array<ArrayBuffer>);
  let sum = 0;
  const start = Math.min(100, _freqBuf.length);
  const end   = Math.min(200, _freqBuf.length);
  for (let i = start; i < end; i++) sum += _freqBuf[i];
  return sum / ((end - start) * 255);
}

