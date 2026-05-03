# @solid-gen-ui/core

Framework-agnostic engine for generative UI. Manages component registration, schema validation, and AI streaming.

## Installation

```bash
pnpm add @solid-gen-ui/core
```

## Classes

### `GenerativeUICore`

Main entry point. Registers components, connects to an AI adapter, and streams UI updates.

```typescript
import { GenerativeUICore } from '@solid-gen-ui/core'

const core = new GenerativeUICore({
  debug: false,
  onError: (err) => console.error(err),
})
```

#### Constructor

```typescript
new GenerativeUICore(config?: CoreConfig)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `adapter` | `AIAdapter` | — | Default AI adapter |
| `onError` | `(error: Error) => void` | — | Global error handler |
| `debug` | `boolean` | `false` | Enable debug logging |

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `registerComponent` | `<T>(component: GenerativeComponent<T>): void` | Register a component for AI rendering |
| `unregisterComponent` | `(name: string): boolean` | Remove a registered component |
| `setAdapter` | `(adapter: AIAdapter): void` | Set the AI adapter |
| `stream` | `(messages: Message[], options?): AsyncGenerator<UIUpdate>` | Stream UI updates from the AI |
| `getComponents` | `(): GenerativeComponent[]` | List all registered components |
| `hasComponent` | `(name: string): boolean` | Check if a component is registered |
| `clear` | `(): void` | Remove all registered components |

#### `stream` Options

| Option | Type | Description |
|--------|------|-------------|
| `model` | `string` | Model identifier (adapter-specific) |
| `temperature` | `number` | Sampling temperature (0–1) |
| `maxTokens` | `number` | Maximum output tokens |

---

### `ComponentRegistry`

Lower-level map-based store used internally by `GenerativeUICore`. You can also use it directly.

```typescript
import { ComponentRegistry } from '@solid-gen-ui/core'

const registry = new ComponentRegistry()
registry.register(myComponent)
```

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `<T>(component: GenerativeComponent<T>): void` | Add a component |
| `unregister` | `(name: string): boolean` | Remove a component |
| `get` | `(name: string): GenerativeComponent \| undefined` | Look up a component |
| `getAll` | `(): GenerativeComponent[]` | List all components |
| `getToolDefinitions` | `(): ToolDefinition[]` | Generate OpenAI-format tool definitions |
| `has` | `(name: string): boolean` | Check existence |
| `clear` | `(): void` | Remove all |
| `size` | `number` (getter) | Number of registered components |

---

## Types

### Component Types

```typescript
interface GenerativeComponent<TProps = any> {
  name: string                    // Tool name presented to the AI
  description?: string            // AI-readable description of the component
  schema: SchemaAdapter<TProps>   // Prop validation and JSON Schema generation
  component: Component<TProps>    // The actual render function
}

type Component<TProps = any> = (props: TProps) => any

interface ComponentInstance<TProps = any> {
  id: string                      // Unique instance ID
  name: string                    // Component name
  component: Component<TProps>    // Render function
  props: TProps                   // Validated props
}
```

### Schema Types

```typescript
interface SchemaAdapter<T = any> {
  validate(data: unknown): T                                        // Validate and parse input
  toJSON(): Record<string, any>                                     // Convert to JSON Schema
  toToolDefinition(name: string, description?: string): ToolDefinition  // Generate tool definition
}
```

### AI Adapter Types

```typescript
interface AIAdapter {
  streamCompletion(params: StreamParams): AsyncGenerator<StreamDelta>
  executeTools?(tools: ToolDefinition[]): Promise<ToolResult[]>
}

interface StreamParams {
  messages: Message[]
  tools: ToolDefinition[]
  model?: string
  temperature?: number
  maxTokens?: number
  [key: string]: any              // Adapter-specific parameters
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ToolCall[]
  toolResults?: ToolResult[]
}

interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, any>   // JSON Schema
  }
}

interface ToolCall {
  id: string
  name: string
  arguments: string               // JSON-encoded arguments
}

interface ToolResult {
  id: string
  result: any
  error?: string
}
```

### Streaming Types

```typescript
type StreamDelta = TextDelta | ToolCallDelta | ToolResultDelta | ErrorDelta

interface TextDelta     { type: 'text';        content: string }
interface ToolCallDelta { type: 'tool-call';   toolCall: ToolCall }
interface ToolResultDelta { type: 'tool-result'; toolResult: ToolResult }
interface ErrorDelta    { type: 'error';       error: Error }
```

### UI Update Types

```typescript
type UIUpdate = ComponentUpdate | TextUpdate | ErrorUpdate

interface ComponentUpdate<TProps = any> {
  type: 'component'
  name: string
  component: Component<TProps>
  props: TProps
}

interface TextUpdate {
  type: 'text'
  content: string
}

interface ErrorUpdate {
  type: 'error'
  error: Error
}
```
