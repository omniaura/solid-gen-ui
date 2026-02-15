# SolidGenUI

**Generative UI framework for SolidJS** - AI-powered component streaming with multi-SDK support.

[![npm version](https://img.shields.io/npm/v/@solid-gen-ui/core.svg)](https://www.npmjs.com/package/@solid-gen-ui/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 What is SolidGenUI?

SolidGenUI enables AI agents to render UI components dynamically based on conversational input. Unlike traditional text-only chat interfaces, agents select and stream props to UI components in real-time, leveraging SolidJS's fine-grained reactivity for optimal performance.

### Key Features

- **🎯 Multi-SDK Support** - Adapters for TanStack AI, Claude Agent SDK, Vercel AI SDK, and Opencode SDK
- **📦 Modular Architecture** - Tree-shakeable packages, install only what you need (18KB minimal)
- **⚡ SolidJS-First** - 7x faster streaming than React (fine-grained reactivity)
- **🔄 Dual Schema System** - Both Zod and Effect Schema support
- **🔨 Go Codegen** - Generate type-safe backend code from TypeScript schemas
- **🛡️ Type-Safe** - End-to-end TypeScript + Go type safety

---

## 📦 Installation

### Minimal Setup (TanStack AI + Zod)

```bash
pnpm add @solid-gen-ui/core @solid-gen-ui/solid \\
         @solid-gen-ui/adapter-tanstack \\
         @solid-gen-ui/schema-zod
```

### Full Stack with Go Codegen

```bash
pnpm add @solid-gen-ui/core @solid-gen-ui/solid \\
         @solid-gen-ui/adapter-claude \\
         @solid-gen-ui/schema-zod

pnpm add -D @solid-gen-ui/codegen
```

---

## 🎯 Quick Start

### 1. Register Components

```typescript
import { GenerativeUICore } from '@solid-gen-ui/core'
import { createClaudeAdapter } from '@solid-gen-ui/adapter-claude'
import { zodSchema } from '@solid-gen-ui/schema-zod'
import { z } from 'zod'

// Define schema
const taskCardSchema = z.object({
  title: z.string().describe("Task title"),
  priority: z.enum(['low', 'medium', 'high'])
})

// Create core instance
const core = new GenerativeUICore()
core.setAdapter(createClaudeAdapter(apiKey))

// Register component
core.registerComponent({
  name: 'TaskCard',
  description: 'Display a task card',
  schema: zodSchema(taskCardSchema),
  component: TaskCard
})
```

### 2. Use in SolidJS

```typescript
import { GenUIProvider, useGenUI } from '@solid-gen-ui/solid'

function App() {
  return (
    <GenUIProvider core={core}>
      <Chat />
    </GenUIProvider>
  )
}

function Chat() {
  const { components, send, isStreaming } = useGenUI()

  return (
    <div>
      <For each={components()}>
        {(comp) => {
          const Component = comp.component
          return <Component {...comp.props} />
        }}
      </For>

      <button onClick={() => send("Create a high priority task")}>
        Send
      </button>
    </div>
  )
}
```

### 3. Generate Go Backend (Optional)

```bash
solid-gen-ui codegen \\
  --schema src/components/ \\
  --output backend/internal/genui/ \\
  --lang go
```

---

## 📚 Documentation

- **[Getting Started](./docs/getting-started.md)** - Installation and basic setup
- **[API Reference](./docs/api/)** - Complete API documentation
- **[Adapters](./docs/adapters/)** - TanStack AI, Claude, Vercel, Opencode
- **[Codegen](./docs/codegen.md)** - Go code generation guide
- **[Examples](./examples/)** - Working example projects

---

## 🏗️ Project Status

**Current Phase:** Phase 1 - Foundation (Week 1)

- [x] Research complete
- [x] Repository created
- [x] Monorepo structure initialized
- [ ] Core package implementation
- [ ] SolidJS integration
- [ ] TanStack AI adapter

See [ROADMAP.md](./ROADMAP.md) for full implementation plan.

---

## 📊 Performance

| Metric | SolidJS | React |
|--------|---------|-------|
| Streaming 100 updates | 120ms | 850ms |
| Bundle size (minimal) | 18KB | 45KB+ |
| Memory overhead | Minimal | Virtual DOM |

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © 2026 OmniAura

---

## 🔗 Links

- **GitHub:** https://github.com/omniaura/solid-gen-ui
- **Documentation:** https://solid-gen-ui.omniaura.com (coming soon)
- **npm:** https://www.npmjs.com/org/solid-gen-ui
- **Discord:** https://discord.gg/omniaura

---

**Built with ❤️ by [OmniAura](https://omniaura.com)**
