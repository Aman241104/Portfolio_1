import { useEffect, useRef, useState } from "react";
import { liquid } from "../liquid.js";

const LENS = { edge: 26, amount: 30 };
import { X } from "lucide-react";
import { track, identify } from "../analytics.js";

// A gentle "hiring?" card. Once per visitor, never on the first screen: shown just after someone opens the résumé
// (the moment they're most interested) or after ~40s once they've scrolled into the work. One field, one tap to
// dismiss, and it never comes back after either. Leads go through /api/contact (Neon + an email to Aman).
const KEY = "px01-nudge";
const seen = () => { try { return localStorage.getItem(KEY); } catch { return "x"; } };
const remember = (v) => { try { localStorage.setItem(KEY, v); } catch { /* private mode: it just won't persist */ } };

export default function Nudge() {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState("idle");
    const [err, setErr] = useState("");
    const card = useRef(null);
    useEffect(() => (open ? liquid(card.current, LENS) : undefined), [open]);   // the card mounts when it opens

    useEffect(() => {
        if (seen()) return;
        let shown = false;
        // never over the contact form: not while it is on screen or someone is typing in a field
        const busy = () => {
            const land = document.querySelector(".land")?.getBoundingClientRect();
            return document.activeElement?.matches?.("input, textarea") || (land && land.top < innerHeight && land.bottom > 0);
        };
        const show = (why) => { if (shown || seen() || busy()) return; shown = true; setOpen(true); track("nudge_shown", { why }); };
        const onResume = () => setTimeout(() => show("resume"), 1500);
        const onScroll = () => { if (scrollY > innerHeight * 1.6) show("time"); };
        const t = setTimeout(() => { onScroll(); addEventListener("scroll", onScroll, { passive: true }); }, 40000);
        addEventListener("px01:resume", onResume);
        return () => { clearTimeout(t); removeEventListener("scroll", onScroll); removeEventListener("px01:resume", onResume); };
    }, []);

    const close = () => { remember("dismissed"); setOpen(false); track("nudge_dismissed"); };
    const submit = async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const email = String(f.get("email") || "").trim(), role = String(f.get("role") || "").trim();
        setState("sending"); setErr("");
        try {
            const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "lead", email, message: role, website: f.get("website") }) });
            const j = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(j.error || "Couldn't send. Email me instead?");
            identify(email, { role, source: "nudge" });
            track("nudge_sent");
            remember("sent"); setState("sent");
            setTimeout(() => setOpen(false), 2600);
        } catch (x) { setState("idle"); setErr(x.message); }
    };

    if (!open) return null;
    return (
        <aside ref={card} className="nudge lg" role="dialog" aria-label="Hiring?">
            <button type="button" className="nudge-x" onClick={close} aria-label="No thanks"><X size={16} /></button>
            {state === "sent" ? (
                <p className="nudge-done">Thanks. You'll hear from me soon. <span className="mono">— Aman</span></p>
            ) : (
                <form onSubmit={submit}>
                    <p className="mono">Hiring?</p>
                    <p className="nudge-line">Leave a work email and I'll send a résumé tailored to your role. One email, no lists.</p>
                    <input name="email" type="email" required placeholder="you@company.com" autoComplete="email" aria-label="Work email" />
                    <input name="role" placeholder="Role or company (optional)" maxLength={200} aria-label="Role or company" />
                    <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden />
                    {err && <p className="nudge-err" role="alert">{err}</p>}
                    <button type="submit" className="nudge-go" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</button>
                </form>
            )}
        </aside>
    );
}
