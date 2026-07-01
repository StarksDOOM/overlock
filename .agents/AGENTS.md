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

## Testing

### Enforcement

- **No PR merges without green CI.** GitHub Actions must pass all checks before a PR can be merged into `develop`.
- **Every new service or component must have corresponding tests.** Untested code is not mergeable.

### Backend (`@overlock/backend`)

- **Test runner**: Jest with `ts-jest` preset.
- **Unit tests**: `backend/tests/**/*.test.ts` — test services and utilities in isolation.
- **Integration tests**: `backend/tests/**/*.integration.test.ts` — test full request lifecycle against real Postgres + Redis via Docker service containers.
- **Run locally**:
  ```bash
  npm test --workspace=backend                    # unit tests
  npm run test:integration --workspace=backend    # integration tests (requires Docker)
  ```
- **CI pipeline**: GitHub Actions spins up `postgres:16-alpine` and `redis:7-alpine` as service containers, runs migrations, then executes both test suites.
- **Required coverage**:
  - All domain services (`allocation.service.ts`, `idempotency.service.ts`, `anomaly.service.ts`) must have tests.
  - The concurrency proof test (10 concurrent writes via `Promise.all()`) must be present and passing.

### Frontend (`@overlock/frontend`)

- **Test runner**: Jest or Vitest (whichever is configured by Next.js).
- **Component tests**: `frontend/__tests__/**/*.test.tsx` — test React components and hooks.
- **Validation tests**: `frontend/__tests__/**/*.test.ts` — test pure logic (e.g., `acid-validator.ts`).
- **Lint check**: `npm run lint --workspace=frontend` must pass with zero errors.
- **Run locally**:
  ```bash
  npm test --workspace=frontend     # component + logic tests
  npm run lint --workspace=frontend # ESLint check
  ```
- **CI pipeline**: GitHub Actions runs `npm run build --workspace=frontend` (Next.js build catches type errors) and `npm run lint --workspace=frontend`.
- **Required coverage**:
  - ACID validator logic (`acid-validator.ts`) must have unit tests for all 7 checks.
  - API client (`api-client.ts`) must have tests for error handling paths.

### GitHub Actions CI Requirements

- **Trigger on**: `push` to `master` and `develop`, all `pull_request` events.
- **Both workspaces tested**: CI runs backend and frontend checks in the same workflow (can be parallel jobs).
- **Service containers**: Postgres 16 + Redis 7 for backend integration tests.
- **Fail-fast**: If any job fails, the entire workflow fails and the PR is blocked.
- **Environment variables**: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `NODE_ENV=test` set in CI.
