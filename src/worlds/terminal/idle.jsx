import { useEffect, useRef } from "react";

// The screensaver: the name bounces around the CRT like an old DVD logo; a corner hit flashes. Any key/tap wakes it.
export function Screensaver({ onWake }) {
    const el = useRef(null);
    useEffect(() => {
        const box = el.current, logo = box.firstChild;
        let x = 40, y = 40, vx = 1.6, vy = 1.2, raf;
        const loop = () => {
            const W = box.clientWidth - logo.offsetWidth, H = box.clientHeight - logo.offsetHeight;
            x += vx; y += vy;
            let hx = false, hy = false;
            if (x <= 0 || x >= W) { vx = -vx; x = Math.max(0, Math.min(W, x)); hx = true; }
            if (y <= 0 || y >= H) { vy = -vy; y = Math.max(0, Math.min(H, y)); hy = true; }
            if (hx && hy) { logo.dataset.corner = ""; setTimeout(() => delete logo.dataset.corner, 900); }
            logo.style.transform = `translate(${x}px, ${y}px)`;
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        const wake = () => onWake();
        window.addEventListener("keydown", wake, { once: true });
        return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", wake); };
    }, [onWake]);
    return (
        <div ref={el} className="tty-saver" onPointerDown={onWake} role="presentation">
            <div className="tty-saver-logo"><b>अमन</b><span>OPEN TO WORK · AHMEDABAD</span></div>
        </div>
    );
}
