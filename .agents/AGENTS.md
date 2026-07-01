# Overlock — Agent Rules

## Issue Management

Before creating any new GitHub issue on `StarksDOOM/overlock`:

1. **Check existing issues first.** Run `gh issue list --repo StarksDOOM/overlock --state open --limit 50` and review all open issues.
2. **Search by keyword.** Run `gh issue list --repo StarksDOOM/overlock --search "<keyword>"` to check for duplicates by title or body content.
3. **Never create a duplicate.** If an existing issue already covers the scope of what you intend to create — even partially — update the existing issue instead of creating a new one.
4. **Reference related issues.** When creating a new issue that depends on or relates to existing issues, reference them by number (e.g., `Depends on #4`).

## Repository

- **Owner**: `StarksDOOM`
- **Repo**: `overlock`
- **Default branch**: `master`
- **Development branch**: `develop`
- **Branch naming**: `feature/<short-name>` branched from `develop`

## Git Workflow

- All implementation work happens on feature branches off `develop`.
- Never commit directly to `master` or `develop`.
- Each feature branch maps to exactly one GitHub issue.
- Commit messages follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

## Architecture

- This is an **npm workspaces monorepo** with `backend/` and `frontend/` packages.
- Backend code lives under `backend/src/` — never in the root `src/`.
- Frontend code lives under `frontend/src/` — never in the root `src/`.
- Shared infrastructure (Docker, CI, README) lives at the root.

## Code Style

- TypeScript strict mode (`strict: true`) is mandatory.
- Controllers contain zero business logic — they delegate to services.
- Database queries use raw SQL with `pg` — no ORM.
- All domain logic follows the `domains/<name>/` directory structure.
