# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Socratic AI Frontend is an educational question generation platform built with Next.js 15. It provides three main features:
- **PDF Workspace**: Upload PDFs or text to generate MCQ/open-ended questions
- **Similarity Generator**: Generate variations of existing questions
- **Interactive Studio**: Canvas-like split panel for AI-powered question refinement

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type checking
```

### Docker Deployment

```bash
docker build -t socratic-frontend --build-arg NEXT_PUBLIC_API_URL=https://your-domain/api/v1 .
docker run -d -p 3000:3000 socratic-frontend
```

## Architecture

### Tech Stack
- Next.js 15 with App Router (standalone output mode)
- React 19 with TypeScript
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- Zustand for state management
- TanStack React Query for data fetching
- next-themes for dark/light mode
- Custom i18n system (English/Turkish)

### Directory Structure

```
src/
├── app/                 # Next.js App Router (single page SPA pattern)
├── components/
│   ├── layout/          # AppShell, Header, Sidebar
│   ├── shared/          # QuestionCard, EmptyState, LoadingSpinner
│   └── ui/              # shadcn/ui components
├── features/            # Feature-based modules
│   ├── pdf-workspace/   # PDF upload, text input, question generation
│   ├── similarity/      # Similar question generation
│   └── studio/          # Interactive refinement with resizable panels
├── lib/
│   ├── api-client.ts    # Typed API client singleton
│   └── i18n/            # Localization context and translations
├── stores/              # Zustand stores (question, studio, ui)
└── types/               # TypeScript types matching backend API
```

### State Management Pattern

Three Zustand stores manage application state:
- `useQuestionStore`: Questions, sessions, persistence to localStorage
- `useStudioStore`: Interactive refinement session state
- `useUIStore`: View mode, sidebar, panel sizes

The `question-store` uses Zustand persist middleware with `onRehydrateStorage` to handle SSR hydration.

### API Integration

Backend API base URL configured via `NEXT_PUBLIC_API_URL`. Four endpoints:
- `POST /generate/from-text` - Generate questions from text
- `POST /generate/from-pdf` - Generate questions from PDF (multipart/form-data)
- `POST /similar/generate` - Generate similar question variations
- `POST /refine/refine` - Refine question through conversation

### Feature Module Pattern

Each feature follows this structure:
```
feature-name/
├── components/          # Feature-specific components
├── hooks/               # Data fetching hooks using React Query
├── index.ts             # Public exports
└── feature-name-view.tsx  # Main view component
```

### Localization

Custom i18n system in `src/lib/i18n/`:
- `translations.ts`: EN/TR translation objects
- `context.tsx`: React context with `useI18n()` and `useTranslation()` hooks
- Hydration-safe with localStorage persistence

### UI Components

All UI components in `src/components/ui/` follow shadcn/ui patterns:
- Built on Radix UI primitives
- Styled with Tailwind + class-variance-authority
- Use `cn()` utility from `src/lib/utils.ts` for class merging

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1  # Backend API URL (embedded at build time)
```

## Key Patterns

- View switching handled by `useUIStore.viewMode` in single-page app pattern
- All feature views render inside `AppShell` (sidebar + header layout)
- Interactive Studio uses `react-resizable-panels` for split panel UI
- PDF uploads use `react-dropzone` with multipart/form-data submission
- Toast notifications via `sonner`
