import { useEffect } from "react";

// Liquid glass, the real thing: a lens, not frost. Each element gets its own SVG displacement map (built from its
// size + corner radius) that bends what's behind it near the rim, R/G/B displaced by slightly different amounts for
// the chromatic fringe — the web port of Mindcore's lens(height, amount, chromaticAberration).
// Only Chromium renders SVG filters in backdrop-filter; everywhere else the CSS clear-glass fallback (.lg) stands.
export const lensOk = typeof navigator !== "undefined" && !!navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand))
    && !matchMedia("(prefers-reduced-transparency: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
let host = null, uid = 0;

// displacement map: R = x shift, G = y shift (128 = none). Inside a band `edge` px wide along the rim, sample from
// further in along the edge normal, strongest at the rim (k²): what's behind bulges at the glass's curved edge.
const map = (w, h, r, edge) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const px = x + 0.5 - w / 2, py = y + 0.5 - h / 2;
        const qx = Math.abs(px) - (w / 2 - r), qy = Math.abs(py) - (h / 2 - r);
        const inward = r - Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - Math.min(Math.max(qx, qy), 0);
        let dx = 0, dy = 0;
        if (inward > 0 && inward < edge) {
            let nx = 0, ny = 0;
            if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy); nx = qx / l; ny = qy / l; } else if (qx > qy) nx = 1; else ny = 1;
            const k = (1 - inward / edge) ** 2;
            dx = -nx * Math.sign(px) * k; dy = -ny * Math.sign(py) * k;   // sample inward: the rim magnifies, never reads outside the box
        }
        const i = (y * w + x) * 4;
        d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL();
};

const channel = (sel) => `${sel === 0 ? 1 : 0} 0 0 0 0  0 ${sel === 1 ? 1 : 0} 0 0 0  0 0 ${sel === 2 ? 1 : 0} 0 0  0 0 0 1 0`;

const build = (el, { edge = 22, amount = 26, fringe = 0.12, extra = "saturate(1.6) brightness(1.06)" }) => {
    const { width, height } = el.getBoundingClientRect();
    const w = Math.round(width), h = Math.round(height);
    if (w < 8 || h < 8) return null;
    const cs = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, r = Math.min(cs, w / 2, h / 2);
    if (!host) {
        host = document.createElementNS(NS, "svg");
        host.setAttribute("aria-hidden", "true");
        host.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
        document.body.appendChild(host);
    }
    const id = `lq${++uid}`, f = document.createElementNS(NS, "filter");
    f.setAttribute("id", id); f.setAttribute("color-interpolation-filters", "sRGB");
    f.setAttribute("x", "0"); f.setAttribute("y", "0"); f.setAttribute("width", "100%"); f.setAttribute("height", "100%");
    const passes = [0, 1, 2].map((c) => `<feDisplacementMap in="SourceGraphic" in2="m" scale="${amount * (1 + c * fringe)}" xChannelSelector="R" yChannelSelector="G" result="d${c}"/><feColorMatrix in="d${c}" type="matrix" values="${channel(c)}" result="c${c}"/>`).join("");
    f.innerHTML = `<feImage href="${map(w, h, r, Math.min(edge, r || edge, h / 2))}" x="0" y="0" width="${w}" height="${h}" result="m" preserveAspectRatio="none"/>${passes}<feBlend in="c0" in2="c1" mode="screen" result="rg"/><feBlend in="rg" in2="c2" mode="screen"/>`;
    host.appendChild(f);
    el.style.backdropFilter = el.style.webkitBackdropFilter = `url(#${id}) ${extra}`;
    el.classList.add("lg-live");
    return f;
};

// Attach a lens to an element; rebuilt (debounced) when it resizes. Returns a cleanup.
export const liquid = (el, opts = {}) => {
    if (!lensOk || !el) return () => {};
    let f = build(el, opts), t = 0;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => { f?.remove(); f = build(el, opts); }, 120); });
    ro.observe(el);
    return () => { ro.disconnect(); clearTimeout(t); f?.remove(); el.style.backdropFilter = el.style.webkitBackdropFilter = ""; el.classList.remove("lg-live"); };
};

export const useLiquid = (ref, opts) => useEffect(() => liquid(ref.current, opts), [ref, opts]);
