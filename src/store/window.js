import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

const useWindowStore = create(
    immer((set) => ({
        windows: structuredClone(WINDOW_CONFIG),
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey, data = null) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;

                win.isOpen = true;
                win.isMinimized = false;
                win.zIndex = state.nextZIndex++;
                if (data !== null) win.data = data;
            }),

        minimizeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win || !win.isOpen) return;

                win.isMinimized = true;
            }),

        closeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;

                win.isOpen = false;
                win.isMinimized = false;
                win.data = null;
            }),

        focusWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win || !win.isOpen) return;

                win.zIndex = state.nextZIndex++;
            }),
    }))
);

export default useWindowStore;
