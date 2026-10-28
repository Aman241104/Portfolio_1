import { Suspense } from "react";
import HomeExperience from "@lab/HomeExperience";

// Static: the gate, title and labels are prerendered HTML; the 3D scene hydrates on the client.
// (Old ?style= links are redirected in next.config.ts.)
export default function Home() {
    return (
        <Suspense>
            <HomeExperience />
        </Suspense>
    );
}
