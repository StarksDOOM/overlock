# core-state-ledger

A production-grade inventory allocation state engine built with **TSOA** (TypeScript OpenAPI Annotation), **PostgreSQL** (row-level locking), and **Redis** (idempotency layer).

## Architecture

- **Contract-First API** — TSOA auto-generates OpenAPI 3.0 spec and type-safe Express routes from TypeScript decorators
- **Concurrency-Safe Transactions** — PostgreSQL `SELECT ... FOR UPDATE` row locking prevents race conditions on inventory mutations
- **Idempotency Shield** — Redis-backed `X-Idempotency-Key` enforcement prevents duplicate mutations across retries
- **JWT Authentication** — TSOA `@Security` decorators with `expressAuthentication` module
- **Domain-Driven Structure** — Clean separation between HTTP contract layer, business logic, and infrastructure

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express + TSOA |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT Bearer Tokens |
| Docs | Swagger UI (auto-generated) |
| CI/CD | GitHub Actions |
| Infra | Docker Compose |

## Getting Started

> Full setup instructions will be added once the development branch is established.

## License

MIT
