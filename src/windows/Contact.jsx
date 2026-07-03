import React, { useState } from 'react'
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { socials } from "#constants";
import { WindowControls } from "#components";
import useJobStats from "#hooks/useJobStats.js";

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID;
const FORM_ENABLED = Boolean(FORMSPREE_FORM_ID);
const SUBMIT_TIMEOUT_MS = 15000;

const JobStatsTicker = () => {
    const { stats } = useJobStats();
    if (!stats) return null; // hidden while loading, on failure, and on timeout — no spinner, no error UI

    return (
        <div className="flex items-center justify-center gap-4 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white backdrop-blur-md">
            <div className="text-center">
                <p className="text-lg font-semibold leading-none">{stats.total}</p>
                <p className="text-[11px] text-white/60 mt-1">Tracked</p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
                <p className="text-lg font-semibold leading-none">{stats.applied}</p>
                <p className="text-[11px] text-white/60 mt-1">Applied</p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
                <p className="text-lg font-semibold leading-none">{stats.high_match}</p>
                <p className="text-[11px] text-white/60 mt-1">High match</p>
            </div>
        </div>
    );
};

const ContactForm = () => {
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error

    if (!FORM_ENABLED) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        setStatus("submitting");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

        try {
            const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                method: "POST",
                body: formData, // don't set Content-Type manually — browser sets the multipart boundary
                headers: { Accept: "application/json" },
                signal: controller.signal,
            });
            if (res.ok) {
                setStatus("success");
                form.reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error"); // covers network failure AND the timeout abort
        } finally {
            clearTimeout(timeoutId);
        }
    };

    if (status === "success") {
        return (
            <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-600!">
                    Thanks for reaching out — I'll get back to you soon.
                </p>
                <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="text-xs underline text-blue-600"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h3>Send a Message</h3>
            {/* honeypot: Formspree's own documented spam-filter convention */}
            <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

            <fieldset
                disabled={status === "submitting"}
                className="space-y-3 border-0 p-0 m-0 min-w-0 disabled:opacity-60"
            >
                <div>
                    <label htmlFor="contact-name" className="sr-only">Name</label>
                    <input
                        id="contact-name" name="name" type="text" required placeholder="Name"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div>
                    <label htmlFor="contact-email" className="sr-only">Email</label>
                    <input
                        id="contact-email" name="email" type="email" required placeholder="Email"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div>
                    <label htmlFor="contact-message" className="sr-only">Message</label>
                    <textarea
                        id="contact-message" name="message" required rows={4} placeholder="Message"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed transition-colors"
                >
                    {status === "submitting" ? "Sending…" : "Send Message"}
                </button>
            </fieldset>

            {status === "error" && (
                <p className="text-sm font-medium text-red-600!">
                    Something went wrong — please try again, or email me directly above.
                </p>
            )}
        </form>
    );
};

const Contact = ({ embedded = false } = {}) => {
    return (
        <>
            {!embedded && (
                <div id="window-header">
                    <WindowControls target="contact" />
                    <h2>Contact Me</h2>
                </div>
            )}

            <div className="p-5 space-y-5">
                <img
                    src="/images/aman.jpeg"
                    alt="Aman Patel"
                    className="w-20 rounded-full"
                />

                <h3>Let's Connect</h3>
                <p>
                    Got an idea? A bug to fix? Or just wanna talk tech? I'm in.
                </p>
                <p>
                    <a href="mailto:patelaman0241@gmail.com" className="underline underline-offset-2">
                        patelaman0241@gmail.com
                    </a>
                </p>

                <JobStatsTicker />
                <ContactForm />

                <ul>
                    {socials.map(({ id, bg, link, icon, text }) => (
                        <li
                            key={id}
                            style={{ backgroundColor: bg }}
                        >
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={text}
                            >
                                <img
                                    src={icon}
                                    alt={text}
                                    className="size-5"
                                />
                                <p>{text}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
export { Contact };
