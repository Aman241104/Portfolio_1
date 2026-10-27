import { useState } from "react";
import clsx from "clsx";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { onRepeat, topArtists, alsoListening } from "#content/taste.js";

// Real taste, pulled from my YouTube Music (via BitChord). Tracks play through
// youtube-nocookie embeds, so no API key or login is needed.
const Music = ({ embedded = false } = {}) => {
    const [current, setCurrent] = useState(onRepeat[0]);
    // Windows stay mounted while hidden, so only autoplay after the visitor picks a track.
    const [picked, setPicked] = useState(false);

    return (
        <>
            {!embedded && (
                <div id="window-header">
                    <WindowControls target="music" />
                    <h2>Music</h2>
                </div>
            )}

            <div className="bg-neutral-950 text-white p-4 h-full flex flex-col md:flex-row gap-4 md:w-[760px]">
                <div className="md:w-[300px] shrink-0 flex flex-col gap-3">
                    <iframe
                        key={current.id}
                        title={`${current.title} by ${current.artist}`}
                        src={`https://www.youtube-nocookie.com/embed/${current.id}?rel=0${picked ? "&autoplay=1" : ""}`}
                        className="w-full aspect-square rounded-xl bg-black"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="lazy"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-widest text-red-500">Now playing</p>
                        <p className="font-semibold text-lg leading-tight">{current.title}</p>
                        <p className="text-sm text-neutral-400">{current.artist}</p>
                    </div>
                    <a
                        href={`https://music.youtube.com/watch?v=${current.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-400 underline underline-offset-4 hover:text-white"
                    >
                        Open in YouTube Music
                    </a>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">On repeat</h3>
                        <ol className="max-h-64 overflow-y-auto pr-1">
                            {onRepeat.map((track, i) => (
                                <li key={track.id}>
                                    <button
                                        type="button"
                                        onClick={() => { setCurrent(track); setPicked(true); }}
                                        className={clsx(
                                            "w-full flex items-baseline gap-3 px-2 py-1.5 rounded-md text-left hover:bg-white/10",
                                            current.id === track.id && "bg-white/10 text-red-400"
                                        )}
                                    >
                                        <span className="w-5 text-xs text-neutral-500 tabular-nums">{i + 1}</span>
                                        <span className="truncate">{track.title}</span>
                                        <span className="ml-auto text-xs text-neutral-500 truncate">{track.artist}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">In rotation</h3>
                        <ul className="flex flex-wrap gap-1.5">
                            {topArtists.map((artist) => (
                                <li key={artist} className="text-xs px-2 py-1 rounded-full border border-white/15">{artist}</li>
                            ))}
                        </ul>
                        <p className="text-xs text-neutral-500 mt-3">
                            Off-duty: {alsoListening.join(" · ")}
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

const MusicWindow = WindowWrapper(Music, "music");
export default MusicWindow;
export { Music };
