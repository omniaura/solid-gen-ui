# API Reference

SolidGenUI is split into independent packages. Install only what you need.

## Packages

| Package | Description |
|---------|-------------|
| [`@solid-gen-ui/core`](./core.md) | Framework-agnostic engine: component registry, streaming, types |
| [`@solid-gen-ui/solid`](./solid.md) | SolidJS integration: provider, hooks |
| [`@solid-gen-ui/schema-zod`](./schema-zod.md) | Zod schema adapter for prop validation |

## Architecture

```
┌─────────────────────────────────────┐
│           Your SolidJS App          │
│  ┌───────────────────────────────┐  │
│  │  GenUIProvider + useGenUI()   │  │  @solid-gen-ui/solid
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────▼────────────────┐  │
│  │      GenerativeUICore         │  │  @solid-gen-ui/core
│  │  ┌──────────┐ ┌────────────┐  │  │
│  │  │ Registry │ │   Engine   │  │  │
│  │  └──────────┘ └─────┬──────┘  │  │
│  └──────────────────────┼────────┘  │
│                         │            │
│  ┌──────────────────────▼────────┐  │
│  │    SchemaAdapter (Zod, ...)   │  │  @solid-gen-ui/schema-zod
│  └──────────────────────┬────────┘  │
│                         │            │
│  ┌──────────────────────▼────────┐  │
│  │     AIAdapter (pluggable)     │  │  Your adapter implementation
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

The core package is framework-agnostic. The `solid` package adds SolidJS reactivity on top. Schema and AI adapters are pluggable — swap them without changing application code.
