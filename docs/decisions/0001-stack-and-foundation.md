# ADR 0001 — Stack and foundation

- **Status:** Proposed (implemented in Phase 2; awaiting owner acceptance)
- **Owner:** Tree (Tree Augmented) — engineering
- **Date:** 2026-11-19

## Context

Greenfield repository (see `docs/REPOSITORY_ASSESSMENT.md`). `ARCHITECTURE.md` proposes a
Next.js + TypeScript modular monolith on PostgreSQL. Versions were checked on npm on 19 Nov 2026.

## Decision

| Item | Choice | Why |
|---|---|---|
| Runtime | Node 26 LTS in deploy/CI (`.nvmrc`); `engines >=22.12` | 26 is Active LTS since 28 Oct 2026; 22 is still supported, so local machines on 22 work |
| Framework | Next.js 16.4 App Router, React 19.3, Turbopack build | Architecture proposal |
| Request hook | `src/proxy.ts` (Next 16 replacement for `middleware.ts`) for correlation ids | |
| TypeScript | **6.0.x**, not 7.0 | typescript-eslint 8.73 supports `<6.1.0`; TS 7 would break linting |
| Typed routes | `typedRoutes: true` | Broken internal links fail the type check |
| Validation | Zod 4 | Env now; HTTP/webhook/job boundaries later |
| Lint/format | ESLint 10 flat config with `eslint-config-next`, Prettier | |
| Unit tests | Vitest 5 | |
| Route checks | `scripts/route-smoke.mjs` against `next start` | Playwright browsers could not be assumed available; add Playwright + axe in Phase 11 |
| Package manager | pnpm 10 | |
| Styling | One global stylesheet, system fonts, no UI framework | Low bandwidth; no client JS needed except the mobile menu |
| Database / ORM | Deferred to Phase 3 (Drizzle + PostgreSQL proposed) | Not needed for the shell |

## Alternatives considered

- TypeScript 7.0: rejected for now (tooling); revisit when typescript-eslint supports it.
- Tailwind or a component library: rejected for the shell; can be adopted with a design system later.

## Consequences

- Public pages are statically generated; portal pages render an honest "sign-in isn't available" state and load no data.
- `/api/ready` reports `database: not_configured` until Phase 3.

## Revisit when

typescript-eslint supports TS 7; a design system is supplied; hosting vendor is chosen (Node version available).
