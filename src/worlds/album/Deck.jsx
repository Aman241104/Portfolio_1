import { useEffect, useRef, useState } from "react";
import { scratch } from "./beat.js";

// The hero: the sleeve (procedural cover) with the record sliding out of it. Grab the record and scratch it: every
// 360/N degrees is the next track, with a scratch tick (and a tap of haptics on phones). It keeps spinning with
// whatever speed the hand left it, and turns on its own while the beat plays. Release shows "Now playing" + Open.
export default function Deck({ tracks, playing, onOpen, sleeve }) {
    const disc = useRef(null), st = useRef({ rot: -8, vel: 0, drag: null, idx: 0 });
    const [idx, setIdx] = useState(0);
    const [touched, setTouched] = useState(false);
    const N = tracks.length, step = 360 / N;
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        let raf;
        const loop = () => {
            const s = st.current;
            if (!s.drag) {
                const target = playing && !reduced ? 1.6 : 0;                     // ~33 rpm-ish at 60 fps
                s.vel += (target - s.vel) * (playing ? 0.04 : 0.025);
                s.rot += s.vel;
            }
            const i = ((Math.floor((((s.rot % 360) + 360) % 360) / step)) % N + N) % N;
            // while the beat just turns the record, the readout holds its track (it used to flick ~7 titles a second);
            // it follows the record only when a hand or a key moves it
            if (i !== s.idx && (s.drag || s.moved || !playing)) {
                s.moved = false;
                s.idx = i; setIdx(i);
                if (s.drag || Math.abs(s.vel) > 2.5) { scratch(s.vel); navigator.vibrate?.(4); }
            }
            if (disc.current) disc.current.style.transform = `rotate(${s.rot}deg)`;
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [playing, N, step, reduced]);

    const angle = (e) => {
        const r = disc.current.getBoundingClientRect();
        return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
    };
    const down = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        st.current.drag = { a: angle(e) };
        st.current.vel = 0;
        setTouched(true);
    };
    const move = (e) => {
        const s = st.current;
        if (!s.drag) return;
        const a = angle(e);
        let d = a - s.drag.a;
        if (d > 180) d -= 360; else if (d < -180) d += 360;
        s.rot += d; s.vel = s.vel * 0.5 + d * 0.5; s.drag.a = a;
    };
    const up = () => { st.current.drag = null; st.current.moved = true; };   // let the readout catch up to where the hand left it
    const key = (e) => {                                   // keyboard: arrows step through tracks
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
        e.preventDefault();
        st.current.rot += (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) * step;
        st.current.moved = true;
        setTouched(true);
    };
    const t = tracks[idx];

    return (
        <div className="deck">
            <div className="deck-stage">
                <div ref={disc} className="disc" role="slider" tabIndex={0} aria-label="Scratch the record to pick a track"
                    aria-valuemin={1} aria-valuemax={N} aria-valuenow={idx + 1} aria-valuetext={`Track ${idx + 1}: ${t.title}`}
                    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
                    <span className="disc-label"><b>{String(idx + 1).padStart(2, "0")}</b><i>SHIP IT</i></span>
                </div>
                <div className="sleeve">{sleeve}</div>
            </div>
            <div className="deck-read" aria-live="polite">
                <p className="mono">{touched ? "Now playing" : "Grab the record · scratch it"}</p>
                <p className="deck-title"><span className="mono">{String(idx + 1).padStart(2, "0")}/{N}</span> {t.title}</p>
                <button type="button" className="btn ghost" onClick={() => onOpen(t)}>Open track →</button>
            </div>
        </div>
    );
}
