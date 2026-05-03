# @solid-gen-ui/schema-zod

Zod schema adapter for SolidGenUI. Validates component props and generates JSON Schema for AI tool definitions.

## Installation

```bash
pnpm add @solid-gen-ui/schema-zod
```

**Peer dependency:** `zod ^3.22.0`

## Exports

### `zodSchema`

Factory function that wraps a Zod schema into a `SchemaAdapter`.

```typescript
import { zodSchema } from '@solid-gen-ui/schema-zod'
import { z } from 'zod'

const schema = zodSchema(
  z.object({
    title: z.string().describe('Card title'),
    count: z.number().int().min(0).describe('Item count'),
  })
)

core.registerComponent({
  name: 'StatsCard',
  description: 'Display a statistics card',
  schema,
  component: StatsCard,
})
```

#### Signature

```typescript
function zodSchema<T>(schema: ZodType<T>): SchemaAdapter<T>
```

---

### `ZodSchemaAdapter`

Class that implements the `SchemaAdapter` interface using Zod. Created automatically by `zodSchema()`, but you can instantiate it directly.

```typescript
import { ZodSchemaAdapter } from '@solid-gen-ui/schema-zod'
import { z } from 'zod'

const adapter = new ZodSchemaAdapter(z.object({ name: z.string() }))
```

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `validate` | `(data: unknown): T` | Parse and validate data. Throws `ZodError` on failure. |
| `toJSON` | `(): Record<string, any>` | Convert to JSON Schema (uses `zod-to-json-schema`) |
| `toToolDefinition` | `(name: string, description?: string): ToolDefinition` | Generate an OpenAI-format tool definition |

---

### `z` (re-export)

The `zod` `z` object is re-exported for convenience:

```typescript
import { z } from '@solid-gen-ui/schema-zod'

const mySchema = z.object({ /* ... */ })
```

## Writing Good Schemas

Use `.describe()` on each field so the AI model understands what to provide:

```typescript
const weatherSchema = zodSchema(
  z.object({
    location: z.string().describe('City name'),
    temperature: z.number().describe('Temperature in Celsius'),
    condition: z.enum(['sunny', 'cloudy', 'rainy', 'snowy']).describe('Current weather condition'),
  })
)
```

Descriptions become part of the JSON Schema sent to the AI model as tool parameters.
