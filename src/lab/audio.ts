// Procedural sound for the PX-01 intro: no audio files, everything is synthesized with WebAudio.
// Off by default; only starts after the visitor chooses "Enter with sound" (a user gesture, so browsers allow it).

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let swellGain: GainNode | null = null;

const noiseBuffer = (c: AudioContext, seconds = 4, brown = false) => {
    const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
    const d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return b;
};

const loop = (c: AudioContext, buffer: AudioBuffer) => {
    const s = c.createBufferSource();
    s.buffer = buffer; s.loop = true; s.start();
    return s;
};

export const audio = {
    get enabled() { return !!ctx && ctx.state === "running" && (master?.gain.value ?? 0) > 0; },

    // Sea (brown noise through a slowly breathing low-pass) + a little wind (band-passed white noise).
    start() {
        if (ctx) { ctx.resume(); return; }
        ctx = new AudioContext();
        master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
        master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5);

        const sea = loop(ctx, noiseBuffer(ctx, 6, true));
        const seaFilter = ctx.createBiquadFilter(); seaFilter.type = "lowpass"; seaFilter.frequency.value = 420;
        const seaGain = ctx.createGain(); seaGain.gain.value = 0.35;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.11;              // one wave every ~9 s
        const lfoDepth = ctx.createGain(); lfoDepth.gain.value = 0.18;
        lfo.connect(lfoDepth).connect(seaGain.gain); lfo.start();
        sea.connect(seaFilter).connect(seaGain).connect(master);

        const wind = loop(ctx, noiseBuffer(ctx, 4));
        const windFilter = ctx.createBiquadFilter(); windFilter.type = "bandpass"; windFilter.frequency.value = 900; windFilter.Q.value = 0.6;
        const windGain = ctx.createGain(); windGain.gain.value = 0.025;
        wind.connect(windFilter).connect(windGain).connect(master);

        // camera-move swell: a soft filtered pad that rises as the camera rises
        const pad = loop(ctx, noiseBuffer(ctx, 4, true));
        const padFilter = ctx.createBiquadFilter(); padFilter.type = "lowpass"; padFilter.frequency.value = 900;
        swellGain = ctx.createGain(); swellGain.gain.value = 0;
        pad.connect(padFilter).connect(swellGain).connect(master);
    },

    mute(on: boolean) {
        if (!ctx || !master) return;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(on ? 0 : 0.9, ctx.currentTime + 0.4);
    },

    // 0..1 progress of the camera move → swell level (rises, then settles on arrival)
    swell(k: number) {
        if (!ctx || !swellGain) return;
        swellGain.gain.setTargetAtTime(Math.sin(Math.PI * Math.min(k, 1)) * 0.22, ctx.currentTime, 0.2);
    },

    // short filtered click, used for the lever ratchet and reel ticks
    click(freq = 2400, gain = 0.25, decay = 0.03) {
        if (!ctx || !master) return;
        const t = ctx.currentTime;
        const src = ctx.createBufferSource(); src.buffer = noiseBuffer(ctx, 0.05);
        const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 6;
        const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + decay);
        src.connect(f).connect(g).connect(master); src.start(t); src.stop(t + 0.06);
    },

    ratchet() { [0, 0.05, 0.1, 0.15].forEach((d, i) => setTimeout(() => this.click(1800 + i * 200, 0.3), d * 1000)); },

    // two soft sine partials: the landing chime
    chime() {
        if (!ctx || !master) return;
        const t = ctx.currentTime;
        [880, 1320, 1760].forEach((hz, i) => {
            const o = ctx!.createOscillator(); o.type = "sine"; o.frequency.value = hz;
            const g = ctx!.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12 / (i + 1), t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
            o.connect(g).connect(master!); o.start(t); o.stop(t + 1.7);
        });
    },
};
