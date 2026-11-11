// Public GitHub activity for Mission Control: the last ~90 days of public events, summarised server-side
// (daily commit counts, recent commits, repos touched) and cached 10 min at the edge, so visitors never hit
// GitHub's unauthenticated rate limit. Public repos only; nothing private is ever visible here.
const USER = "Aman241104";

export default async function handler(req, res) {
    const pages = await Promise.all([1, 2, 3].map((p) =>
        fetch(`https://api.github.com/users/${USER}/events/public?per_page=100&page=${p}`, {
            headers: { "User-Agent": "aman-patel.me mission-control", Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(8000),
        }).then((r) => (r.ok ? r.json() : [])).catch(() => [])));
    const events = pages.flat().filter((e) => e && e.type);
    const days = {}, repos = {}, commits = [];   // commits = recent pushes (GitHub no longer sends messages publicly)
    for (const e of events) {
        const day = e.created_at.slice(0, 10), repo = e.repo?.name?.split("/")[1] || "?";
        if (e.type === "PushEvent") {
            const n = e.payload?.size ?? e.payload?.commits?.length ?? 1;
            days[day] = (days[day] || 0) + n;
            repos[repo] = (repos[repo] || 0) + n;
            commits.push({ repo, n, branch: (e.payload?.ref || "").replace("refs/heads/", ""), at: e.created_at });
        } else if (["CreateEvent", "PullRequestEvent", "ReleaseEvent"].includes(e.type)) {
            days[day] = (days[day] || 0) + 1;
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    res.status(200).json({
        user: USER, events: events.length, days,
        repos: Object.entries(repos).sort((a, b) => b[1] - a[1]).slice(0, 6),
        commits: commits.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8),
    });
}
