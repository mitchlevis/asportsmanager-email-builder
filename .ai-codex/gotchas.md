# gotchas.md — Known Pitfalls & Traps

Things that have bitten us. Read this before making changes.

---

## `nuxt dev` does not load wrangler environment variables

When running `nuxt dev` (the standard dev command), wrangler.jsonc `vars` are **not** injected as environment variables. The `NUXT_PUBLIC_*` vars only take effect when deploying via `wrangler deploy` or running `wrangler dev`.

For local development, the `.env` file provides the variables. If `NUXT_PUBLIC_API_BASE_URL` is missing, `$fetch` calls treat API paths as relative to the Nuxt dev server, causing Vue Router "No match found" warnings instead of hitting the REST API.

**Fix:** Ensure `.env` exists with `NUXT_PUBLIC_API_BASE_URL=http://localhost:8787` (or use `.env.example` as reference).

---

## API key is sent as raw `Authorization` header — no `Bearer` prefix

The REST API's `authenticate` function reads `request.headers.get('authorization')` and looks up the raw value directly in the `RestApiKey` table. Do **not** prepend `Bearer ` or any other scheme prefix.

```ts
// CORRECT
headers: { Authorization: apiKey }

// WRONG — will fail authentication
headers: { Authorization: `Bearer ${apiKey}` }
```

---

## The login page uses `layout: false`

`app/pages/login.vue` sets `definePageMeta({ layout: false })` and wraps itself in its own `<v-app>`. This is intentional — the login page must render independently of the email builder shell.

If you add a default layout in the future, ensure the login page still opts out.

---

## `ClientOnly` on the index page

The main email builder page (`app/pages/index.vue`) wraps everything in `<ClientOnly>` because the editor relies on browser APIs and Vuetify components that don't SSR cleanly. Any new pages that use the email editor store or builder components should do the same.

---

## Vuetify is registered via plugin, not Nuxt module

Vuetify is set up in `app/plugins/vuetify.ts` with manual imports of all components/directives. There is no `@nuxt/vuetify` module. If you need to add Vuetify configuration (custom themes, defaults, etc.), edit the plugin file, not `nuxt.config.ts`.

---

## Pinia stores live under `composables/`, not `stores/`

Both `useAuth` and `useEmailEditor` are Pinia stores (`defineStore`) but are placed in `app/composables/` rather than a separate `app/stores/` directory. This is a deliberate convention — Nuxt auto-imports from `composables/`, so the stores are available everywhere without explicit imports.

---

## Deployment is Cloudflare Workers via Nitro

The Nitro preset is `cloudflare_module`. The build output goes to `.output/server/index.mjs` (worker) and `.output/public/` (static assets). Deployment uses `npx wrangler deploy` (not global `wrangler`) with environment-specific configs in `wrangler.jsonc`.

Available environments: `development`, `preview`, `preview-bender`, `production`. Each has its own `NUXT_PUBLIC_API_BASE_URL` pointing to the corresponding REST API instance.

**Important:** Do not add `nitro.cloudflare.deployConfig: true` to `nuxt.config.ts` — it generates a redirect config that inherits `env` blocks, which Wrangler rejects.

---

## SSR guard for template fetching

The `watch(isEditorRoute, ...)` in `app/layouts/default.vue` calls `fetchTemplates()` which relies on `localStorage` (via the auth store). This watcher must be guarded with `if (!import.meta.client) return` to prevent `localStorage is not defined` errors during SSR.

---

## API JSON fields may be strings or objects

`JsonEn`/`JsonFr` fields from the API may arrive as raw JSON strings or already-parsed objects. The `parseJsonField()` helper in `useEmailEditor.ts` handles both cases and also validates the parsed result has a `root` key — an empty object `{}` is treated as null (empty template).

---

## Repeater preview data is ephemeral

`store.repeaterPreviewData` is a `Record<string, unknown[]>` keyed by block ID. It is cleared on `resetDocument()` and `loadFromApi()`. It is not persisted to the API — it only affects the Preview tab.

---

## Repeater HTML output uses Handlebars-style syntax

Repeater blocks emit `{{#each variableName}}...{{/each}}` and `{{@isOdd 'x' 'y'}}` in HTML output. These are resolved by the backend at send time, not by the frontend. See `REPEATER_LOOP_SPEC.md` for the full spec.
