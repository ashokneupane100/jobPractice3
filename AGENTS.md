<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# coding-in-depth ("Prept")

Early-stage Next.js 16 App Router app for job-interview prep. JavaScript/JSX only (no TypeScript source). `@/*` maps to the repo root, not `src/`.

## Commands

Use npm; `package-lock.json` is the only lockfile.

- `npm run dev` — dev server at `http://localhost:3000`.
- `npm run lint` — runs plain `eslint`. It currently exits 1 on two pre-existing `react-hooks/set-state-in-effect` errors in `components/ui/carousel.jsx` and `hooks/use-mobile.js`. Check only your files with `npx eslint <path>`.
- `npm run build` — currently fails prerendering `/sign-up/...`: Clerk's `<SignUp>`/`<SignIn>` call `usePathname()` outside `<Suspense>` while `cacheComponents` is enabled. This is not a new regression unless you touched auth or caching.
- No test runner, typecheck script, CI workflow, or pre-commit hook is configured.

`npm install` runs `prisma skills sync || exit 0`, which regenerates the Prisma skill copies in `.agents/`, `.claude/`, `.cursor/`, and `.devin/` (configured in `prisma.config.ts`). Supabase skills in `.agents/skills/` are pinned by `skills-lock.json`. Treat these as generated files.

## Environment and data

- `.env.local` is gitignored and required. It must define `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, the Clerk sign-in/up and fallback redirect URLs, plus `DATABASE_URL` and `DIRECT_URL`.
- Prisma is configured for PostgreSQL but not actually used yet: `prisma/schema.prisma` has no models, `@prisma/client` is not installed, and there are no migration/generate scripts. `prisma` itself is an 8.0 release candidate.
- There are no API routes, server actions, or data-access modules yet. The app currently consists of the marketing page and Clerk auth pages.

## Architecture

- `app/` uses route groups: `(auth)` holds the Clerk `<SignIn>`/`<SignUp>` pages; `app/layout.js` wires `ClerkProvider`, `next-themes` (dark by default), and the global `Header`.
- Auth is Clerk v7. `proxy.js` is the Next 16 replacement for `middleware.js` and mounts `clerkMiddleware()`; change auth matching there, not in a `middleware` file.
- `components/ui/*` is shadcn-generated with `style: "radix-nova"` and `tsx: false` (see `components.json`). Generated components import primitives from the unified `radix-ui` package and `cn` from the `cn` package. Avoid rewriting generated UI or introducing TSX unless necessary.
- App code uses `@/` imports. `lib/utils.js` re-exports `cn`; `Button` has project-specific `gold` and `hero` variants in `components/ui/button.jsx`; design tokens are CSS variables in `app/globals.css`.
- Tailwind v4 is CSS-first: there is no `tailwind.config.*`. Add theme tokens in `app/globals.css` under `@theme inline`.
- `lib/highlighter.jsx` lazily loads Shiki languages; add new languages to both its `languages` and `aliases` maps. `hooks/use-highlighted-code.js` relies on streaming/grammar state, so avoid re-tokenizing the whole code string.

## Gotchas

- `next.config.mjs` enables `cacheComponents` and `partialPrefetching`. With Cache Components, client hooks and dynamic data must be inside `<Suspense>` (or a route must opt out with `instant = false`), or production builds fail.
- Read the version-matched docs in `node_modules/next/dist/docs/` before using framework APIs; names changed in v16 (e.g. Middleware → Proxy, PPR → Cache Components).
- `components/Header.jsx` currently uses lowercase `<show when=...>`, which is not a Clerk component. Clerk's component is `<Show>`; the file already imports unused `SignedIn`/`SignedOut` as an alternative. Auth buttons will not render until this is fixed.
- The `nextjs-agent-rules` and `nextjs-agent-feedback` blocks in this file are managed by `next dev` because `experimental.agentFeedback` is enabled. Do not delete them; they are regenerated.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
