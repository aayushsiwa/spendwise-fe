# SpendWise

A self-hostable personal finance platform built around one principle: **your financial data should stay with you.** SpendWise tracks income, expenses, transfers, budgets, savings goals, and analytics from a deployment you control — no vendor-owned database, no lock-in.

This repository (`spendwise-fe`) is the **Next.js + Material UI dashboard** — the primary entry point users interact with. It talks to a separate backend API and, optionally, an MCP server for AI-assisted workflows.

| Component | Repository | Role |
|---|---|---|
| **Frontend** (this repo) | [`spendwise-fe`](https://github.com/aayushsiwa/spendwise-fe) | Web dashboard (Next.js + MUI) |
| **Backend** | [`spendwise-be`](https://github.com/aayushsiwa/spendwise-be) | Go + Gin REST API and database |
| **MCP server** | [`spendwise-mcp`](https://github.com/aayushsiwa/spendwise-mcp) | Exposes SpendWise tools to AI assistants |

## How it fits together

```text
Browser
  ↓
spendwise-fe  ──→  spendwise-be  ──→  SQLite / Postgres / MySQL
                        ↑
AI assistant ──→  spendwise-mcp
```

The backend API is mounted under `/api/v1`. The frontend reaches it via two environment variables (see below), and the MCP server is a thin adapter over the same API.

## Features

**Transactions**
Track every financial movement as a record of type `income`, `expense`, or `transfer`. The records screen is an editable MUI X Data Grid with pagination, text search, and filters by date range, category, and type. Rows are color-coded by transaction type (income / expense / transfer) and amounts follow sign conventions — expenses shown negative/red, income and transfers positive.

**Categories**
Organize records with categories that carry a custom name, icon, and color. Categories power filtering, charts, and budget assignment, and keep analytics meaningful.

**Budgets**
Set a spend limit per category for a given month and year. The dashboard shows budget progress as cards and a radar chart, surfacing how much is spent versus budgeted and warning as limits are approached.

**Savings goals**
Define savings targets with a goal amount, optional current amount, target date, and status (active / achieved / abandoned). Contribute toward goals over time and watch progress update.

**Summaries**
A monthly snapshot of income, expenses, net flow, and opening/closing balance — the at-a-glance view of where your money stands for any period.

**Analytics**
Go deeper with trend line charts, top-spending category breakdowns, a spending heatmap, and month-over-month comparisons. Money is formatted in `en-IN` / `INR` to match the rest of the app.

**Import & export**
Bring existing data in via CSV or JSON import (CSV import tolerates varied column names), and export your records to CSV at any time so your data stays portable and never locked in.

**Theming**
Switch between light, dark, and system modes; the entire UI adapts through the shared MUI theme tokens.

**AI integration**
Pairs with the [`spendwise-mcp`](https://github.com/aayushsiwa/spendwise-mcp) server so AI assistants can query records, manage categories/budgets/goals, and read summaries through your own backend — no third-party data sharing.

## Tech stack

- **Framework:** Next.js (Pages Router) 16, React 19, TypeScript.
- **UI:** Material UI v9, MUI X Data Grid, MUI X Charts, Emotion.
- **Data:** TanStack Query (React Query) for server-state, Axios for HTTP.
- **Tooling:** ESLint, Prettier (with import sorting), Husky + commitlint, Vitest.

## Getting started

### Prerequisites

- A running [`spendwise-be`](https://github.com/aayushsiwa/spendwise-be) instance (default `http://localhost:8090/api/v1`).
- Node.js + pnpm.

### Install and run

```sh
cp .env.example .env
# Set API_URL and NEXT_PUBLIC_API_URL to your backend /api/v1 base URL
pnpm install
pnpm dev
```

The dev server runs on **port 5173** with Turbopack.

### Environment variables

| Variable | Example | Purpose |
|---|---|---|
| `API_URL` | `http://localhost:8090/api/v1` | Backend base for Next.js rewrites and browser-opened `/api/*` links (e.g. CSV export). |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8090/api/v1` | Axios base URL used by the data hooks. |
| `ENVIRONMENT` | `local` \| `production` | Controls runtime behavior/feature flags. |

Both API URLs must target the backend's `/api/v1` base path.

### Useful scripts

| Command | What |
|---|---|
| `pnpm dev` | Dev server (port 5173, Turbopack). |
| `pnpm build` | Production build. |
| `pnpm start` | Start the production build. |
| `pnpm lint` | ESLint. |
| `pnpm type-check` | `tsc --noEmit`. |
| `pnpm format` / `pnpm format:check` | Prettier write / check. |
| `pnpm test` | Vitest. |
| `pnpm run-checks` | Lint + type-check + format-check + test. |

## Project structure

- `pages/` — thin route wrappers (each page renders a container inside `BaseLayout`).
- `lib/containers/` — screen-level containers (Transactions, Analytics, Budgets, Categories, UploadCSV, Home).
- `lib/components/` — reusable UI (Records table, charts, budget progress, sidebar, theme toggle, etc.).
- `lib/hooks/` — React Query hooks.
- `api/` — typed Axios client and per-domain request functions.
- `theme/` — MUI theme (light/dark/system).

## Code quality

- Husky pre-push runs `pnpm lint`, `pnpm format:check`, then `pnpm type-check`.
- Commits follow the conventional-commit spec via commitlint.
- Prettier uses `@trivago/prettier-plugin-sort-imports` (third-party, then `@/`, then relative).

## Related repositories

- Backend API & database: <https://github.com/aayushsiwa/spendwise-be>
- MCP server for AI assistants: <https://github.com/aayushsiwa/spendwise-mcp>

> **Privacy note:** SpendWise is intended to be deployed by you. This frontend only talks to the backend URL you configure; the backend reads and writes solely to the database you configure. If you expose any component publicly, you are responsible for authentication, network access, TLS, backups, and hardening.
