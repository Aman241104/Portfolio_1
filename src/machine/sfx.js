// Machine sounds, synthesised with Web Audio (no files to download). Off by default; the choice is remembered.
// Haptics ride along on Android (navigator.vibrate); iOS ignores it.
let ctx = null, on = false;
const subs = new Set();
try { on = localStorage.getItem("px01-sound") === "1"; } catch { /* private mode: stays off */ }

const ac = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
};
export const soundOn = () => on;
export const onSound = (fn) => { subs.add(fn); return () => subs.delete(fn); };
export const setSound = (v) => {
    on = v;
    try { localStorage.setItem("px01-sound", v ? "1" : "0"); } catch { /* ignore */ }
    if (v) { ac(); blip(880, 0.05, 0.08); }
    subs.forEach((f) => f(v));
};

const buzz = (ms) => { try { navigator.vibrate?.(ms); } catch { /* ignore */ } };

// A short pitched blip with an exponential decay.
const blip = (freq, dur, gain, type = "square", t0 = 0) => {
    const c = ac(), t = c.currentTime + t0, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
};
// Filtered noise burst: clicks, ratchets, thunks.
let noise = null;
const hit = (freq, dur, gain, q = 2, t0 = 0) => {
    const c = ac(), t = c.currentTime + t0;
    if (!noise) {
        noise = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = noise; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(c.destination); s.start(t); s.stop(t + dur + 0.02);
};

let lastTick = 0;
export const sfx = {
    ratchet() { buzz(4); if (on) hit(2400, 0.03, 0.35, 6); },                 // each notch of the lever
    detent() { buzz(18); if (on) { hit(700, 0.09, 0.6, 3); blip(110, 0.12, 0.12, "sine"); } },
    tick() {                                                                  // a symbol passing the window
        const now = performance.now();
        if (!on || now - lastTick < 28) return;                               // ponytail: global throttle, 3 reels share it
        lastTick = now; hit(3800, 0.015, 0.12, 8);
    },
    lock(i) { buzz(14); if (on) { hit(380 - i * 40, 0.14, 0.8, 2); blip(70 - i * 6, 0.16, 0.25, "sine"); } },
    win() {
        buzz([20, 40, 20, 40, 60]);
        if (on) [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.35, 0.07, "triangle", i * 0.08));
    },
    coin(i) { if (on) blip(2200 + (i % 3) * 300, 0.09, 0.05, "sine", i * 0.07); },
    print() { buzz([8, 30, 8, 30, 8]); if (on) for (let i = 0; i < 16; i++) hit(1500 + (i % 2) * 400, 0.04, 0.22, 4, i * 0.06); },
    power() { if (on) { blip(55, 0.9, 0.18, "sawtooth"); blip(110, 0.6, 0.05, "sine", 0.1); } },
};
