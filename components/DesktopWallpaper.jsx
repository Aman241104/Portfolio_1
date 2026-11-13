import { useEffect, useRef } from "react";

// PX-OS interactive desktop canvas: pointer-reactive dot matrix ("signal"), blueprint ("grid"), or "minimal".
const DesktopWallpaper = ({ mode = "signal" }) => {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas || mode === "minimal") return;
        const ctx = canvas.getContext("2d");
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let w = 0, h = 0, raf = 0;
        const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const onMove = (e) => { ptr.tx = e.clientX; ptr.ty = e.clientY; };
        const onLeave = () => { ptr.tx = -9999; ptr.ty = -9999; };

        const draw = (t = 0) => {
            ptr.x += (ptr.tx - ptr.x) * 0.14;
            ptr.y += (ptr.ty - ptr.y) * 0.14;
            ctx.clearRect(0, 0, w, h);

            const gap = mode === "grid" ? 28 : 24;
            const time = t * 0.001;
            for (let y = gap * 0.5; y < h; y += gap) {
                for (let x = gap * 0.5; x < w; x += gap) {
                    const dx = x - ptr.x;
                    const dy = y - ptr.y;
                    const dist = Math.hypot(dx, dy);
                    const near = Math.max(0, 1 - dist / 190);
                    const wave = mode === "signal" && !reduced ? Math.sin(x * 0.015 + y * 0.015 - time * 1.4) * 0.5 + 0.5 : 0;

                    if (near > 0.02) {
                        const r = 1.1 + near * 1.9;
                        const px = mode === "signal" && !reduced ? x + (dx / (dist || 1)) * near * 5 : x;
                        const py = mode === "signal" && !reduced ? y + (dy / (dist || 1)) * near * 5 : y;
                        ctx.fillStyle = near > 0.45 ? `rgba(255, 46, 31, ${0.28 + near * 0.65})` : `rgba(237, 234, 227, ${0.14 + near * 0.4})`;
                        ctx.beginPath();
                        ctx.arc(px, py, r, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        const alpha = mode === "grid" ? 0.1 : 0.065 + wave * 0.045;
                        ctx.fillStyle = `rgba(237, 234, 227, ${alpha})`;
                        ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
                    }
                }
            }
            if (!reduced) raf = requestAnimationFrame(draw);
        };

        if (reduced) draw(0);
        else raf = requestAnimationFrame(draw);

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
        };
    }, [mode]);

    if (mode === "minimal") return <div className="px-wallpaper-minimal" aria-hidden />;
    return <canvas ref={ref} className="px-wallpaper" aria-hidden />;
};

export default DesktopWallpaper;
