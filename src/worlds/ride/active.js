// which ticket the car is beside: a tiny store so only the two affected tickets re-render (Scene subscribes, the
// shell sets it) — kept apart from Scene.jsx so the shell can paint before three/rapier have downloaded
export const activeStore = { i: -1, subs: new Set() };
export const setActiveTicket = (i) => { activeStore.i = i; activeStore.subs.forEach((f) => f()); };
