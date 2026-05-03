# Contributing to SolidGenUI

Thanks for your interest in contributing! This guide covers the development workflow.

## Prerequisites

- Node.js >= 22.14.0
- pnpm >= 10.0.0

## Setup

```bash
git clone https://github.com/omniaura/solid-gen-ui.git
cd solid-gen-ui
pnpm install
```

## Development

```bash
# Build all packages (respects dependency order)
pnpm run build

# Watch mode
pnpm run dev

# Type-check all packages
pnpm run typecheck

# Run tests
pnpm run test

# Lint
pnpm run lint
```

## Project Structure

```
solid-gen-ui/
  packages/
    core/          # Framework-agnostic engine
    solid/         # SolidJS integration (provider + hooks)
    schema-zod/    # Zod schema adapter
  docs/            # Documentation
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

| Prefix | Version Bump | Example |
|--------|-------------|---------|
| `feat:` | Minor | `feat: add streaming timeout option` |
| `fix:` | Patch | `fix: handle empty tool call arguments` |
| `perf:` | Patch | `perf: reduce registry lookup overhead` |
| `feat!:` or `BREAKING CHANGE:` | Major | `feat!: redesign adapter interface` |
| `docs:` | No release | `docs: update getting-started guide` |
| `chore:` | No release | `chore: update dev dependencies` |

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Ensure `pnpm run typecheck` and `pnpm run build` pass
4. Run `pnpm run test` if the package has tests
5. Write a clear PR description explaining what changed and why
6. Open a PR against `main`

## Adding a New Package

1. Create a directory under `packages/`
2. Add a `package.json` with the `@solid-gen-ui/` scope
3. Add a `tsconfig.json` extending the root config
4. Add a `tsup.config.ts` for building
5. The package will be picked up automatically by pnpm workspaces and Turbo

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
