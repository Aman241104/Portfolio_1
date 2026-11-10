/* global process */
// Neon Postgres for the Vercel functions (files starting with _ are not routes).
// Vercel → Storage → Neon (free) injects DATABASE_URL. Tables are created on first use: three tiny tables
// don't earn a migration tool. ponytail: add one when the schema starts changing.
import { neon } from "@neondatabase/serverless";

export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

let ready = null;
export const ensure = () => (ready ??= Promise.all([
    sql`create table if not exists px01_counter (id int primary key, pulls bigint not null default 0)`,
    sql`create table if not exists px01_hits (ip text primary key, at timestamptz not null)`,
    sql`create table if not exists px01_messages (
        id bigserial primary key, name text not null, email text not null, message text not null,
        ip text, created_at timestamptz not null default now())`,
]).catch((e) => { ready = null; throw e; }));

export const ipOf = (req) => String(req.headers["x-forwarded-for"] || "anon").split(",")[0].trim();
