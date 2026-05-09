import { defineStore } from 'pinia'
import { ref, computed, watch, toRaw } from 'vue'
import type { TEditorDocument, EmailTemplateRecord } from '~/types/email-builder'
import { renderToHtml } from '~/utils/email-builder/render-to-html'
import { apiFetch } from '~/utils/api'

export type MainTab = 'editor' | 'preview' | 'json' | 'html' | 'plaintext'
export type SidebarTab = 'block-configuration' | 'styles'
export type ScreenSize = 'desktop' | 'mobile'
export type Language = 'en' | 'fr'

const EMPTY_LAYOUT: TEditorDocument = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F5F5F5',
      canvasColor: '#FFFFFF',
      textColor: '#242424',
      fontFamily: 'MODERN_SANS',
      childrenIds: [],
    },
  },
}

function jsonFieldForLang(lang: Language): 'JsonEn' | 'JsonFr' {
  return lang === 'fr' ? 'JsonFr' : 'JsonEn'
}

function plainTextFieldForLang(lang: Language): 'PlainTextEn' | 'PlainTextFr' {
  return lang === 'fr' ? 'PlainTextFr' : 'PlainTextEn'
}

export const useEmailEditor = defineStore('emailEditor', () => {
  const document = ref<TEditorDocument>({})
  const selectedBlockId = ref<string | null>(null)
  const selectedSidebarTab = ref<SidebarTab>('styles')
  const selectedMainTab = ref<MainTab>('editor')
  const selectedScreenSize = ref<ScreenSize>('desktop')
  const inspectorDrawerOpen = ref(true)

  // API-backed template state
  const templateId = ref<number | null>(null)
  const isNewTemplate = ref(false)
  const selectedLanguage = ref<Language>('en')
  const apiRecord = ref<EmailTemplateRecord | null>(null)
  const originalSnapshot = ref('')
  const saving = ref(false)

  // Ephemeral preview data for Repeater blocks (blockId -> array), never saved
  const repeaterPreviewData = ref<Record<string, unknown[]>>({})

  // Plain text content for the selected language
  const plainText = ref('')

  const isApiMode = computed(() => templateId.value !== null || isNewTemplate.value)

  const originalPlainTextSnapshot = ref('')

  const isDirty = computed(() => {
    if (!isApiMode.value) return false
    return JSON.stringify(toRaw(document.value)) !== originalSnapshot.value
      || plainText.value !== originalPlainTextSnapshot.value
  })

  function setSelectedBlockId(blockId: string | null) {
    selectedBlockId.value = blockId
    if (blockId !== null) {
      selectedSidebarTab.value = 'block-configuration'
      inspectorDrawerOpen.value = true
    } else {
      selectedSidebarTab.value = 'styles'
    }
  }

  function setDocument(partial: TEditorDocument) {
    document.value = { ...document.value, ...partial }
  }

  function toggleInspectorDrawer() {
    inspectorDrawerOpen.value = !inspectorDrawerOpen.value
  }

  // ── CMS Hooks ───────────────────────────────────────────────────────────

  function loadTemplate(templateJson: TEditorDocument) {
    document.value = templateJson
    selectedBlockId.value = null
    selectedSidebarTab.value = 'styles'
  }

  function resetDocument() {
    templateId.value = null
    isNewTemplate.value = false
    apiRecord.value = null
    originalSnapshot.value = ''
    originalPlainTextSnapshot.value = ''
    plainText.value = ''
    repeaterPreviewData.value = {}
    loadTemplate(JSON.parse(JSON.stringify(EMPTY_LAYOUT)))
  }

  function initNewTemplate() {
    templateId.value = null
    isNewTemplate.value = true
    selectedLanguage.value = 'en'
    apiRecord.value = null
    plainText.value = ''
    originalPlainTextSnapshot.value = ''
    const emptyDoc = JSON.parse(JSON.stringify(EMPTY_LAYOUT))
    loadTemplate(emptyDoc)
    originalSnapshot.value = JSON.stringify(toRaw(document.value))
  }

  function getTemplateJson(): TEditorDocument {
    return toRaw(document.value)
  }

  function getTemplateHtml(): string {
    return renderToHtml(toRaw(document.value), { rootBlockId: 'root' })
  }

  function onDocumentChange(callback: (doc: TEditorDocument) => void) {
    return watch(document, (newDoc) => callback(toRaw(newDoc)), { deep: true })
  }

  // ── API-backed editing ────────────────────────────────────────────────

  function parseJsonField(value: unknown): TEditorDocument | null {
    if (value === null || value === undefined) return null
    let parsed: unknown = value
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch { return null }
    }
    if (typeof parsed !== 'object' || parsed === null || !('root' in parsed)) return null
    return parsed as TEditorDocument
  }

  function loadFromApi(record: EmailTemplateRecord) {
    repeaterPreviewData.value = {}
    apiRecord.value = JSON.parse(JSON.stringify(record))
    templateId.value = record.Id
    const jsonField = jsonFieldForLang(selectedLanguage.value)
    const rawJsonValue = record[jsonField]
    const parsed = parseJsonField(rawJsonValue)
    const doc = parsed ?? JSON.parse(JSON.stringify(EMPTY_LAYOUT))
    loadTemplate(doc)
    originalSnapshot.value = JSON.stringify(toRaw(document.value))
    const ptField = plainTextFieldForLang(selectedLanguage.value)
    plainText.value = record[ptField] ?? ''
    originalPlainTextSnapshot.value = plainText.value
  }

  function switchLanguage(lang: Language) {
    if (lang === selectedLanguage.value || !apiRecord.value) return
    const currentField = jsonFieldForLang(selectedLanguage.value)
    apiRecord.value[currentField] = JSON.parse(JSON.stringify(toRaw(document.value)))
    const currentPtField = plainTextFieldForLang(selectedLanguage.value)
    apiRecord.value[currentPtField] = plainText.value
    selectedLanguage.value = lang
    const newField = jsonFieldForLang(lang)
    const parsed = parseJsonField(apiRecord.value[newField])
    const doc = parsed ?? JSON.parse(JSON.stringify(EMPTY_LAYOUT))
    loadTemplate(doc)
    originalSnapshot.value = JSON.stringify(toRaw(document.value))
    const newPtField = plainTextFieldForLang(lang)
    plainText.value = apiRecord.value[newPtField] ?? ''
    originalPlainTextSnapshot.value = plainText.value
  }

  const canCopyFromEnglish = computed(() => {
    if (!isApiMode.value || selectedLanguage.value !== 'fr' || !apiRecord.value) return false
    const currentChildrenIds = document.value?.root?.data?.childrenIds
    if (currentChildrenIds && currentChildrenIds.length > 0) return false
    const enDoc = parseJsonField(apiRecord.value.JsonEn)
    return enDoc !== null && (enDoc.root?.data?.childrenIds?.length ?? 0) > 0
  })

  function copyFromEnglish() {
    if (!apiRecord.value) return
    const enDoc = parseJsonField(apiRecord.value.JsonEn)
    if (!enDoc) return
    const cloned = JSON.parse(JSON.stringify(enDoc))
    loadTemplate(cloned)
  }

  async function saveTemplate() {
    if (!apiRecord.value || templateId.value === null) return
    saving.value = true
    try {
      const currentField = jsonFieldForLang(selectedLanguage.value)
      const currentDoc = JSON.parse(JSON.stringify(toRaw(document.value)))
      apiRecord.value[currentField] = currentDoc

      const currentHtmlField = selectedLanguage.value === 'fr' ? 'HtmlFr' : 'HtmlEn'
      apiRecord.value[currentHtmlField] = renderToHtml(toRaw(document.value), { rootBlockId: 'root' })

      const currentPtField = plainTextFieldForLang(selectedLanguage.value)
      apiRecord.value[currentPtField] = plainText.value

      const otherJsonField = currentField === 'JsonEn' ? 'JsonFr' : 'JsonEn'
      apiRecord.value[otherJsonField] = parseJsonField(apiRecord.value[otherJsonField])

      const { Id: _, ...body } = apiRecord.value
      const updated = await apiFetch<EmailTemplateRecord>(
        `/rest/email-templates/${templateId.value}`,
        { method: 'PUT', body },
      )
      apiRecord.value = JSON.parse(JSON.stringify(updated))
      originalSnapshot.value = JSON.stringify(currentDoc)
      originalPlainTextSnapshot.value = plainText.value
    } finally {
      saving.value = false
    }
  }

  async function deleteTemplate() {
    if (templateId.value === null) return
    await apiFetch(`/rest/email-templates/${templateId.value}`, { method: 'DELETE' })
    resetDocument()
  }

  async function createTemplate(name: string): Promise<number> {
    saving.value = true
    try {
      const currentDoc = JSON.parse(JSON.stringify(toRaw(document.value)))
      const html = renderToHtml(toRaw(document.value), { rootBlockId: 'root' })

      const body: Record<string, unknown> = {
        Name: name,
        SubjectEn: '',
        SubjectFr: '',
        JsonEn: selectedLanguage.value === 'en' ? currentDoc : null,
        JsonFr: selectedLanguage.value === 'fr' ? currentDoc : null,
        HtmlEn: selectedLanguage.value === 'en' ? html : null,
        HtmlFr: selectedLanguage.value === 'fr' ? html : null,
        PlainTextEn: selectedLanguage.value === 'en' ? plainText.value : null,
        PlainTextFr: selectedLanguage.value === 'fr' ? plainText.value : null,
      }

      const created = await apiFetch<EmailTemplateRecord>(
        '/rest/email-templates',
        { method: 'POST', body },
      )
      isNewTemplate.value = false
      loadFromApi(created)
      return created.Id
    } finally {
      saving.value = false
    }
  }

  return {
    document,
    selectedBlockId,
    selectedSidebarTab,
    selectedMainTab,
    selectedScreenSize,
    inspectorDrawerOpen,
    templateId,
    isNewTemplate,
    isApiMode,
    selectedLanguage,
    apiRecord,
    isDirty,
    saving,
    plainText,
    repeaterPreviewData,
    setSelectedBlockId,
    setDocument,
    toggleInspectorDrawer,
    loadTemplate,
    resetDocument,
    initNewTemplate,
    getTemplateJson,
    getTemplateHtml,
    onDocumentChange,
    loadFromApi,
    switchLanguage,
    canCopyFromEnglish,
    copyFromEnglish,
    saveTemplate,
    createTemplate,
    deleteTemplate,
  }
})
