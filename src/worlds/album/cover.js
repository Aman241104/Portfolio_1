// Original, procedural "cover art": every project draws one ring, its thickness and arc from a hash of its slug.
// The cover is literally the data. Same seed as the tracklist waveforms; no borrowed artwork.
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export function drawCover(canvas, slugs, { accent = "#c8ff2e", ink = "#070707", paper = "#f2f0ea" } = {}) {
    const S = canvas.width, g = canvas.getContext("2d"), c = S / 2;
    g.fillStyle = ink; g.fillRect(0, 0, S, S);
    slugs.forEach((slug, i) => {
        let h = hash(slug);
        const r = S * 0.08 + (i / slugs.length) * S * 0.4;
        const start = (h % 360) * Math.PI / 180;
        h = (h * 1103515245 + 12345) >>> 0;
        const sweep = Math.PI * (0.6 + (h % 140) / 100);
        g.lineWidth = 2 + (h % 7);
        g.strokeStyle = i % 5 === 0 ? accent : `rgba(242, 240, 234, ${0.18 + (h % 50) / 100})`;
        g.beginPath(); g.arc(c, c, r, start, start + sweep); g.stroke();
    });
    g.fillStyle = accent; g.beginPath(); g.arc(c, c, S * 0.055, 0, Math.PI * 2); g.fill();
    g.fillStyle = ink; g.beginPath(); g.arc(c, c, S * 0.012, 0, Math.PI * 2); g.fill();
    // original "advisory" sticker: our own words, our own box
    g.fillStyle = paper; g.fillRect(S * 0.66, S * 0.86, S * 0.3, S * 0.1);
    g.fillStyle = ink; g.font = `800 ${S * 0.026}px Archivo, sans-serif`; g.textAlign = "center";
    g.fillText("SHIPS TO", S * 0.81, S * 0.905); g.fillText("PRODUCTION", S * 0.81, S * 0.94);
    g.fillStyle = paper; g.textAlign = "left"; g.font = `800 ${S * 0.07}px Archivo, sans-serif`;
    g.fillText("SHIP IT", S * 0.05, S * 0.11);
    g.font = `500 ${S * 0.026}px "Space Mono", monospace`; g.fillStyle = accent;
    g.fillText(`AMAN PATEL · ${slugs.length} TRACKS`, S * 0.05, S * 0.155);
}
