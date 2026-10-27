// Storage can throw (private mode, blocked site data). Failing = behave like a first visit.
const safe = (fn, fallback) => {
    try { return fn(); } catch { return fallback; }
};

export const LAST_KEY = "pexe:last";
export const SEEN_KEY = "pexe:seen";

export const getLast = () => safe(() => localStorage.getItem(LAST_KEY), null);
export const setLast = (id) => safe(() => localStorage.setItem(LAST_KEY, id));

export const getSeen = () => safe(() => JSON.parse(sessionStorage.getItem(SEEN_KEY)) ?? [], []);
export const setSeen = (ids) => safe(() => sessionStorage.setItem(SEEN_KEY, JSON.stringify(ids)));
