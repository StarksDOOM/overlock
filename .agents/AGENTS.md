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

## Pull Request Process

### Before Creating a PR

1. **Ensure the branch is up to date.** Rebase or merge `develop` into your feature branch before opening a PR.
2. **Verify the build passes locally.** Run `npm run build` and `npm test` (where applicable) before pushing.
3. **Push the feature branch.** `git push origin feature/<short-name>`.

### Creating a PR

1. **Target branch is always `develop`** — never open a PR directly to `master`.
2. **Title format**: Match the issue title using conventional commit prefix.
   - Example: `feat: project scaffolding — TypeScript, TSOA config, and dev tooling`
3. **Body must include**:
   - `Closes #<issue-number>` to auto-link and auto-close the issue on merge.
   - A summary of changes made (what was built, what was modified).
   - Any testing performed or verification steps.
4. **Check for existing PRs first.** Run `gh pr list --repo StarksDOOM/overlock --state open` to avoid duplicate PRs for the same branch/issue.

### PR Review & Merge

1. **All checks must pass** — CI pipeline (build + tests) must be green before merge.
2. **Squash merge** into `develop` — keeps commit history clean with one commit per feature.
3. **Delete the feature branch** after merge — both remote and local.
   ```bash
   git push origin --delete feature/<short-name>
   git branch -d feature/<short-name>
   ```
4. **Never force-push to `develop` or `master`.**

### Merging `develop` → `master`

- Only merge `develop` into `master` when a stable release milestone is reached.
- Use a standard merge commit (not squash) to preserve the full feature history.
- Tag the merge commit with a semver version: `git tag v0.1.0`.

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
