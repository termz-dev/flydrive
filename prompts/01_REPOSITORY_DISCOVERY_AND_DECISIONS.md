# Phase 1 — Repository Discovery and Decisions

Apply `00_MASTER_ORCHESTRATOR.md`. Inspect without changing files: repo/worktree state; runtime/package manager; apps/routes; modules; DB/migrations; auth; provider adapters; tests/CI; deploy; env examples. Read existing agent instructions/docs. Never reveal secret values; state only whether expected config exists.

Create `docs/REPOSITORY_ASSESSMENT.md` with exact stack/version evidence, route map (public/customer/driver/ops), existing data/auth/integration/test/deploy patterns, reusable/broken/empty areas, conflicts/risks, and a PRD-to-files traceability table. Propose sequence of vertical slices with dependencies/exit checks. List decisions agents can make vs OPEN decisions/owners. If repo is empty, propose directory tree; do not scaffold yet.

Do not overwrite user changes or claim behavior based on filenames. Exit when another engineer can understand current state and safely start foundation. Report files read and checks performed.
