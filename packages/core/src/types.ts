/**
 * Core types for SolidGenUI
 *
 * Framework-agnostic type definitions for generative UI components,
 * schemas, AI adapters, and streaming interfaces.
 */

// ============================================================================
// Component Types
// ============================================================================

/**
 * A generative component that can be rendered by an AI agent
 */
export interface GenerativeComponent<TProps = any> {
  /** Unique name for the component (used as tool name) */
  name: string

  /** Human-readable description for the AI agent */
  description?: string

  /** Schema adapter for prop validation */
  schema: SchemaAdapter<TProps>

  /** The actual component to render */
  component: Component<TProps>
}

/**
 * Generic component type (framework-agnostic)
 */
export type Component<TProps = any> = (props: TProps) => any

/**
 * Instance of a rendered component with props
 */
export interface ComponentInstance<TProps = any> {
  /** Unique identifier for this instance */
  id: string

  /** Component name */
  name: string

  /** Component function/class */
  component: Component<TProps>

  /** Props for this instance */
  props: TProps
}

// ============================================================================
// Schema Types
// ============================================================================

/**
 * Adapter interface for schema validation libraries (Zod, Effect Schema, etc.)
 */
export interface SchemaAdapter<T = any> {
  /** Validate and parse data according to schema */
  validate(data: unknown): T

  /** Convert schema to JSON Schema format */
  toJSON(): Record<string, any>

  /** Convert schema to AI tool definition */
  toToolDefinition(name: string, description?: string): ToolDefinition
}

// ============================================================================
// AI Adapter Types
// ============================================================================

/**
 * AI adapter interface for different AI SDKs
 */
export interface AIAdapter {
  /** Stream completion with tool calling */
  streamCompletion(params: StreamParams): AsyncGenerator<StreamDelta>

  /** Optional: Execute tools directly (for some SDKs) */
  executeTools?(tools: ToolDefinition[]): Promise<ToolResult[]>
}

/**
 * Parameters for streaming completion
 */
export interface StreamParams {
  /** Conversation messages */
  messages: Message[]

  /** Available tools (generative components) */
  tools: ToolDefinition[]

  /** Model to use (optional, adapter-specific default) */
  model?: string

  /** Temperature (0-1) */
  temperature?: number

  /** Max tokens to generate */
  maxTokens?: number

  /** Additional adapter-specific parameters */
  [key: string]: any
}

/**
 * Chat message
 */
export interface Message {
  /** Message role */
  role: 'user' | 'assistant' | 'system'

  /** Message content */
  content: string

  /** Optional tool calls (for assistant messages) */
  toolCalls?: ToolCall[]

  /** Optional tool results (for tool messages) */
  toolResults?: ToolResult[]
}

/**
 * Tool definition (OpenAI format)
 */
export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, any> // JSON Schema
  }
}

/**
 * Tool call from AI
 */
export interface ToolCall {
  id: string
  name: string
  arguments: string // JSON string
}

/**
 * Tool execution result
 */
export interface ToolResult {
  id: string
  result: any
  error?: string
}

/**
 * Streaming delta from AI
 */
export type StreamDelta =
  | TextDelta
  | ToolCallDelta
  | ToolResultDelta
  | ErrorDelta

export interface TextDelta {
  type: 'text'
  content: string
}

export interface ToolCallDelta {
  type: 'tool-call'
  toolCall: ToolCall
}

export interface ToolResultDelta {
  type: 'tool-result'
  toolResult: ToolResult
}

export interface ErrorDelta {
  type: 'error'
  error: Error
}

// ============================================================================
// UI Update Types
// ============================================================================

/**
 * UI update event (emitted during streaming)
 */
export type UIUpdate =
  | ComponentUpdate
  | TextUpdate
  | ErrorUpdate

export interface ComponentUpdate<TProps = any> {
  type: 'component'
  name: string
  component: Component<TProps>
  props: TProps
}

export interface TextUpdate {
  type: 'text'
  content: string
}

export interface ErrorUpdate {
  type: 'error'
  error: Error
}

// ============================================================================
// Registry Types
// ============================================================================

/**
 * Component registry entry
 */
export interface RegistryEntry<TProps = any> {
  component: GenerativeComponent<TProps>
  toolDefinition: ToolDefinition
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Core engine configuration
 */
export interface CoreConfig {
  /** Default adapter to use */
  adapter?: AIAdapter

  /** Error handler */
  onError?: (error: Error) => void

  /** Enable debug logging */
  debug?: boolean
}
