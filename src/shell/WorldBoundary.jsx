import { Component } from "react";

const RELOADED = "pexe:reloaded";

// A world chunk can 404 after a redeploy (old HTML, new hashes). Reload once; if it still fails, offer a way out.
class WorldBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch() {
        try {
            if (!sessionStorage.getItem(RELOADED)) {
                sessionStorage.setItem(RELOADED, "1");
                location.reload();
            }
        } catch { /* storage blocked: just show the fallback */ }
    }

    render() {
        if (!this.state.failed) return this.props.children;
        return (
            <div className="min-h-dvh flex flex-col items-center justify-center gap-4 font-georama">
                <p>This world failed to load.</p>
                <a className="underline" href="?style=classic">Open the classic portfolio</a>
            </div>
        );
    }
}

export default WorldBoundary;
