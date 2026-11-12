# Flagship demos (asked 2026-11-12)

Aman: "for flagship project make a demo system and redirect it to that". Recruiters hit Job Search OS stuck on
"Loading…" on phones and Pulse AI on a login wall (recruiter review r1).

## Job Search OS — ~/personal-project/job-serach/web (Next 14, Vercel project `job-search`, repo Aman241104/job-search)
- All data goes through `web/lib/api.ts` (`api` object, 83 methods, cookie session via /auth/google).
- Demo mode: `/demo` route sets `localStorage.demo = "1"` (+ cookie) and redirects to /dashboard. In demo mode
  `api` is wrapped: core reads return seeded fixtures (me, stats, jobs, job, jobSkillGap, jobLegitimacy,
  statsTimeline, analytics, streak, trainTopics, resume, apply → sample CV/cover letter); every write and every
  other method resolves to a typed empty default + a "Demo: changes aren't saved" toast. No backend calls at all,
  so no cold start and no login.
- Fixtures: 12–15 realistic, invented-but-plausible postings (no real personal data), scores, a timeline.
- A thin "Demo mode · sample data" banner with "Exit demo".
- Portfolio: point the project link at https://job-search-zeta-ten.vercel.app/demo (content/work.js `url`).
- Repo has Aman's uncommitted edits (CLAUDE.md, config.py, data/master_resume.json): commit ONLY web/ demo files.

## Pulse AI — ~/personal-project/whatsapp-agents/dashboard (Next 16 + Supabase auth, repo Aman241104/whatsapp-ai-agent)
- Option A (real): a demo tenant in production Supabase with seeded conversations/bookings + "Try the demo" on
  /login signing in with a read-only demo user (RLS / role flag blocks writes). Writes to the prod DB → needs Aman's OK.
- Option B (safe): a `/demo` route rendering the dashboard screens from fixtures, no auth, no DB.
- Repo has uncommitted edits (lib/groq.ts, tests, .gitignore, CLAUDE.md): commit ONLY demo files.
- Portfolio: point the link at the demo URL.

## After both
Phase 2 round 2 re-review of the four worlds; then the 2001 world.
