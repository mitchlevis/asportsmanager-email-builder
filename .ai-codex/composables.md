# composables.md — Stores & Composables

All composables in `app/composables/`. All are Pinia stores using the setup syntax (`defineStore` with composition API). Auto-imported by Nuxt.

---

## `useAuth` — store id `'auth'`

**File:** `app/composables/useAuth.ts`

Authentication state for API key access. Persists key in `localStorage` under `asm_api_key`.

### State

| Ref | Type | Description |
|-----|------|-------------|
| `apiKey` | `string \| null` | Current API key (raw value sent as `Authorization` header) |
| `isAuthenticated` | `boolean` | Whether the user has a validated key |
| `isValidating` | `boolean` | Loading state during validation calls |
| `error` | `string \| null` | Error message from last failed login attempt |
| `sessionRestored` | `boolean` | Whether `tryRestoreSession` has already run (prevents duplicate calls) |

### Methods

| Method | Description |
|--------|-------------|
| `login(key)` | Validates key via `GET /validate-api-key`, stores in localStorage on success, sets `isAuthenticated` |
| `logout()` | Clears key from state + localStorage, navigates to `/login` |
| `tryRestoreSession()` | Reads key from localStorage, validates it, auto-authenticates if valid or clears stale key |

---

## `useEmailEditor` — store id `'emailEditor'`

**File:** `app/composables/useEmailEditor.ts`

Core email builder state — document tree, selection, UI toggles, API-backed template management.

### State

| Ref | Type | Description |
|-----|------|-------------|
| `document` | `TEditorDocument` | The full block tree (`Record<string, TEditorBlock>`) |
| `selectedBlockId` | `string \| null` | Currently selected block ID (for inspector) |
| `selectedSidebarTab` | `SidebarTab` | `'block-configuration'` or `'styles'` |
| `selectedMainTab` | `MainTab` | `'editor'`, `'preview'`, `'json'`, `'html'`, or `'plaintext'` |
| `selectedScreenSize` | `ScreenSize` | `'desktop'` or `'mobile'` |
| `inspectorDrawerOpen` | `boolean` | Right drawer visibility |
| `samplesDrawerOpen` | `boolean` | Left drawer visibility |
| `templateId` | `number \| null` | API template ID when editing an existing template |
| `isNewTemplate` | `boolean` | True when on `/editor/new` |
| `selectedLanguage` | `'en' \| 'fr'` | Active language for bilingual templates |
| `apiRecord` | `object \| null` | Full API record for the current template |
| `originalSnapshot` | `string` | JSON snapshot for dirty checking |
| `saving` | `boolean` | Whether a save operation is in progress |
| `repeaterPreviewData` | `Record<string, unknown[]>` | Ephemeral preview data for Repeater blocks (keyed by block ID) |
| `plainText` | `string` | Plain text content for PlainTextEn/PlainTextFr |
| `originalPlainTextSnapshot` | `string` | Snapshot for plain text dirty checking |

### Computed

| Computed | Description |
|----------|-------------|
| `isApiMode` | True when `templateId` is set or `isNewTemplate` is true |
| `isDirty` | True when document or plain text differs from original snapshot |
| `canCopyFromEnglish` | True when in API mode, French selected, current doc empty, and English doc has content |

### Methods

| Method | Description |
|--------|-------------|
| `setSelectedBlockId(id)` | Selects a block, opens inspector, switches sidebar to block-configuration |
| `setDocument(partial)` | Merges partial update into document |
| `toggleInspectorDrawer()` | Toggle right drawer |
| `toggleSamplesDrawer()` | Toggle left drawer |
| `loadTemplate(json)` | Replaces entire document, resets selection |
| `resetDocument()` | Loads a minimal empty EmailLayout, clears repeater/plain text state |
| `getTemplateJson()` | Returns raw document snapshot |
| `getTemplateHtml()` | Renders document to email HTML string |
| `onDocumentChange(cb)` | Registers a deep watcher on the document |
| `initNewTemplate()` | Resets store for a blank new template |
| `loadFromApi(record)` | Loads an API record into the editor, parses JSON/plain text for selected language |
| `switchLanguage(lang)` | Persists current language data, switches to new language |
| `saveTemplate()` | PUTs current state to API, updates snapshots |
| `createTemplate(name, desc)` | POSTs a new template to API, returns new ID |
| `deleteTemplate()` | DELETEs the current template from API |
| `copyFromEnglish()` | Deep-clones English JSON content and loads it into the French editor |

---

## `useEmailTemplates` — store id `'emailTemplates'`

**File:** `app/composables/useEmailTemplates.ts`

Manages the sidebar template list with pagination and infinite scrolling.

### State

| Ref | Type | Description |
|-----|------|-------------|
| `templates` | `Array<{ Id, Name, Description }>` | Loaded template list |
| `totalCount` | `number` | Total templates from `x-total-count` header |
| `loading` | `boolean` | Initial load in progress |
| `loadingMore` | `boolean` | Infinite scroll load in progress |

### Computed

| Computed | Description |
|----------|-------------|
| `hasMore` | Whether more templates can be fetched |

### Methods

| Method | Description |
|--------|-------------|
| `fetchTemplates()` | Fetches first page of templates (limit 100) |
| `fetchMoreTemplates()` | Fetches next page, appends to list |
