# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Rocket 0.5 (Rust) — `artifacts/api-server/`
- **API database driver**: sqlx 0.7 with PostgreSQL + chrono features (Rust)
- **Frontend framework**: React + Vite (TypeScript) — `artifacts/edupath/`
- **Database**: PostgreSQL (7 tables: students, exams, jobs, notes, careers, ai_trends, notifications)
- **DB schema/migrations**: Drizzle ORM (`lib/db/`)
- **API codegen**: Orval (from `lib/api-spec/openapi.yaml`) → React Query hooks + Zod schemas
- **Rust binary entry**: `artifacts/api-server/src/main.rs`

## Key Commands

- `pnpm run typecheck` — full typecheck across all TypeScript packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Rust API server is started automatically via `artifacts/api-server/run.sh` (called by pnpm dev script)
- Rust compilation cache in `artifacts/api-server/target/` (git-ignored)

## EduPath App

Full-stack student platform for Indian students (Class 5 to PhD). Features:
- Competitive exam hub (15 exams seeded)
- Job board (12 jobs seeded)
- Study notes library (10 notes in 4 folders)
- Career paths (8 careers seeded)
- AI trends (10 trends seeded)
- Notifications (12 seeded)
- AI Mentor chatbot (rule-based, no API key needed)
- APAAR ID-based student profiles

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
