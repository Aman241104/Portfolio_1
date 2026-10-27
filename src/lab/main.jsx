import { createRoot } from "react-dom/client";
import LabPage from "./LabPage.jsx";

// Reel labels are painted onto a canvas, so the mono font must be loaded before the textures are drawn.
const mono = new FontFace("Geist Mono", "url(/fonts/GeistMono-500.ttf)", { weight: "600" });
mono.load().then((f) => document.fonts.add(f)).catch(() => {}).finally(() => {
    createRoot(document.getElementById("root")).render(<LabPage />);
});
