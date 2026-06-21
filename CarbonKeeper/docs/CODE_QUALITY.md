# Code Quality Engineering

CarbonKeeper is structured for maintainability, modularity, and consistency — the criteria measured independently from Testing, Security, and Accessibility in PromptWars evaluation.

## Quality Signals

| Practice | Implementation | Location |
| --- | --- | --- |
| Layered architecture | Strict UI → hook → service → API → agent separation | `docs/ARCHITECTURE.md` |
| Schema-driven types | Domain types derived from Zod via `z.infer` | `lib/schemas/`, `lib/types.ts` |
| Dependency injection | Services accept deps; hooks wire stores | `lib/services/activity-service.ts`, `lib/hooks/useLogActivity.ts` |
| DRY components | Shared `PageHeader`, `RecommendationItem`, `BudgetMeter`, `ProgressBar`, `EmptyDashboard`, `SavingsBanner` | `components/` |
| Service layer parity | `chat-service.ts` mirrors `activity-service.ts` pattern | `lib/services/` |
| Validated persistence | `getActivities()` and `loadSampleData` use Zod | `lib/storage.ts`, `activity-store.ts` |
| Shared formatters | Activity context strings centralized | `lib/utils/activity-context.ts` |
| Schema-complete types | `Challenge` and `ChatMessage` typed consistently | `lib/schemas/challenge.ts`, `lib/types.ts` |
| Persistence abstraction | Single storage module for all `localStorage` | `lib/storage.ts` |
| API consistency | Factory pattern for all AI routes | `lib/api/route-factory.ts` |
| Agent consistency | Shared safe Gemini wrappers | `lib/agents/client.ts` |
| Pure functions | Emissions, compute, calculator have no side effects | `lib/compute.ts`, `lib/emissions.ts` |
| No dead code | Unused exports removed; no `any` or `eslint-disable` | Entire codebase |
| CI pipeline | lint + typecheck + test + build on every push | `.github/workflows/ci.yml` |
| Contributor docs | Conventions and layer rules documented | `CONTRIBUTING.md` |

## Static Analysis

```bash
npm run lint       # ESLint — zero warnings
npm run typecheck  # TypeScript strict — zero errors
npm run test       # 153 tests across 18 suites
npm run build      # Production build passes
```

## Complexity Controls

- Largest page components decomposed into child components
- Store logic delegates to `budget-utils` and `compute` modules
- Test mocks centralized in `lib/test-utils/mock-stores.ts`
- Prompt templates isolated in `lib/agents/prompts/`
