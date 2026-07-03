import useMobileNavStore from "#store/mobileNav.js";
import StatusBar from "#mobile/StatusBar.jsx";
import Springboard from "#mobile/Springboard.jsx";
import MobileAppView from "#mobile/MobileAppView.jsx";

const MobileRoot = () => {
    const { activeApp } = useMobileNavStore();

    return (
        <>
            <StatusBar />
            <Springboard />
            {activeApp && <MobileAppView appId={activeApp} />}
        </>
    );
};

export default MobileRoot;
