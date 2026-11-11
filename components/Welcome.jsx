import { work } from "../content/work.js";

// PX-OS desktop greeting: what this is, how to use it, and a red hand-written note pointing at the folders.
const Welcome = () => (
    <section id="welcome" aria-label="Welcome">
        <p className="px-label">PX-OS 1.0 · Aman Patel · Ahmedabad</p>
        <h1 className="px-title">Every project,<br />as files.</h1>
        <p className="px-sub">{work.length} projects in four folders. Open one, drag the window, press <kbd>Esc</kbd> to close.</p>
    </section>
);
export default Welcome;
