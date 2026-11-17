import { useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "#machine/sfx.js";

// "The machine prints it" (docs/AWWWARDS_PHILOSOPHY.md). Everything below the hero is one strip of thermal paper
// that PX-01 feeds out of a print head pinned to the bottom of the screen: scrolling down = the paper emerging.
// Sections declare themselves with data-out="02" data-label="Tickets"; the head reads whichever is at the slot.

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// The Sidi Saiyyed jali (Ahmedabad's tree-of-life window), the same geometry the hero floor light falls through
// (Studio.jsx jaliTexture), drawn crisp as a mask so CSS inks it in each paper's colour. mannan.io's lesson:
// culture is the most "only this person" identity there is. Used once, as the watermark beside the poster.
const drawJali = () => {
    const W = 600, H = 760, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d"); g.strokeStyle = "#fff"; g.lineCap = "round";
    const cx = W / 2, base = H - 20, aw = W - 40, top = 20;
    const arch = new Path2D();
    arch.moveTo(cx - aw / 2, base); arch.lineTo(cx - aw / 2, top + aw * 0.5);
    arch.quadraticCurveTo(cx - aw / 2, top, cx, top); arch.quadraticCurveTo(cx + aw / 2, top, cx + aw / 2, top + aw * 0.5);
    arch.lineTo(cx + aw / 2, base); arch.closePath();
    g.lineWidth = 4; g.stroke(arch);
    g.save(); g.clip(arch);
    const branch = (x, y, ang, len, w, depth) => {
        const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, curl = ang + (depth % 2 ? 0.5 : -0.5);
        g.lineWidth = w; g.beginPath(); g.moveTo(x, y);
        g.quadraticCurveTo(x + Math.cos(curl) * len * 0.6, y + Math.sin(curl) * len * 0.6, ex, ey); g.stroke();
        if (depth === 0) {
            g.lineWidth = 2.5; g.beginPath();
            for (let a = 0; a < 9; a += 0.3) g.lineTo(ex + Math.cos(a + ang) * a * 2.2, ey + Math.sin(a + ang) * a * 2.2);
            g.stroke(); return;
        }
        branch(ex, ey, ang - 0.55, len * 0.72, w * 0.7, depth - 1);
        branch(ex, ey, ang + 0.55, len * 0.72, w * 0.7, depth - 1);
    };
    branch(cx, base - 150, -Math.PI / 2, 190, 16, 5);
    g.lineWidth = 3;
    for (let x = cx - aw / 2; x < cx + aw / 2; x += 34) for (let y = base - 150; y < base; y += 34) { g.beginPath(); g.arc(x + 17, y + 17, 12, 0, Math.PI * 2); g.stroke(); }
    g.restore();
    return c.toDataURL();
};
export const Jali = ({ className = "po-jali" }) => {
    const url = useMemo(() => drawJali(), []);
    return <i className={className} aria-hidden style={{ WebkitMaskImage: `url(${url})`, maskImage: `url(${url})` }} />;
};

// Deterministic barcode from any string: same slug, same bars, every visit.
export const Barcode = ({ value, bars = 34, className = "po-barcode" }) => {
    let h = 2166136261;
    for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const ws = [];
    for (let i = 0; i < bars; i++) { h = Math.imul(h ^ (h >>> 13), 1274126177); ws.push(1 + ((h >>> 0) % 3)); }
    let x = 0;
    const rects = ws.map((w, i) => { const r = i % 2 ? null : <rect key={i} x={x} y="0" width={w} height="24" />; x += w + 1; return r; });
    return <svg className={className} viewBox={`0 0 ${x} 24`} preserveAspectRatio="none" aria-hidden>{rects}</svg>;
};

// A perforated tear line between two printouts, notched at both paper edges.
export const Perf = () => (
    <div className="po-perf" aria-hidden>
        <i className="po-notch po-notch-l" /><i className="po-notch po-notch-r" />
    </div>
);

export function PrintHead({ root }) {
    const [on, setOn] = useState(false);
    const [sec, setSec] = useState({ label: "Readout" });
    const line = useRef(null);
    const head = useRef(null);
    useEffect(() => {
        const paper = root.current;
        if (!paper) return;
        const secs = [...paper.querySelectorAll("[data-out]")];
        // the head is visible while the paper is passing through the slot (bottom edge of the viewport)
        const vis = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "0px 0px -60px 0px" });
        vis.observe(paper);
        // headers print in when they reach the screen. Observe the parent: Chrome intersects a target through its
        // own clip-path, so a fully clipped header would never be "visible" and never print.
        const heads = new Map([...paper.querySelectorAll(".po-print")].map((el) => [el.parentElement, el]));
        const pr = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            heads.get(e.target).dataset.in = "";
            pr.unobserve(e.target);
        }), { rootMargin: "0px 0px -12% 0px" });
        heads.forEach((_, parent) => pr.observe(parent));
        let last = null;
        // a 1px band at the slot (viewport bottom): the section under the head names the job; a new job prints
        const band = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting || e.target === last) return;
            last = e.target;
            setSec({ label: e.target.dataset.label });
            sfx.print?.();
        }), { rootMargin: "-99% 0px 0px 0px" });
        secs.forEach((s) => band.observe(s));
        // line counter: paper fed so far, in thermal-printer lines (~22px)
        let raf = 0, idle = 0;
        // headers print once they reach the lower screen. Checked on the scroll frame from a live query (only the ones
        // still waiting), so a remounted section or an observer that missed a fast scroll can't leave one unprinted.
        const printDue = () => {
            for (const el of paper.querySelectorAll(".po-print:not([data-in])")) if (el.parentElement.getBoundingClientRect().top < innerHeight * 0.88) el.dataset.in = "";
        };
        const feed = () => {
            raf = 0;
            printDue();
            const r = paper.getBoundingClientRect();
            const fed = Math.max(0, Math.min(r.height, innerHeight - r.top));
            if (line.current) line.current.textContent = String(Math.round(fed / 22)).padStart(4, "0");
        };
        // the carriage only runs while paper is actually moving, and parks ~180ms after the scroll stops
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(feed);
            head.current?.setAttribute("data-feeding", "");
            clearTimeout(idle);
            idle = setTimeout(() => head.current?.removeAttribute("data-feeding"), 180);
        };
        addEventListener("scroll", onScroll, { passive: true });
        feed();
        return () => { vis.disconnect(); pr.disconnect(); band.disconnect(); removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); clearTimeout(idle); };
    }, [root]);
    return (
        <div ref={head} className="po-head" data-on={on || undefined} data-still={reduced() || undefined} aria-hidden>
            <div className="po-head-lip" />
            <i className="po-carriage" />
            <div className="po-head-body mono">
                <span className="po-led" />
                <span key={sec.label} className="po-job">{sec.label}</span>
                <span className="po-line"><b ref={line}>0000</b></span>
            </div>
        </div>
    );
}
