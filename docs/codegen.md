# Go Code Generation

SolidGenUI includes a code generation tool that produces type-safe Go structs and handlers from your TypeScript component schemas.

> **Status:** The codegen package (`@solid-gen-ui/codegen`) is planned but not yet implemented. This document describes the intended design.

## Overview

The codegen tool reads your registered component schemas (Zod or Effect Schema) and generates Go source files with:

- Struct definitions matching your component props
- JSON marshaling/unmarshaling
- Handler interfaces for serving components from a Go backend

## Planned Usage

```bash
# Install the codegen package
pnpm add -D @solid-gen-ui/codegen

# Generate Go code from your component schemas
solid-gen-ui codegen \
  --schema src/components/ \
  --output backend/internal/genui/ \
  --lang go
```

### Options

| Flag | Description |
|------|-------------|
| `--schema <path>` | Directory containing component schema files |
| `--output <path>` | Output directory for generated Go code |
| `--lang go` | Target language (currently only Go is planned) |

## How It Works

1. The CLI scans `--schema` for files that register components with `core.registerComponent()`
2. Each component's Zod schema is converted to JSON Schema
3. JSON Schema is translated to Go structs with appropriate field types and tags
4. Handler boilerplate is generated for serving components over HTTP or WebSocket

## Example Output

Given this TypeScript component:

```typescript
const taskCardSchema = zodSchema(
  z.object({
    title: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().optional(),
  })
)

core.registerComponent({
  name: 'TaskCard',
  description: 'Display a task card',
  schema: taskCardSchema,
  component: TaskCard,
})
```

The codegen would produce:

```go
package genui

// TaskCardProps represents the props for the TaskCard component.
type TaskCardProps struct {
    Title    string  `json:"title"`
    Priority string  `json:"priority"` // "low" | "medium" | "high"
    DueDate  *string `json:"dueDate,omitempty"`
}
```

## Related

- [API Reference](./api/) - Core types used by codegen
- [Schema Zod](./api/schema-zod.md) - Writing schemas that codegen reads
