import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Mirrors the existing window.js / location.js store pattern. activeApp is
// null when the springboard is showing, otherwise one of the mobileApps ids.
const useMobileNavStore = create(
    immer((set) => ({
        activeApp: null,

        openApp: (id) =>
            set((state) => {
                state.activeApp = id;
            }),

        closeApp: () =>
            set((state) => {
                state.activeApp = null;
            }),
    }))
);

export default useMobileNavStore;
