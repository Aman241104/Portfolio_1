import useWindowStore from "#store/window.js";
import {useEffect, useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {Draggable} from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { windows, focusWindow, closeWindow } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if(!el || !isOpen) return;

            el.style.display = "block";

            gsap.fromTo(
                el,
                { scale:0.8, opacity: 0, y: 40},
                { scale:1, opacity:1, y:0, duration:0.4, ease:"power3.out"},
                );
        }, [isOpen])

        useGSAP(() => {
            const el = ref.current;
            if(!el) return;

            const [instance] = Draggable.create(
                el,
                { onPress: () => focusWindow(windowKey), bounds: el.closest("main") || undefined, edgeResistance: 0.85 });

            return () => instance.kill()

        },[isOpen])

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
        if (!isOpen) return null;

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
