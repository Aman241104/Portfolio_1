import useWindowStore from "#store/window.js";
import {useEffect, useRef, useState} from "react";
import { reduced } from "../motion.js";

// Where the visitor last pressed: a window grows out of the icon (or link) that opened it.
let press = null;
if (typeof window !== "undefined") addEventListener("pointerdown", (e) => { press = { x: e.clientX, y: e.clientY }; }, true);
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {Draggable} from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { windows, focusWindow, closeWindow } = useWindowStore();
        const { isOpen, isMinimized, zIndex } = windows[windowKey];
        const ref = useRef(null);

        // Mounted lags isOpen on close so the window can animate away before it unmounts.
        const [mounted, setMounted] = useState(isOpen);
        const origin = useRef("50% 100%");
        if (isOpen && !mounted) setMounted(true);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;
            if (!isOpen) {
                if (reduced()) return setMounted(false);
                // close mirrors open: back into the icon it came from, accelerating away
                gsap.to(el, { scale: 0.12, opacity: 0, transformOrigin: origin.current, duration: 0.26, ease: "power3.in", onComplete: () => setMounted(false) });
                return;
            }
            if (isMinimized) {
                if (reduced()) { el.style.display = "none"; return; }
                gsap.to(el, { scale: 0.2, y: 180, opacity: 0, duration: 0.22, ease: "power2.in", onComplete: () => { if (useWindowStore.getState().windows[windowKey]?.isMinimized) el.style.display = "none"; } });
                return;
            }
            el.style.display = "block";
            if (reduced()) { gsap.fromTo(el, { opacity: 0 }, { opacity: 1, y: 0, scale: 1, duration: 0.2 }); return; }
            const r = el.getBoundingClientRect();
            origin.current = press ? `${press.x - r.left}px ${press.y - r.top}px` : "50% 100%";
            gsap.fromTo(el, { scale: 0.12, y: 0, transformOrigin: origin.current }, { scale: 1, y: 0, duration: 0.45, ease: "expo.out" });
            gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });   // solid early, never a ghost
        }, [isOpen, isMinimized, mounted])

        useGSAP(() => {
            const el = ref.current;
            if(!el) return;

            const [instance] = Draggable.create(
                el,
                { onPress: () => focusWindow(windowKey), bounds: el.closest("main") || undefined, edgeResistance: 0.85 });

            return () => instance.kill()

        },[mounted])

        // Esc closes the top-most open window (each window checks it is the top one)
        useEffect(() => {
            if (!isOpen) return;
            const onKey = (e) => {
                if (e.key !== "Escape") return;
                const top = Object.entries(useWindowStore.getState().windows).filter(([, w]) => w.isOpen).sort((a, b) => b[1].zIndex - a[1].zIndex)[0];
                if (top?.[0] === windowKey) closeWindow(windowKey);
            };
            window.addEventListener("keydown", onKey);
            ref.current?.focus({ preventScroll: true });
            return () => window.removeEventListener("keydown", onKey);
        }, [isOpen, closeWindow]);

        // closed windows aren't mounted at all (was: all ten mounted and hidden with display:none)
        if (!mounted) return null;

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className="absolute os-window"
                role="dialog"
                aria-label={windowKey}
                tabIndex={-1}
                onDoubleClick={(e) => { if (e.target.closest?.("#window-header") && !e.target.closest?.("button, input")) ref.current?.classList.toggle("is-max"); }}
            >
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

    return Wrapped;
};

export default WindowWrapper;
