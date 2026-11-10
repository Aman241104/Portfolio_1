/* global process */
// Contact form: validate → store in Neon → email Aman through Resend (plain text, reply-to = sender).
// Env: RESEND_API_KEY (required to send), CONTACT_TO (defaults to the address already public on the site),
// CONTACT_FROM (defaults to Resend's test sender, which can only deliver to the Resend account's own address).
import { sql, ensure, ipOf } from "./_db.js";

const TO = process.env.CONTACT_TO || "patelaman0241@gmail.com";
const FROM = process.env.CONTACT_FROM || "PX-01 <onboarding@resend.dev>";
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

export const validate = (b) => {
    const name = String(b?.name ?? "").trim().replace(/[\r\n]+/g, " ");
    const email = String(b?.email ?? "").trim();
    const message = String(b?.message ?? "").trim();
    if (b?.website) return { spam: true };                              // honeypot: real people never see it
    if (!name || name.length > 80) return { error: "Please add your name (up to 80 characters)." };
    if (!EMAIL.test(email) || email.length > 200) return { error: "That email doesn't look right." };
    if (message.length < 10 || message.length > 4000) return { error: "Write a little more (10 to 4000 characters)." };
    return { name, email, message };
};

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).end();
    const v = validate(typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body);
    if (v.spam) return res.status(200).json({ ok: true });
    if (v.error) return res.status(400).json({ error: v.error });
    if (!process.env.RESEND_API_KEY && !sql) return res.status(503).json({ error: "Messages aren't switched on yet. Email me instead." });

    const ip = ipOf(req);
    let id = null;
    if (sql) {
        try {
            await ensure();
            const [{ n }] = await sql`select count(*)::int as n from px01_messages where ip = ${ip} and created_at > now() - interval '1 hour'`;
            if (n >= 3) return res.status(429).json({ error: "That's a few messages in an hour. Email me directly?" });
            [{ id }] = await sql`insert into px01_messages (name, email, message, ip) values (${v.name}, ${v.email}, ${v.message}, ${ip}) returning id`;
        } catch { /* storage is a bonus; still try to deliver */ }
    }
    if (process.env.RESEND_API_KEY) {
        const r = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: FROM, to: [TO], reply_to: v.email,
                subject: `PX-01 · message from ${v.name}`,
                text: `${v.message}\n\n— ${v.name} <${v.email}>${id ? `\nmessage #${id}` : ""}`,
            }),
        }).catch(() => null);
        if (!r?.ok && !id) return res.status(502).json({ error: "Couldn't send right now. Email me instead." });
    }
    return res.status(200).json({ ok: true, no: id });
}
