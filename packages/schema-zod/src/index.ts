/**
 * @solid-gen-ui/schema-zod
 *
 * Zod schema adapter for SolidGenUI.
 */

import type { SchemaAdapter, ToolDefinition } from '@solid-gen-ui/core'
import { z, type ZodType } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

/**
 * Zod schema adapter
 *
 * Converts Zod schemas to JSON Schema and validates data.
 */
export class ZodSchemaAdapter<T> implements SchemaAdapter<T> {
  constructor(private schema: ZodType<T>) {}

  /**
   * Validate and parse data according to schema
   *
   * @throws ZodError if validation fails
   */
  validate(data: unknown): T {
    return this.schema.parse(data)
  }

  /**
   * Convert to JSON Schema
   */
  toJSON(): Record<string, any> {
    return zodToJsonSchema(this.schema) as Record<string, any>
  }

  /**
   * Convert to AI tool definition (OpenAI format)
   */
  toToolDefinition(name: string, description?: string): ToolDefinition {
    const jsonSchema = this.toJSON()

    // Extract root schema (zodToJsonSchema wraps in $ref)
    const parameters =
      '$ref' in jsonSchema && jsonSchema.definitions
        ? jsonSchema.definitions[
            jsonSchema.$ref.replace('#/definitions/', '')
          ]
        : jsonSchema

    return {
      type: 'function',
      function: {
        name,
        description: description || `Render ${name} component`,
        parameters: parameters as Record<string, any>,
      },
    }
  }
}

/**
 * Create a Zod schema adapter
 *
 * @example
 * ```ts
 * import { zodSchema } from '@solid-gen-ui/schema-zod'
 * import { z } from 'zod'
 *
 * const taskCardSchema = zodSchema(z.object({
 *   title: z.string().describe("Task title"),
 *   priority: z.enum(['low', 'medium', 'high'])
 * }))
 *
 * core.registerComponent({
 *   name: 'TaskCard',
 *   schema: taskCardSchema,
 *   component: TaskCard
 * })
 * ```
 */
export function zodSchema<T>(schema: ZodType<T>): SchemaAdapter<T> {
  return new ZodSchemaAdapter(schema)
}

// Re-export Zod for convenience
export { z }
