# @solid-gen-ui/solid

SolidJS integration for SolidGenUI. Provides a context provider and reactive hooks.

## Installation

```bash
pnpm add @solid-gen-ui/solid
```

**Peer dependency:** `solid-js ^1.8.0`

## Components

### `GenUIProvider`

Context provider that makes a `GenerativeUICore` instance available to child components.

```tsx
import { GenUIProvider } from '@solid-gen-ui/solid'

<GenUIProvider core={core}>
  <App />
</GenUIProvider>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `core` | `GenerativeUICore` | Core engine instance (required) |
| `children` | `JSX.Element` | Child components |

---

## Hooks

### `useGenUICore`

Access the raw `GenerativeUICore` instance from context.

```typescript
import { useGenUICore } from '@solid-gen-ui/solid'

function MyComponent() {
  const core = useGenUICore()
  console.log(core.getComponents())
}
```

Throws an error if called outside a `GenUIProvider`.

---

### `useGenUI`

Main hook for building chat-style interfaces. Manages message history, streams AI responses, and collects rendered components.

```typescript
import { useGenUI } from '@solid-gen-ui/solid'

function Chat() {
  const { messages, components, text, isStreaming, error, send, clear } = useGenUI({
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
  })

  return (
    <div>
      <For each={components()}>
        {(comp) => {
          const Component = comp.component
          return <Component {...comp.props} />
        }}
      </For>

      <button onClick={() => send('Hello')} disabled={isStreaming()}>
        Send
      </button>
    </div>
  )
}
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `model` | `string` | Model identifier (passed to the AI adapter) |
| `temperature` | `number` | Sampling temperature (0–1) |
| `maxTokens` | `number` | Maximum output tokens |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `messages` | `Accessor<Message[]>` | Full conversation history |
| `components` | `Accessor<ComponentInstance[]>` | All rendered component instances |
| `text` | `Accessor<string>` | Current streamed text content |
| `isStreaming` | `Accessor<boolean>` | Whether a stream is in progress |
| `error` | `Accessor<Error \| null>` | Last error, if any |
| `send` | `(content: string) => Promise<void>` | Send a user message and stream the response |
| `clear` | `() => void` | Reset conversation state |

---

### `useGenUIStream`

Lower-level hook for one-off generation requests. Does not manage message history — you provide messages directly.

```typescript
import { useGenUIStream } from '@solid-gen-ui/solid'

function Generator() {
  const { stream, components, text, isStreaming, error } = useGenUIStream()

  const handleGenerate = () => {
    stream([{ role: 'user', content: 'Create a dashboard widget' }])
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={isStreaming()}>
        Generate
      </button>

      <For each={components()}>
        {(comp) => {
          const Component = comp.component
          return <Component {...comp.props} />
        }}
      </For>
    </div>
  )
}
```

#### Options

Same as `useGenUI`.

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `stream` | `(messages: Message[]) => Promise<void>` | Send messages and stream the response |
| `components` | `Accessor<ComponentInstance[]>` | Rendered component instances |
| `text` | `Accessor<string>` | Current streamed text |
| `isStreaming` | `Accessor<boolean>` | Whether a stream is in progress |
| `error` | `Accessor<Error \| null>` | Last error, if any |
