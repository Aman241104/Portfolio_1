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
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        // Mounted lags isOpen on close so the window can animate away before it unmounts.
        const [mounted, setMounted] = useState(isOpen);
        if (isOpen && !mounted) setMounted(true);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;
            if (!isOpen) {
                if (reduced()) return setMounted(false);
                gsap.to(el, { scale: 0.94, opacity: 0, y: 8, duration: 0.18, ease: "power2.in", onComplete: () => setMounted(false) });
                return;
            }
            el.style.display = "block";
            if (reduced()) { gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 }); return; }
            const r = el.getBoundingClientRect();
            const o = press ? `${press.x - r.left}px ${press.y - r.top}px` : "50% 100%";
            gsap.fromTo(el,
                { scale: 0.12, opacity: 0, transformOrigin: o },
                { scale: 1, opacity: 1, duration: 0.55, ease: "expo.out", clearProps: "transformOrigin" });
        }, [isOpen, mounted])

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
            >
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

    return Wrapped;
};

export default WindowWrapper;
