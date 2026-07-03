import { useRef } from "react";
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

    // Same motion language as WindowWrapper.jsx's desktop window-open animation.
    // Runs on mount of this component instance — MobileRoot conditionally
    // renders MobileAppView, so a fresh mount happens every time a different
    // app opens (unmounted entirely, not just hidden, when closed).
    useGSAP(() => {
        const el = rootRef.current;
        if (!el) return;
        gsap.fromTo(
            el,
            { scale: 0.92, opacity: 0, y: 40 },
            { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
    }, []);

    if (!AppComponent) return null;

    return (
        <div ref={rootRef} className="fixed inset-0 z-[70] bg-slate-900 overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 pt-11 pb-3 bg-slate-900/90 backdrop-blur-md">
                <button
                    type="button"
                    onClick={closeApp}
                    className="flex items-center gap-0.5 text-blue-300 font-medium -ml-1.5"
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
