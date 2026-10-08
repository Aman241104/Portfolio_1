import { useEffect, useState } from "react";

// Public, CORS-open, read-only stats endpoint on a sibling project — not
// account-specific / not a secret, so a plain hardcoded constant, not an env var.
const STATS_URL = "https://job-serach-api-119923500810.asia-south1.run.app/api/public/stats";
const TIMEOUT_MS = 9000; // Cloud Run cold start is a few seconds; don't make a visitor wait

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
