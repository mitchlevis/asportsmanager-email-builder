# components.md — Vue Components

All components in `app/components/email-builder/`. Auto-imported by Nuxt.

## Block Renderers (`blocks/`)

Presentational components for each email block type. Used by both the editor canvas and the read-only preview.

| Component | File | Purpose |
|-----------|------|---------|
| AvatarBlock | `blocks/AvatarBlock.vue` | Avatar image with shape, size, alt text |
| ButtonBlock | `blocks/ButtonBlock.vue` | CTA button with link, colors, pill/rounded, width, size |
| ColumnsContainerBlock | `blocks/ColumnsContainerBlock.vue` | Multi-column layout slotting children per column |
| ContainerBlock | `blocks/ContainerBlock.vue` | Single container with children slot, padding/border styles |
| DividerBlock | `blocks/DividerBlock.vue` | Horizontal rule with configurable color/height |
| EmailLayoutBlock | `blocks/EmailLayoutBlock.vue` | Outer email chrome: backdrop, centered table, root typography |
| HeadingBlock | `blocks/HeadingBlock.vue` | Heading level + text with layout styles |
| HtmlBlock | `blocks/HtmlBlock.vue` | Raw HTML content region |
| ImageBlock | `blocks/ImageBlock.vue` | Image with URL, dimensions, alignment, optional link |
| RepeaterBlock | `blocks/RepeaterBlock.vue` | Loop container that repeats children per array item. Supports alternating background color via `itemIndex` prop. |
| SpacerBlock | `blocks/SpacerBlock.vue` | Vertical spacing by height |
| TextBlock | `blocks/TextBlock.vue` | Plain text or Markdown (via `marked`) with typography styles |

## Editor Components (`editor/`)

Interactive editing wrappers and menus used in the editor tab.

| Component | File | Purpose |
|-----------|------|---------|
| EditorBlock | `editor/EditorBlock.vue` | Switches on block type, renders appropriate editor variant or leaf block in wrapper |
| EditorBlockWrapper | `editor/EditorBlockWrapper.vue` | Selection outline, click-to-select, hosts TuneMenu for selected block |
| EditorChildrenIds | `editor/EditorChildrenIds.vue` | Renders child block list with AddBlockMenu gaps between items |
| AddBlockMenu | `editor/AddBlockMenu.vue` | Dropdown to pick block type, emits `getDefaultBlock(type)` |
| TuneMenu | `editor/TuneMenu.vue` | Floating toolbar: reorder, duplicate, delete |

## Editor Block Variants (`editor/blocks/`)

Layout blocks with editing capabilities (embed `EditorChildrenIds` for child management).

| Component | File | Purpose |
|-----------|------|---------|
| EmailLayoutEditor | `editor/blocks/EmailLayoutEditor.vue` | Root layout chrome + child management |
| ContainerEditor | `editor/blocks/ContainerEditor.vue` | Container + child management |
| ColumnsContainerEditor | `editor/blocks/ColumnsContainerEditor.vue` | Columns UI + per-column child management |
| RepeaterEditor | `editor/blocks/RepeaterEditor.vue` | Repeater + child management, shows data variable badge |

## Inspector (`inspector/`)

Right-side panel for editing block properties and styles.

| Component | File | Purpose |
|-----------|------|---------|
| ConfigurationPanel | `inspector/ConfigurationPanel.vue` | "Inspect" tab: picks sidebar panel by selected block type |
| StylesPanel | `inspector/StylesPanel.vue` | "Styles" tab: edits root block via EmailLayoutSidebarPanel |

## Inspector Inputs (`inspector/inputs/`)

Reusable form controls used by sidebar panels. Barrel-exported from `inspector/inputs/index.ts`.

| Component | File | Purpose |
|-----------|------|---------|
| TextInput | `inspector/inputs/TextInput.vue` | Text field |
| ColorInput | `inspector/inputs/ColorInput.vue` | Color picker / hex input |
| NumberInput | `inspector/inputs/NumberInput.vue` | Numeric field |
| BooleanInput | `inspector/inputs/BooleanInput.vue` | Toggle/checkbox |
| RadioGroupInput | `inspector/inputs/RadioGroupInput.vue` | Radio group for enums |
| SliderInput | `inspector/inputs/SliderInput.vue` | Slider for numeric ranges |
| PaddingInput | `inspector/inputs/PaddingInput.vue` | Four-sided padding editor |
| FontFamilyInput | `inspector/inputs/FontFamilyInput.vue` | Font preset selector |

## Inspector Panels (`inspector/panels/`)

Per-block-type property editors shown in the ConfigurationPanel.

| Component | File | Purpose |
|-----------|------|---------|
| EmailLayoutSidebarPanel | `inspector/panels/EmailLayoutSidebarPanel.vue` | Root layout: backdrop, canvas, text color, font |
| AvatarSidebarPanel | `inspector/panels/AvatarSidebarPanel.vue` | Avatar props/styles |
| ButtonSidebarPanel | `inspector/panels/ButtonSidebarPanel.vue` | Button text, URL, colors, shape, size |
| ColumnsContainerSidebarPanel | `inspector/panels/ColumnsContainerSidebarPanel.vue` | Column count, gap, alignment |
| ContainerSidebarPanel | `inspector/panels/ContainerSidebarPanel.vue` | Container styles |
| DividerSidebarPanel | `inspector/panels/DividerSidebarPanel.vue` | Divider styling |
| HeadingSidebarPanel | `inspector/panels/HeadingSidebarPanel.vue` | Heading level + text + styles |
| HtmlSidebarPanel | `inspector/panels/HtmlSidebarPanel.vue` | HTML source string |
| ImageSidebarPanel | `inspector/panels/ImageSidebarPanel.vue` | Image URL, alt, dimensions, link |
| SpacerSidebarPanel | `inspector/panels/SpacerSidebarPanel.vue` | Spacer height |
| RepeaterSidebarPanel | `inspector/panels/RepeaterSidebarPanel.vue` | Data variable, preview data JSON, background/alternating color, border, padding. Includes hint dialog with examples. |
| TextSidebarPanel | `inspector/panels/TextSidebarPanel.vue` | Text content, markdown flag, typography |

## Layout Components (`layout/`)

Top-level UI shells, drawers, and panels.

| Component | File | Purpose |
|-----------|------|---------|
| TemplatePanel | `layout/TemplatePanel.vue` | Main toolbar + tabs (editor/preview/JSON/HTML/plain text), screen size toggle, language selector, save/create, send test email dialog |
| InspectorDrawer | `layout/InspectorDrawer.vue` | Right fixed drawer: Styles vs Inspect tabs |
| SamplesDrawer | `layout/SamplesDrawer.vue` | Left drawer: sample template list |
| JsonPanel | `layout/JsonPanel.vue` | Highlighted JSON view with copy button |
| HtmlPanel | `layout/HtmlPanel.vue` | Highlighted HTML view with copy button |
| PlainTextEditor | `layout/PlainTextEditor.vue` | Contenteditable plain text editor with slash command support for PlainTextEn/PlainTextFr |
| SlashCommandMenu | `layout/SlashCommandMenu.vue` | Floating autocomplete menu for slash commands, with keyboard navigation |
| ImportJsonDialog | `layout/ImportJsonDialog.vue` | Modal to paste/validate/load JSON template |

## Reader Components (`reader/`)

Read-only preview rendering.

| Component | File | Purpose |
|-----------|------|---------|
| Reader | `reader/Reader.vue` | Preview entry point: provides `readerDocument`, renders from `rootBlockId` |
| ReaderBlock | `reader/ReaderBlock.vue` | Recursive read-only block tree. Handles repeater variable substitution via injected `repeaterContext`, renders alternating backgrounds per iteration. Contains inline `RepeaterItemProvider` component. |
