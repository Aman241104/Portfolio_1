// Mechanical key click, synthesised (opt-in via `sound on`): a tiny noise tick + a low thump, slightly randomised.
let ac = null;
export const keyClick = (big = false) => {
    ac ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    const t = ac.currentTime, len = 0.03, buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = buf; f.type = "highpass"; f.frequency.value = 1800 + Math.random() * 900; g.gain.value = big ? 0.35 : 0.22;
    s.connect(f).connect(g).connect(ac.destination); s.start(t);
    const o = ac.createOscillator(), og = ac.createGain();
    o.frequency.setValueAtTime(big ? 120 : 170, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.05);
    og.gain.setValueAtTime(big ? 0.25 : 0.12, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(og).connect(ac.destination); o.start(t); o.stop(t + 0.07);
};
