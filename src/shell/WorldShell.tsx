"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import CoinSlot from "@shell/CoinSlot.jsx";
import { worldHref } from "@worlds/registry.js";
import { setLast } from "@shell/storage.js";

type Shell = { go: (id: string) => void; spin: () => void };
const ShellContext = createContext<Shell>({ go: () => {}, spin: () => {} });

// Worlds that need navigation (e.g. the terminal's `go` and `spin` commands) read it from here.
export const useShell = () => useContext(ShellContext);

// Wraps a world route: navigation for the world + the coin-slot chip (spin / worlds / link / résumé).
export default function WorldShell({ id, children }: { id: string; children: ReactNode }) {
    const router = useRouter();
    useEffect(() => { setLast(id); }, [id]);
    const shell = useMemo<Shell>(() => ({ go: (to) => router.push(worldHref(to)), spin: () => router.push("/") }), [router]);
    return (
        <ShellContext.Provider value={shell}>
            {children}
            <CoinSlot current={id} onSpin={shell.spin} onSelect={shell.go} />
        </ShellContext.Provider>
    );
}
