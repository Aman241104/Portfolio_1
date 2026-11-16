# Skills & MCP Review

**Date:** 2026-11-15

## 1. Existing Active Setup
- **Skills already in `.agents/skills/`:** `avoid-ai-design`, `design-dna`, `design-taste`, `egm_review`, `genjutsu-cast`, `genjutsu-paint`, `gsap-core`, `gsap-performance`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `high-end-visual-design`, `hue`, `hyperframes`, `motion-director`, `reference-driven-design`, `site-motion-excellence-director`, `web-motion-auditor`.
- **MCP servers already in `~/.gemini/config/mcp_config.json`:** `chrome-devtools-mcp`, `sequential-thinking`, plus `firecrawl` skills.

## 2. New Online Skills Evaluated & Installed (`.agents/skills/`)
Installed via `npx skills add` after Socket/Snyk/Gen security verification (`Safe / 0 alerts / Low Risk`):
1. **`vercel-labs/agent-skills` → `web-design-guidelines`** *(Essential)* — 100+ UI, accessibility, `:focus-visible`, `prefers-reduced-motion`, and typography audit rules.
2. **`CloudAI-X/threejs-skills` → `threejs-materials`, `threejs-lighting`, `threejs-shaders`** *(Essential)* — Modern Three.js r186 PBR, lighting, and GLSL/TSL guidance.

## 3. Additional Recommended Candidates (Documented, Not Force-Installed)
- **Context7 MCP (`upstash/context7`)** — *High Value* for live version-specific Three.js / R3F / GSAP docs.
- **Three.js DevTools MCP (`DmitriyGolub/threejs-devtools-mcp`)** — *High Value* for live browser scene-graph inspection.
- **Lighthouse MCP (`danielsogl/lighthouse-mcp-server`)** — *Optional* (Chrome DevTools MCP already available).
- **Playwright MCP (`microsoft/playwright-mcp`)** — *Optional* (Chrome DevTools MCP + `.playwright-mcp` already used).
