import { useRef } from "react";
import { reduced } from "../motion.js";

// Where the visitor last pressed, so an app zooms out of its own icon and back into it, like a phone.
let press = null;
if (typeof window !== "undefined") addEventListener("pointerdown", (e) => { press = { x: e.clientX, y: e.clientY }; }, true);
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft } from "lucide-react";
import useMobileNavStore from "#store/mobileNav.js";
import { mobileApps } from "#constants";
import MobileProjects from "#mobile/apps/MobileProjects.jsx";
import MobileContact from "#mobile/apps/MobileContact.jsx";
import MobileResume from "#mobile/apps/MobileResume.jsx";
import MobileSkills from "#mobile/apps/MobileSkills.jsx";
import MobileGame from "#mobile/apps/MobileGame.jsx";
import MobileMusic from "#mobile/apps/MobileMusic.jsx";
import MobileGallery from "#mobile/apps/MobileGallery.jsx";
import MobileRepos from "#mobile/apps/MobileRepos.jsx";

const APP_COMPONENTS = {
    finder: MobileProjects,
    contact: MobileContact,
    resume: MobileResume,
    terminal: MobileSkills,
    game: MobileGame,
    music: MobileMusic,
    photos: MobileGallery,
    safari: MobileRepos,
};

const MobileAppView = ({ appId }) => {
    const { closeApp } = useMobileNavStore();
    const app = mobileApps.find((a) => a.id === appId);
    const AppComponent = APP_COMPONENTS[appId];
    const rootRef = useRef(null);

    // Launch: the app zooms out of the icon that was pressed (origin = the press point) and its corners square off.
    const origin = useRef("50% 50%");
    useGSAP(() => {
        const el = rootRef.current;
        if (!el) return;
        if (press) origin.current = `${press.x}px ${press.y}px`;
        if (reduced()) { gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 }); return; }
        gsap.fromTo(el,
            { scale: 0.1, opacity: 0, borderRadius: 60, transformOrigin: origin.current },
            { scale: 1, opacity: 1, borderRadius: 0, duration: 0.5, ease: "expo.out" });
    }, []);

    // Back: shrink into the icon again, then unmount.
    const back = () => {
        const el = rootRef.current;
        if (!el || reduced()) return closeApp();
        gsap.to(el, { scale: 0.1, opacity: 0, borderRadius: 60, transformOrigin: origin.current, duration: 0.32, ease: "power3.in", onComplete: closeApp });
    };

    // Edge swipe back: drag from the left edge, the view follows the finger; past a third (or a flick) it closes.
    const swipe = useRef(null);
    const onTouchStart = (e) => { const x = e.touches[0].clientX; swipe.current = x < 28 ? { x, t: performance.now(), dx: 0 } : null; };
    const onTouchMove = (e) => {
        if (!swipe.current) return;
        swipe.current.dx = Math.max(0, e.touches[0].clientX - swipe.current.x);
        gsap.set(rootRef.current, { x: swipe.current.dx, borderRadius: Math.min(24, swipe.current.dx / 6) });
    };
    const onTouchEnd = () => {
        const s = swipe.current; swipe.current = null;
        if (!s) return;
        const v = s.dx / (performance.now() - s.t);
        if (s.dx > innerWidth / 3 || v > 0.6) gsap.to(rootRef.current, { x: innerWidth, duration: 0.25, ease: "power2.in", onComplete: closeApp });
        else gsap.to(rootRef.current, { x: 0, borderRadius: 0, duration: 0.45, ease: "back.out(1.6)" });
    };

    if (!AppComponent) return null;

    return (
        <div ref={rootRef} className="fixed inset-0 z-[70] bg-slate-900 overflow-y-auto overflow-x-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 pt-11 pb-3 bg-slate-900/90 backdrop-blur-md">
                <button
                    type="button"
                    onClick={back}
                    aria-label="Back to home screen"
                    className="flex items-center gap-0.5 text-blue-300 font-medium -ml-1.5 min-w-11 min-h-11"
                >
                    <ChevronLeft size={22} />
                </button>
                <h1 className="text-white font-semibold">{app?.name}</h1>
            </div>

            <AppComponent />
        </div>
    );
};

export default MobileAppView;
