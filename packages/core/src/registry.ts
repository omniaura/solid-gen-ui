/**
 * Component registry for managing generative components
 */

import type {
  GenerativeComponent,
  RegistryEntry,
  ToolDefinition,
} from './types'

/**
 * Registry for generative components
 *
 * Manages component registration and lookup, converting schemas to tool definitions.
 */
export class ComponentRegistry {
  private components = new Map<string, RegistryEntry>()

  /**
   * Register a generative component
   */
  register<TProps>(component: GenerativeComponent<TProps>): void {
    const toolDefinition = component.schema.toToolDefinition(
      component.name,
      component.description
    )

    this.components.set(component.name, {
      component,
      toolDefinition,
    })
  }

  /**
   * Unregister a component by name
   */
  unregister(name: string): boolean {
    return this.components.delete(name)
  }

  /**
   * Get a component by name
   */
  get(name: string): GenerativeComponent | undefined {
    return this.components.get(name)?.component
  }

  /**
   * Get all registered components
   */
  getAll(): GenerativeComponent[] {
    return Array.from(this.components.values()).map((entry) => entry.component)
  }

  /**
   * Get all tool definitions (for AI adapter)
   */
  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.components.values()).map(
      (entry) => entry.toolDefinition
    )
  }

  /**
   * Check if a component is registered
   */
  has(name: string): boolean {
    return this.components.has(name)
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.components.clear()
  }

  /**
   * Get number of registered components
   */
  get size(): number {
    return this.components.size
  }
}
