# CarbonKeeper Architecture

## Overview

CarbonKeeper is a Next.js 16 application that helps individuals track, understand, and reduce their carbon footprint through natural language input and AI-powered insights.

## Directory Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # API endpoints (parse, recommend, insight, chat)
│   ├── dashboard/          # Dashboard pages (main, settings, logs, insights, assistant)
│   └── methodology/        # Methodology documentation page
├── components/             # React UI components
│   ├── chat/               # Chat interface components
│   ├── charts/             # Data visualization (CategoryChart, BudgetMeter)
│   ├── dashboard/          # Dashboard-specific components (EmptyDashboard, SavingsBanner)
│   ├── landing/            # Landing page components (PillarCard)
│   ├── layout/             # Layout components (PageHeader)
│   ├── methodology/        # Methodology page components
│   └── ui/                 # Shared UI primitives (ProgressBar, sonner)
├── lib/                    # Core business logic and utilities
│   ├── agents/             # AI agent integrations (Gemini, fallback parser)
│   ├── api/                # API route factory and helpers
│   ├── constants/          # Application constants (cache, challenges, rate-limiter, storage)
│   ├── data/               # Static data (emission factors)
│   ├── hooks/              # Custom React hooks (useChat, useLogActivity, useSettingsForm)
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Business logic services (activity, chat, feedback)
│   ├── stores/             # Zustand state stores (activity, settings, ai)
│   └── utils/              # Utility functions (activity-context)
└── proxy.ts                # Rate limiting middleware
```

## Key Architectural Decisions

### State Management
- **Zustand** for client-side state (activity-store, settings-store, ai-store)
- Stores are domain-specific and decoupled via `budget-utils.ts`
- No circular dependencies between stores

### API Layer
- **Route Factory Pattern** (`lib/api/route-factory.ts`) for consistent API route handling
- Zod validation on all endpoints
- Automatic caching via `AICache`
- Custom error handlers per route

### AI Integration
- **Google Gemini** via `@google/genai` SDK
- Keyword-based fallback parser when API unavailable
- Server-side AI calls (API key never reaches browser)

### Data Flow
```
User Input → Parse API → Calculator → Activity Store → Dashboard UI
                    ↓
              AI Agents → Recommendations/Insights → AI Store
```

### Component Architecture
- **Container/Presentational** pattern
- Components use Zustand hooks for state
- Lazy initialization for side effects
- No business logic in UI components

### Validation
- **Zod schemas** in `lib/schemas/` for all data structures
- Schema-per-domain (activity, parse, recommend, insight, chat)

## Testing

- **Jest** with React Testing Library
- 20 test suites, 159 tests
- Tests co-located in `lib/__tests__/`
- Accessibility tests with `jest-axe`

## Security

- Content-Security-Policy headers
- Rate limiting (30 req/min per IP)
- Server-side AI calls
- Input validation via Zod

## Performance

- Lazy initialization for cache and rate limiter
- No module-level side effects
- Tree-shaking via barrel exports
- Static page generation where possible
