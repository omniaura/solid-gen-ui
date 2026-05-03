# Roadmap

Current status and planned development phases for SolidGenUI.

## Phase 1 — Foundation (Complete)

- [x] Monorepo structure (Turbo + pnpm workspaces)
- [x] `@solid-gen-ui/core` — component registry, streaming engine, type system
- [x] `@solid-gen-ui/solid` — GenUIProvider, useGenUI, useGenUIStream hooks
- [x] `@solid-gen-ui/schema-zod` — Zod schema adapter with JSON Schema generation
- [x] TypeScript strict mode across all packages
- [x] Dual ESM/CJS builds via tsup
- [x] CI pipeline (GitHub Actions)
- [x] Automated releases (semantic-release + npm OIDC provenance)

## Phase 2 — AI Adapters

- [ ] `@solid-gen-ui/adapter-tanstack` — TanStack AI adapter
- [ ] `@solid-gen-ui/adapter-claude` — Claude Agent SDK adapter
- [ ] `@solid-gen-ui/adapter-vercel` — Vercel AI SDK adapter
- [ ] `@solid-gen-ui/adapter-opencode` — Opencode SDK adapter

## Phase 3 — Extended Schema Support

- [ ] `@solid-gen-ui/schema-effect` — Effect Schema adapter

## Phase 4 — Codegen

- [ ] `@solid-gen-ui/codegen` — CLI for generating Go backend code from component schemas

## Phase 5 — Examples & Ecosystem

- [ ] Example applications (chat UI, dashboard builder)
- [ ] Documentation website
- [ ] Performance benchmarks
