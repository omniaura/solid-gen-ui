# Getting Started

This guide walks you through installing SolidGenUI and rendering your first AI-generated component.

## Prerequisites

- Node.js >= 22.14.0
- pnpm >= 10.0.0
- A SolidJS project (SolidJS >= 1.8)

## Installation

Install the core packages plus one schema adapter and one AI adapter:

```bash
# Minimal setup with Zod schemas
pnpm add @solid-gen-ui/core @solid-gen-ui/solid @solid-gen-ui/schema-zod
```

### Peer Dependencies

| Package | Peer Dependency |
|---------|----------------|
| `@solid-gen-ui/solid` | `solid-js ^1.8.0` |
| `@solid-gen-ui/schema-zod` | `zod ^3.22.0` |

## Basic Setup

### 1. Define a Component Schema

Use Zod to describe the props your component accepts. The AI model reads these schemas to decide which component to render and what props to pass.

```typescript
import { z } from 'zod'
import { zodSchema } from '@solid-gen-ui/schema-zod'

const taskCardSchema = zodSchema(
  z.object({
    title: z.string().describe('Task title'),
    priority: z.enum(['low', 'medium', 'high']).describe('Priority level'),
  })
)
```

### 2. Create a SolidJS Component

```tsx
function TaskCard(props: { title: string; priority: 'low' | 'medium' | 'high' }) {
  return (
    <div class={`task-card priority-${props.priority}`}>
      <h3>{props.title}</h3>
      <span>{props.priority}</span>
    </div>
  )
}
```

### 3. Initialize the Core

```typescript
import { GenerativeUICore } from '@solid-gen-ui/core'

const core = new GenerativeUICore({ debug: false })

// Set your AI adapter (see docs/adapters/ for options)
core.setAdapter(myAdapter)

// Register the component
core.registerComponent({
  name: 'TaskCard',
  description: 'Display a task card with a title and priority level',
  schema: taskCardSchema,
  component: TaskCard,
})
```

### 4. Wire Up the Provider and Hook

```tsx
import { GenUIProvider, useGenUI } from '@solid-gen-ui/solid'
import { For } from 'solid-js'

function App() {
  return (
    <GenUIProvider core={core}>
      <Chat />
    </GenUIProvider>
  )
}

function Chat() {
  const { components, send, isStreaming, error } = useGenUI()

  return (
    <div>
      <For each={components()}>
        {(comp) => {
          const Component = comp.component
          return <Component {...comp.props} />
        }}
      </For>

      <button onClick={() => send('Create a high priority task')} disabled={isStreaming()}>
        Send
      </button>

      {error() && <p class="error">{error()!.message}</p>}
    </div>
  )
}
```

### 5. Run Your App

```bash
pnpm dev
```

Click "Send" and the AI will stream a `TaskCard` component with the props it chose based on your prompt.

## Next Steps

- [API Reference](./api/) - Full documentation for every export
- [Adapters](./adapters/) - Connect to different AI providers
- [Codegen](./codegen.md) - Generate type-safe Go backend code
