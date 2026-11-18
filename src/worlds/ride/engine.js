import { audioCtx, soundOn, onSound } from "#machine/sfx.js";

// The coupe's sound, synthesised (no files): two detuned oscillators through a resonant low-pass make the engine —
// pitch climbs through four "gears" with speed, the filter opens on throttle — and band-passed noise is the tyre
// squeal, driven by sideways slip. Follows the site-wide sound switch; silent while the tab is hidden.
export function createEngine() {
    let c = null, master, a, b, lp, eg, squeal, src;
    const vis = () => { if (!c) return; if (document.hidden) c.suspend(); else c.resume(); };

    const start = () => {
        if (c) return;
        c = audioCtx();
        master = c.createGain(); master.gain.value = soundOn() ? 1 : 0; master.connect(c.destination);
        a = c.createOscillator(); a.type = "sawtooth";
        b = c.createOscillator(); b.type = "square"; b.detune.value = -8;
        lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 5; lp.frequency.value = 500;
        eg = c.createGain(); eg.gain.value = 0.03;
        a.connect(lp); b.connect(lp); lp.connect(eg).connect(master);
        const buf = c.createBuffer(1, c.sampleRate, c.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        src = c.createBufferSource(); src.buffer = buf; src.loop = true;
        const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2300; bp.Q.value = 9;
        squeal = c.createGain(); squeal.gain.value = 0;
        src.connect(bp).connect(squeal).connect(master);
        a.start(); b.start(); src.start();
        document.addEventListener("visibilitychange", vis);
    };
    const off = onSound((v) => { if (c) master.gain.setTargetAtTime(v ? 1 : 0, c.currentTime, 0.05); });

    return {
        start,
        // speed m/s, throttle 0..1, slip m/s sideways
        update(speed, throttle, slip) {
            if (!c) return;
            const v = Math.abs(speed), gear = Math.min(3, Math.floor(v / 8.5)), r = Math.min(1, (v - gear * 8.5) / 8.5);
            const f = 42 + gear * 9 + r * 64 + throttle * 6, t = c.currentTime;
            a.frequency.setTargetAtTime(f, t, 0.05);
            b.frequency.setTargetAtTime(f * 0.5, t, 0.05);
            lp.frequency.setTargetAtTime(380 + r * 700 + throttle * 900, t, 0.08);
            eg.gain.setTargetAtTime(0.028 + throttle * 0.045, t, 0.1);
            squeal.gain.setTargetAtTime(Math.min(0.09, Math.max(0, slip - 2.2) * 0.025), t, 0.05);
        },
        stop() {
            off();
            if (!c) return;
            document.removeEventListener("visibilitychange", vis);
            master.gain.setTargetAtTime(0, c.currentTime, 0.03);
            setTimeout(() => { [a, b, src].forEach((n) => n.stop()); master.disconnect(); }, 150);
        },
    };
}
