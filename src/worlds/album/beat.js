// An original 88 BPM boom-bap loop, synthesised with WebAudio: no samples, no copyrighted audio. Opt-in only.
let ctx = null, timer = null, step = 0, next = 0;
const BPM = 88, STEP = 60 / BPM / 4;                         // 16th notes
const KICK = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0];
const SNARE = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const HAT = [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1];
const BASS = [41, 0, 0, 0, 0, 0, 0, 41, 0, 0, 44, 0, 0, 0, 39, 0];   // MIDI notes, 808-style glide

let noiseBuf = null;
const noise = () => {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
};
const env = (t, peak, dur) => { const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); g.connect(ctx.destination); return g; };
const kick = (t) => { const o = ctx.createOscillator(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); o.connect(env(t, 0.9, 0.35)); o.start(t); o.stop(t + 0.4); };
const snare = (t) => { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(); s.buffer = noise(); f.type = "bandpass"; f.frequency.value = 1800; s.connect(f).connect(env(t, 0.45, 0.18)); s.start(t); s.stop(t + 0.2); };
const hat = (t, open) => { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(); s.buffer = noise(); f.type = "highpass"; f.frequency.value = 7000; s.connect(f).connect(env(t, 0.12, open ? 0.12 : 0.04)); s.start(t); s.stop(t + 0.15); };
const bass = (t, midi) => { const o = ctx.createOscillator(); o.type = "sine"; const hz = 440 * 2 ** ((midi - 69) / 12); o.frequency.setValueAtTime(hz * 1.5, t); o.frequency.exponentialRampToValueAtTime(hz, t + 0.06); o.connect(env(t, 0.35, 0.5)); o.start(t); o.stop(t + 0.55); };

const tick = () => {
    while (next < ctx.currentTime + 0.12) {
        const i = step % 16;
        if (KICK[i]) kick(next);
        if (SNARE[i]) snare(next);
        if (HAT[i]) hat(next, i === 15);
        if (BASS[i]) bass(next, BASS[i]);
        next += STEP; step++;
    }
};
export const BEAT_MS = (60 / BPM) * 1000;
export const play = () => {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume(); step = 0; next = ctx.currentTime + 0.05;
    clearInterval(timer); timer = setInterval(tick, 25); tick();
};
export const stop = () => { clearInterval(timer); timer = null; };

// One scratch "tick" as the record crosses a track boundary: a short band-passed noise sweep whose pitch follows
// the hand's speed. Made on the fly like the beat (no samples). Needs a user gesture first (pointerdown is one).
export const scratch = (speed = 1) => {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter();
    s.buffer = noise(); f.type = "bandpass"; f.Q.value = 6;
    const hz = 500 + Math.min(Math.abs(speed), 30) * 90;
    f.frequency.setValueAtTime(hz, t); f.frequency.exponentialRampToValueAtTime(hz * (speed > 0 ? 2.2 : 0.45), t + 0.07);
    s.connect(f).connect(env(t, 0.22, 0.08)); s.start(t); s.stop(t + 0.09);
};
