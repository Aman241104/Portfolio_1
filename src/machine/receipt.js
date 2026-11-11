import * as THREE from "three";

// The win ticket as real thermal paper: drawn once per result on a canvas (warm stock, fibres and grain, slightly
// uneven ink that fades toward the edges, dotted rules, a barcode, a perforated tear line, a torn bottom edge),
// then mapped onto a sheet that curls toward you like paper fresh out of a printer.
const W = 512;
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const receiptTexture = (tk, aspect) => {
    const H = Math.round(W * aspect), c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    // stock: warm off-white with a soft gradient (thermal paper is never pure white)
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#f6f1e6"); bg.addColorStop(1, "#ece5d6");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // grain + fibres
    const img = g.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n - 2; }
    g.putImageData(img, 0, 0);
    g.strokeStyle = "rgba(120, 105, 80, .07)"; g.lineWidth = 0.6;
    for (let i = 0; i < 90; i++) { const x = rnd(i) * W, y = rnd(i + 9) * H, a = rnd(i + 3) * 6.28, l = 6 + rnd(i + 5) * 18; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * .5 + 3, y + Math.sin(a) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }

    // thermal ink: near-black, a touch blurred, density varies line to line
    const ink = (a = 1) => `rgba(28, 26, 23, ${a})`, red = "rgba(214, 40, 28, .92)";
    const P = 34, R = W - P;
    let y = 46;
    const text = (s, x, size, { align = "left", weight = 500, color, track = 0.08, alpha } = {}) => {
        g.font = `${weight} ${size}px "Geist Mono", ui-monospace, monospace`; g.textAlign = align; g.textBaseline = "alphabetic";
        g.fillStyle = color || ink(alpha ?? (0.78 + rnd(y) * 0.2));
        if ("letterSpacing" in g) g.letterSpacing = `${track * size}px`;
        g.fillText(s, x, y);
    };
    const dots = (yy) => { g.fillStyle = ink(0.55); for (let x = P; x < R; x += 7) g.fillRect(x, yy, 3, 2); };
    g.filter = "blur(0.35px)";
    text("PX-01 · REALITY SELECTOR", W / 2, 22, { align: "center", weight: 600 }); y += 26;
    text("AMAN PATEL — CLEAR EDITION", W / 2, 15, { align: "center", alpha: 0.6 }); y += 24;
    const now = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    text(now.toUpperCase() + " IST", P, 15, { alpha: 0.7 }); text(`No. ${String(tk.no).padStart(6, "0")}`, R, 15, { align: "right", alpha: 0.7 }); y += 16;
    dots(y); y += 38;
    text("REALITY SELECTED", P, 16, { color: red, weight: 600, track: 0.16 }); y += 50;
    const name = tk.name.toUpperCase(); let fs = 46;
    g.font = `700 ${fs}px "Geist Mono", monospace`; while (g.measureText(name).width > R - P && fs > 26) { fs -= 2; g.font = `700 ${fs}px "Geist Mono", monospace`; }
    text(name, P, fs, { weight: 700, track: -0.02, alpha: 0.95 }); y += 22;
    dots(y); y += 34;
    ["ERA", "MEDIUM", "MOOD"].forEach((l, i) => { const x = P + i * ((R - P) / 3); text(l, x, 13, { alpha: 0.5, track: 0.16 }); });
    y += 26;
    ["ERA", "MEDIUM", "MOOD"].forEach((_, i) => { const x = P + i * ((R - P) / 3); text(String(tk.symbols[i]).toUpperCase(), x, 20, { weight: 600 }); });
    y += 34;
    text("1 × WORLD", P, 16); text("FREE", R, 16, { align: "right" }); y += 24;
    text("TIP (HIRING)", P, 16, { alpha: 0.7 }); text("WELCOME", R, 16, { align: "right", alpha: 0.7 }); y += 18;
    dots(y); y += 18;
    // barcode from the ticket number
    const bw = R - P; let x = P, s = tk.no * 7 + 3;
    while (x < P + bw) { s = (s * 1103515245 + 12345) >>> 0; const w = 1 + (s % 4); if ((s >> 3) % 3) { g.fillStyle = ink(0.85); g.fillRect(x, y, w, 46); } x += w + 1 + ((s >> 5) % 2); }
    y += 64;
    text("THANK YOU FOR PLAYING", W / 2, 14, { align: "center", alpha: 0.55, track: 0.2 });
    g.filter = "none";
    // perforation + tear prompt
    const py = H - 64;
    g.fillStyle = "rgba(0,0,0,.0)"; g.globalCompositeOperation = "destination-out";
    for (let xx = 10; xx < W; xx += 16) { g.beginPath(); g.arc(xx, py, 3.2, 0, Math.PI * 2); g.fill(); }
    g.globalCompositeOperation = "source-over";
    y = py + 32; text("TEAR HERE TO ENTER →", W / 2, 17, { align: "center", color: red, weight: 600, track: 0.14 });
    // torn bottom edge: an irregular zig-zag cut out of the sheet
    g.globalCompositeOperation = "destination-out"; g.beginPath(); g.moveTo(0, H);
    for (let xx = 0, k = 0; xx <= W; xx += 9, k++) g.lineTo(xx, H - 5 - (k % 2 ? 7 : 0) - rnd(k) * 5);
    g.lineTo(W, H); g.closePath(); g.fill(); g.globalCompositeOperation = "source-over";

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
};

// Sheet geometry: hangs from the slot (top edge at y=0), curls toward the viewer at the bottom, with a soft cross-bow.
export const receiptGeometry = (w, h) => {
    const geo = new THREE.PlaneGeometry(w, h, 10, 40);
    geo.translate(0, -h / 2, 0);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), k = -y / h;                 // 0 at the slot → 1 at the bottom
        p.setZ(i, 0.2 * k ** 2.4 + 0.018 * (1 - (2 * x / w) ** 2) * k);
        p.setY(i, y + 0.05 * k ** 3);                                     // the curl pulls the bottom up a touch
    }
    geo.computeVertexNormals();
    return geo;
};
