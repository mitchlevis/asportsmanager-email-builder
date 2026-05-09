# utils.md — Utilities & Helpers

## API (`app/utils/api.ts`)

| Export | Description |
|--------|-------------|
| `apiFetch(path, options)` | Authenticated `$fetch` wrapper. Reads `apiBaseUrl` from runtime config, attaches `Authorization` header from auth store. On 401 response, calls `auth.logout()` to bounce user to login. |
| `apiFetchRaw(path, options)` | Same as `apiFetch` but returns the full `ofetch` response object (including headers like `x-total-count`). |

## Email Builder (`app/utils/email-builder/`)

### Schemas (`schemas.ts`)

Zod schemas, inferred TypeScript types, and default values for every block type's props.

| Export pattern | Block types covered |
|----------------|-------------------|
| `*PropsSchema` | Avatar, Button, Container, ColumnsContainer, Divider, Heading, Html, Image, Repeater, Spacer, Text, EmailLayout |
| `*Props` (type) | Inferred from each schema |
| `*PropsDefaults` | Default values for each block type |

### Style Schemas (`style-schemas.ts`)

| Export | Description |
|--------|-------------|
| `COLOR_SCHEMA` | Zod schema for color strings |
| `PADDING_SCHEMA` | Zod object `{ top, bottom, left, right }` |
| `Padding` (type) | Inferred padding type |
| `getPadding(padding)` | Returns CSS padding string from a `Padding` object |

### Font Families (`font-families.ts`)

| Export | Description |
|--------|-------------|
| `FONT_FAMILY_SCHEMA` | Zod enum for supported font family keys |
| `FontFamily` (type) | Inferred font family type |
| `getFontFamily(key)` | Returns CSS `font-family` stack for a font key |

### Block Defaults (`block-defaults.ts`)

| Export | Description |
|--------|-------------|
| `getDefaultBlock(type)` | Returns a new block instance with default props for the given `BlockType` |
| `generateBlockId()` | Returns a unique block ID (`block-{timestamp}`) |

### Render to HTML (`render-to-html.ts`)

| Export | Description |
|--------|-------------|
| `renderToHtml(document, { rootBlockId })` | Converts a `TEditorDocument` into an email-safe HTML string. Uses `marked` for Markdown text blocks. Mirrors the block tree structure recursively. Repeater blocks emit `{{#each}}...{{/each}}` loop syntax with `{{@isOdd}}` for alternating backgrounds. |

### Sample Templates (`sample-templates.ts`)

| Export | Description |
|--------|-------------|
| `EMPTY_EMAIL_MESSAGE` | Minimal empty template |
| `WELCOME_EMAIL` | Sample welcome email template |
| `OTP_EMAIL` | Sample OTP email template |
| `RESET_PASSWORD_EMAIL` | Sample password reset email template |
| `SAMPLE_TEMPLATES` | Array of all samples (used by SamplesDrawer) |

### Slash Commands (`slash-commands.ts`)

| Export | Description |
|--------|-------------|
| `SlashCommand` (interface) | Shape for a slash command: `id`, `label`, `description`, `icon`, `insert()` |
| `slashCommands` | Array of available commands (currently: `loop` — inserts `{{#each}}` block) |

## Types (`app/types/email-builder.ts`)

| Export | Description |
|--------|-------------|
| `BlockType` | Union of all supported block type strings (includes `'Repeater'`) |
| `TEditorBlock` | `{ type: BlockType, data: Record<string, any> }` |
| `TEditorDocument` | `Record<string, TEditorBlock>` — the full block tree |
| `BlockDefinition` | `{ schema, component }` |
| `BlockDictionary` | `Record<BlockType, BlockDefinition>` |
