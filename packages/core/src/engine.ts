/**
 * Core generative UI engine
 */

import { ComponentRegistry } from './registry'
import type {
  GenerativeComponent,
  AIAdapter,
  Message,
  UIUpdate,
  CoreConfig,
  StreamDelta,
} from './types'

/**
 * Core engine for generative UI
 *
 * Framework-agnostic engine that:
 * - Manages component registration
 * - Streams AI completions
 * - Validates props via schemas
 * - Emits UI updates
 */
export class GenerativeUICore {
  private registry: ComponentRegistry
  private adapter?: AIAdapter
  private config: CoreConfig

  constructor(config: CoreConfig = {}) {
    this.registry = new ComponentRegistry()
    this.adapter = config.adapter
    this.config = config
  }

  /**
   * Register a generative component
   */
  registerComponent<TProps>(component: GenerativeComponent<TProps>): void {
    if (this.config.debug) {
      console.log(`[SolidGenUI] Registering component: ${component.name}`)
    }

    this.registry.register(component)
  }

  /**
   * Unregister a component
   */
  unregisterComponent(name: string): boolean {
    if (this.config.debug) {
      console.log(`[SolidGenUI] Unregistering component: ${name}`)
    }

    return this.registry.unregister(name)
  }

  /**
   * Set the AI adapter
   */
  setAdapter(adapter: AIAdapter): void {
    if (this.config.debug) {
      console.log('[SolidGenUI] Setting AI adapter')
    }

    this.adapter = adapter
  }

  /**
   * Stream UI updates from AI
   *
   * Yields UI updates as the AI generates tool calls and text.
   */
  async *stream(
    messages: Message[],
    options: {
      model?: string
      temperature?: number
      maxTokens?: number
    } = {}
  ): AsyncGenerator<UIUpdate> {
    if (!this.adapter) {
      throw new Error('No AI adapter configured')
    }

    if (this.registry.size === 0) {
      throw new Error('No components registered')
    }

    const tools = this.registry.getToolDefinitions()

    if (this.config.debug) {
      console.log('[SolidGenUI] Starting stream with tools:', tools.map(t => t.function.name))
    }

    try {
      for await (const delta of this.adapter.streamCompletion({
        messages,
        tools,
        ...options,
      })) {
        yield* this.processDelta(delta)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      if (this.config.onError) {
        this.config.onError(err)
      }

      yield {
        type: 'error',
        error: err,
      }
    }
  }

  /**
   * Process a single streaming delta
   */
  private async *processDelta(delta: StreamDelta): AsyncGenerator<UIUpdate> {
    switch (delta.type) {
      case 'text':
        yield {
          type: 'text',
          content: delta.content,
        }
        break

      case 'tool-call': {
        const component = this.registry.get(delta.toolCall.name)

        if (!component) {
          if (this.config.debug) {
            console.warn(
              `[SolidGenUI] Unknown component: ${delta.toolCall.name}`
            )
          }
          break
        }

        try {
          // Parse and validate props
          const rawProps = JSON.parse(delta.toolCall.arguments)
          const validatedProps = component.schema.validate(rawProps)

          if (this.config.debug) {
            console.log(
              `[SolidGenUI] Rendering component: ${component.name}`,
              validatedProps
            )
          }

          yield {
            type: 'component',
            name: component.name,
            component: component.component,
            props: validatedProps,
          }
        } catch (error) {
          const err =
            error instanceof Error ? error : new Error(String(error))

          if (this.config.onError) {
            this.config.onError(err)
          }

          yield {
            type: 'error',
            error: err,
          }
        }
        break
      }

      case 'error':
        if (this.config.onError) {
          this.config.onError(delta.error)
        }

        yield {
          type: 'error',
          error: delta.error,
        }
        break

      // tool-result deltas are informational, don't yield UI updates
      case 'tool-result':
        break
    }
  }

  /**
   * Get all registered components
   */
  getComponents(): GenerativeComponent[] {
    return this.registry.getAll()
  }

  /**
   * Check if a component is registered
   */
  hasComponent(name: string): boolean {
    return this.registry.has(name)
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.registry.clear()
  }
}
