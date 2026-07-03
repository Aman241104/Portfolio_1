import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";

// No Apple Developer Program membership available (MusicKit JS requires one),
// so this uses a free Spotify embed instead — no auth/API key needed at all.
// Swap PLAYLIST_EMBED_URL for any playlist/album/track's own embed link:
// open it in Spotify -> Share -> Embed playlist -> copy the src="..." URL.
const PLAYLIST_EMBED_URL = "https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j?utm_source=generator&theme=0";

const Music = ({ embedded = false } = {}) => {
    return (
        <>
            {!embedded && (
                <div id="window-header">
                    <WindowControls target="music" />
                    <h2>Music</h2>
                </div>
            )}

            <div className="bg-slate-950 p-4 h-full flex items-center justify-center">
                <iframe
                    title="Spotify player"
                    src={PLAYLIST_EMBED_URL}
                    width="100%"
                    height="380"
                    style={{ borderRadius: 12, border: 0 }}
                    allowFullScreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </div>
        </>
    );
};

const MusicWindow = WindowWrapper(Music, "music");
export default MusicWindow;
export { Music };
