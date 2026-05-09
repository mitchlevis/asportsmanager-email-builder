# pages.md — Nuxt Pages & Routing

CSR-heavy Nuxt 4 app. All pages under `app/pages/`. Auth enforced by global middleware `app/middleware/auth.global.ts` — unauthenticated users are redirected to `/login`.

## Pages

| Route | File | Layout | Auth | Description |
|-------|------|--------|------|-------------|
| `/` | `index.vue` | default | required | Main email builder — samples drawer, inspector drawer, template panel with editor/preview/JSON/HTML tabs. Loads `WELCOME_EMAIL` sample on first visit. |
| `/editor` | `editor/index.vue` | default | required | Landing page when no template is selected. Shows prompt to open or create a template from the sidebar. Clears editor store state. |
| `/editor/new` | `editor/new.vue` | default | required | Blank editor for creating a new template. Calls `store.initNewTemplate()`. On save, POSTs to API and redirects to `/editor/:id`. |
| `/editor/:id` | `editor/[id].vue` | default | required | Dynamic route for editing an existing API-backed template. Fetches full template data from `GET /rest/email-templates/:id`, loads into editor. Handles loading/error states. |
| `/login` | `login.vue` | none (`layout: false`) | public | API key login page — single password-style input, validates via `GET /validate-api-key`, stores key in localStorage, redirects to `/` on success. |
