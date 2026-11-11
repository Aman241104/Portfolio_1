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
    // thermal-printer flaws: a couple of faint dropout streaks through the print, and stock yellowing at the edges
    for (let i = 0; i < 3; i++) { const sy = 90 + rnd(tk.no + i) * (H - 260); g.fillStyle = "rgba(246, 241, 230, .45)"; g.fillRect(0, sy, W, 1 + rnd(i + 4) * 2); }
    const edge = g.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.45, Math.max(W, H) * 0.75);
    edge.addColorStop(0, "rgba(200, 175, 120, 0)"); edge.addColorStop(1, "rgba(200, 175, 120, .22)");
    g.fillStyle = edge; g.fillRect(0, 0, W, H);
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

    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 4;

    // bump: the surface the light rakes across — grain, fibres, a fold crease, a few soft wrinkles
    const b = document.createElement("canvas"); b.width = W / 2; b.height = Math.round(H / 2);
    const bg2 = b.getContext("2d"), bi = bg2.createImageData(b.width, b.height), bd = bi.data;
    for (let i = 0; i < bd.length; i += 4) { const n = 128 + (Math.random() - 0.5) * 60; bd[i] = bd[i + 1] = bd[i + 2] = n; bd[i + 3] = 255; }
    bg2.putImageData(bi, 0, 0);
    bg2.strokeStyle = "rgba(255,255,255,.35)"; bg2.lineWidth = 0.8;
    for (let i = 0; i < 70; i++) { const x = rnd(i + 40) * b.width, y = rnd(i + 70) * b.height, a = rnd(i + 11) * 6.28, l = 4 + rnd(i + 2) * 10; bg2.beginPath(); bg2.moveTo(x, y); bg2.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); bg2.stroke(); }
    const fy = b.height * 0.47, crease = bg2.createLinearGradient(0, fy - 6, 0, fy + 6);
    crease.addColorStop(0, "rgba(255,255,255,0)"); crease.addColorStop(0.45, "rgba(255,255,255,.55)"); crease.addColorStop(0.55, "rgba(0,0,0,.5)"); crease.addColorStop(1, "rgba(0,0,0,0)");
    bg2.fillStyle = crease; bg2.fillRect(0, fy - 6, b.width, 12);
    for (let i = 0; i < 4; i++) {
        const x = rnd(tk.no + i * 3) * b.width, y = rnd(tk.no + i * 5) * b.height, r = 20 + rnd(i) * 40;
        const w = bg2.createRadialGradient(x, y, 0, x, y, r); w.addColorStop(0, "rgba(255,255,255,.18)"); w.addColorStop(1, "rgba(255,255,255,0)");
        bg2.fillStyle = w; bg2.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const bump = new THREE.CanvasTexture(b);
    return { map, bump };
};

// Sheet geometry: hangs from the slot (top edge at y=0), curls toward the viewer at the bottom, with a soft cross-bow.
export const receiptGeometry = (w, h) => {
    const geo = new THREE.PlaneGeometry(w, h, 10, 40);
    geo.translate(0, -h / 2, 0);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), k = -y / h;                 // 0 at the slot → 1 at the bottom
        const fold = -0.014 * Math.max(0, 1 - Math.abs(k - 0.47) / 0.05);          // a soft fold where it was creased
        const wrinkle = 0.004 * Math.sin(x * 23 + k * 9) * Math.sin(k * 17 + 1.3) * k;
        p.setZ(i, 0.2 * k ** 2.4 + 0.018 * (1 - (2 * x / w) ** 2) * k + fold + wrinkle);
        p.setY(i, y + 0.05 * k ** 3);                                     // the curl pulls the bottom up a touch
    }
    geo.computeVertexNormals();
    geo.userData.base = Float32Array.from(p.array);                       // rest shape, for the flutter
    return geo;
};
