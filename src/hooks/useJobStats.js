import { useEffect, useState } from "react";

// Public, CORS-open, read-only stats endpoint on a sibling project — not
// account-specific / not a secret, so a plain hardcoded constant, not an env var.
// Job Search OS moved off Cloud Run (2026-11-20): the Cloudflare Worker proxies to the self-hosted server.
// When that server is off it answers 503 and the ticker simply stays hidden.
const STATS_URL = "https://job-search.mind-core.workers.dev/api/public/stats";
const TIMEOUT_MS = 9000; // tunnel + home server can be slow; don't make a visitor wait

// Module-level cache: a plain singleton for the life of the page/session.
// undefined = not attempted yet, null = attempted and failed/timed out (stay
// hidden), object = fetched successfully.
let cachedStats = undefined;

const useJobStats = () => {
    const [stats, setStats] = useState(cachedStats ?? null);
    const [loading, setLoading] = useState(cachedStats === undefined);

    useEffect(() => {
        if (cachedStats !== undefined) return; // already resolved this session, don't refetch

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        fetch(STATS_URL, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`stats request failed: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                cachedStats = data;
                setStats(data);
            })
            .catch(() => {
                // Cold start, timeout, network error, bad payload — a
                // portfolio visitor doesn't need to know or care. Just stay hidden.
                cachedStats = null;
            })
            .finally(() => {
                clearTimeout(timeoutId);
                setLoading(false);
            });

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, []);

    return { stats, loading };
};

export default useJobStats;
