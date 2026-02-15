/**
 * @solid-gen-ui/core
 *
 * Framework-agnostic core for generative UI with SolidJS.
 */

export { GenerativeUICore } from './engine'
export { ComponentRegistry } from './registry'
export type {
  // Component types
  GenerativeComponent,
  Component,
  ComponentInstance,
  // Schema types
  SchemaAdapter,
  // AI adapter types
  AIAdapter,
  StreamParams,
  Message,
  ToolDefinition,
  ToolCall,
  ToolResult,
  StreamDelta,
  TextDelta,
  ToolCallDelta,
  ToolResultDelta,
  ErrorDelta,
  // UI update types
  UIUpdate,
  ComponentUpdate,
  TextUpdate,
  ErrorUpdate,
  // Registry types
  RegistryEntry,
  // Config types
  CoreConfig,
} from './types'
