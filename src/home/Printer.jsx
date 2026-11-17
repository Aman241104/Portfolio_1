import { useEffect, useRef, useState } from "react";
import { sfx } from "#machine/sfx.js";

// "The machine prints it" (docs/AWWWARDS_PHILOSOPHY.md). Everything below the hero is one strip of thermal paper
// that PX-01 feeds out of a print head pinned to the bottom of the screen: scrolling down = the paper emerging.
// Sections declare themselves with data-out="02" data-label="Tickets"; the head reads whichever is at the slot.

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

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
export const Perf = ({ label }) => (
    <div className="po-perf" aria-hidden>
        <i className="po-notch po-notch-l" /><span className="mono">{label}</span><i className="po-notch po-notch-r" />
    </div>
);

export function PrintHead({ root }) {
    const [on, setOn] = useState(false);
    const [sec, setSec] = useState({ out: "01", label: "Readout" });
    const line = useRef(null);
    const head = useRef(null);
    useEffect(() => {
        const paper = root.current;
        if (!paper) return;
        const secs = [...paper.querySelectorAll("[data-out]")];
        const total = String(secs.length).padStart(2, "0");
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
            setSec({ out: `${e.target.dataset.out} / ${total}`, label: e.target.dataset.label });
            sfx.print?.();
        }), { rootMargin: "-99% 0px 0px 0px" });
        secs.forEach((s) => band.observe(s));
        // line counter: paper fed so far, in thermal-printer lines (~22px)
        let raf = 0, idle = 0;
        const feed = () => {
            raf = 0;
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
                <span className="po-state">Printing</span>
                <span className="po-job">Output {sec.out} · {sec.label}</span>
                <span className="po-line">Line <b ref={line}>0000</b></span>
                <span className="po-model">PX-01 · Thermal 80mm</span>
            </div>
        </div>
    );
}
