# Adapters

Adapters connect SolidGenUI to AI providers. Each adapter implements the `AIAdapter` interface from `@solid-gen-ui/core`.

## Available Adapters

| Adapter | Package | Status |
|---------|---------|--------|
| Claude Agent SDK | `@solid-gen-ui/adapter-claude` | Planned |
| TanStack AI | `@solid-gen-ui/adapter-tanstack` | Planned |
| Vercel AI SDK | `@solid-gen-ui/adapter-vercel` | Planned |
| Opencode SDK | `@solid-gen-ui/adapter-opencode` | Planned |

## Writing a Custom Adapter

Any object that implements `AIAdapter` works with SolidGenUI:

```typescript
import type { AIAdapter, StreamParams, StreamDelta } from '@solid-gen-ui/core'

const myAdapter: AIAdapter = {
  async *streamCompletion(params: StreamParams): AsyncGenerator<StreamDelta> {
    // 1. Convert params.tools to your provider's tool format
    // 2. Send params.messages to your AI provider
    // 3. Yield StreamDelta objects as the response streams in

    // Example: yield a tool call delta
    yield {
      type: 'tool-call',
      toolCall: {
        id: 'call_123',
        name: 'TaskCard',
        arguments: JSON.stringify({ title: 'My Task', priority: 'high' }),
      },
    }

    // Example: yield text
    yield {
      type: 'text',
      content: 'Here is your task card.',
    }
  },
}
```

### Delta Types

Your adapter should yield these delta types:

| Type | When |
|------|------|
| `TextDelta` | The AI sends text content |
| `ToolCallDelta` | The AI calls a registered component |
| `ToolResultDelta` | A tool execution returns a result |
| `ErrorDelta` | An error occurs during streaming |

### Using Your Adapter

```typescript
import { GenerativeUICore } from '@solid-gen-ui/core'

const core = new GenerativeUICore()
core.setAdapter(myAdapter)
```

See the [core API reference](../api/core.md) for full type definitions.
