# CarbonKeeper Architecture

This document describes the layered architecture enforced across the codebase.

## Layer Model

```
┌─────────────────────────────────────────────────────────┐
│  app/ + components/          UI Layer (React)           │
│  lib/hooks/                  Composition hooks          │
├─────────────────────────────────────────────────────────┤
│  lib/stores/                 Client state (Zustand)     │
│  lib/storage.ts              Browser persistence        │
├─────────────────────────────────────────────────────────┤
│  lib/services/               Pure orchestration (no UI) │
├─────────────────────────────────────────────────────────┤
│  app/api/ + lib/api/         HTTP boundary + validation │
├─────────────────────────────────────────────────────────┤
│  lib/agents/                 AI + business logic        │
│  lib/compute.ts              Pure functions             │
│  lib/emissions.ts            Deterministic calculations │
├─────────────────────────────────────────────────────────┤
│  lib/schemas/                Zod schemas (type source)  │
│  lib/types.ts                z.infer domain types       │
└─────────────────────────────────────────────────────────┘
```

## Dependency Rules

| Layer | May import | Must not import |
| --- | --- | --- |
| Components | hooks, stores, services (via hooks) | agents directly |
| Hooks | stores, services | — |
| Services | agents, types, schemas | Zustand stores |
| API routes | agents, schemas, route-factory | React, stores |
| Agents | client, schemas, emissions | React, stores |
| Stores | storage, compute, types | components |

## Key Patterns

- **Type source of truth**: `lib/schemas/*.ts` → `lib/types.ts` via `z.infer`
- **API factory**: All AI endpoints use `createAIRoute` for Zod validation, caching, and fallbacks
- **AI client**: All agents call `generateContentSafe` (JSON) or `generateTextSafe` (plain text)
- **Persistence**: All `localStorage` access flows through `lib/storage.ts`
- **Activity logging**: `ActivityLog` → `useLogActivity` → `logActivityWithDeps` (dependency injection)

## Module Boundaries

| Module | Responsibility |
| --- | --- |
| `lib/agents/orchestrator.ts` | NLP parsing via Gemini |
| `lib/agents/fallback-parser.ts` | Keyword fallback when AI unavailable |
| `lib/agents/calculator.ts` | Emission math (pure) |
| `lib/services/activity-service.ts` | Client-side parse + build + AI feedback |
| `lib/stores/activity-store.ts` | Activity list, footprint, trends |
| `proxy.ts` | Rate limiting (Next.js 16 proxy convention) |
