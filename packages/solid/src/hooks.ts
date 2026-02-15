/**
 * SolidJS hooks for generative UI
 */

import { createSignal, Accessor } from 'solid-js'
import type {
  Message,
  ComponentInstance,
  UIUpdate,
} from '@solid-gen-ui/core'
import { useGenUICore } from './context'

/**
 * Return type for useGenUI hook
 */
export interface UseGenUIReturn {
  /** All messages in the conversation */
  messages: Accessor<Message[]>

  /** All rendered component instances */
  components: Accessor<ComponentInstance[]>

  /** Current text being streamed (assistant message) */
  text: Accessor<string>

  /** Whether currently streaming */
  isStreaming: Accessor<boolean>

  /** Last error (if any) */
  error: Accessor<Error | null>

  /** Send a user message */
  send: (content: string) => Promise<void>

  /** Clear conversation */
  clear: () => void
}

/**
 * Main hook for generative UI
 *
 * Manages conversation state and streaming UI updates.
 *
 * @example
 * ```tsx
 * function Chat() {
 *   const { messages, components, send, isStreaming } = useGenUI()
 *
 *   return (
 *     <div>
 *       <For each={components()}>
 *         {(comp) => {
 *           const Component = comp.component
 *           return <Component {...comp.props} />
 *         }}
 *       </For>
 *
 *       <button
 *         onClick={() => send("Hello")}
 *         disabled={isStreaming()}
 *       >
 *         Send
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useGenUI(options: {
  /** Model to use (optional) */
  model?: string
  /** Temperature (0-1) */
  temperature?: number
  /** Max tokens */
  maxTokens?: number
} = {}): UseGenUIReturn {
  const core = useGenUICore()

  const [messages, setMessages] = createSignal<Message[]>([])
  const [components, setComponents] = createSignal<ComponentInstance[]>([])
  const [text, setText] = createSignal('')
  const [isStreaming, setIsStreaming] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)

  const send = async (content: string) => {
    const userMsg: Message = { role: 'user', content }

    setMessages((prev) => [...prev, userMsg])
    setIsStreaming(true)
    setError(null)
    setText('')

    try {
      const newMessages = [...messages(), userMsg]

      for await (const update of core.stream(newMessages, options)) {
        processUpdate(update)
      }

      // Add assistant message with accumulated text
      const assistantText = text()
      if (assistantText) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: assistantText },
        ])
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
    } finally {
      setIsStreaming(false)
      setText('')
    }
  }

  const processUpdate = (update: UIUpdate) => {
    switch (update.type) {
      case 'component':
        setComponents((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: update.name,
            component: update.component,
            props: update.props,
          },
        ])
        break

      case 'text':
        setText((prev) => prev + update.content)
        break

      case 'error':
        setError(update.error)
        break
    }
  }

  const clear = () => {
    setMessages([])
    setComponents([])
    setText('')
    setError(null)
  }

  return {
    messages,
    components,
    text,
    isStreaming,
    error,
    send,
    clear,
  }
}

/**
 * Hook for streaming a single message
 *
 * Lower-level hook that streams a single AI response without managing
 * conversation state. Useful for one-off generations.
 *
 * @example
 * ```tsx
 * function Generator() {
 *   const { stream, isStreaming, result } = useGenUIStream()
 *
 *   return (
 *     <button onClick={() => stream([{ role: 'user', content: 'Hello' }])}>
 *       Generate
 *     </button>
 *   )
 * }
 * ```
 */
export function useGenUIStream(options: {
  model?: string
  temperature?: number
  maxTokens?: number
} = {}) {
  const core = useGenUICore()

  const [components, setComponents] = createSignal<ComponentInstance[]>([])
  const [text, setText] = createSignal('')
  const [isStreaming, setIsStreaming] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)

  const stream = async (messages: Message[]) => {
    setComponents([])
    setText('')
    setIsStreaming(true)
    setError(null)

    try {
      for await (const update of core.stream(messages, options)) {
        switch (update.type) {
          case 'component':
            setComponents((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                name: update.name,
                component: update.component,
                props: update.props,
              },
            ])
            break

          case 'text':
            setText((prev) => prev + update.content)
            break

          case 'error':
            setError(update.error)
            break
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
    } finally {
      setIsStreaming(false)
    }
  }

  return {
    stream,
    components,
    text,
    isStreaming,
    error,
  }
}
