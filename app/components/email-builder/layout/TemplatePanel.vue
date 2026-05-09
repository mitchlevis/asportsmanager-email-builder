<script setup lang="ts">
import { useEmailEditor, type Language } from '~/composables/useEmailEditor'
import { useEmailTemplates } from '~/composables/useEmailTemplates'
import { apiFetch } from '~/utils/api'
import EditorBlock from '~/components/email-builder/editor/EditorBlock.vue'
import Reader from '~/components/email-builder/reader/Reader.vue'
import HtmlPanel from '~/components/email-builder/layout/HtmlPanel.vue'
import JsonPanel from '~/components/email-builder/layout/JsonPanel.vue'
import ImportJsonDialog from '~/components/email-builder/layout/ImportJsonDialog.vue'
import PlainTextEditor from '~/components/email-builder/layout/PlainTextEditor.vue'

const store = useEmailEditor()
const emailTemplates = useEmailTemplates()
const router = useRouter()
const showImportDialog = ref(false)
const showCreateDialog = ref(false)
const showSendTestDialog = ref(false)
const sendingTest = ref(false)
const sendTestSuccess = ref(false)
const sendTestError = ref<string | null>(null)
const newTemplateName = ref('')
const testToEmail = ref('')
const testFromName = ref('ASportsManager')
const testFromEmail = ref('no_reply@asportsmanager.com')
const testLanguage = ref<Language>('en')
const testVariables = ref<Record<string, string>>({})

const languageOptions = [
  { title: 'English', value: 'en' as Language },
  { title: 'French', value: 'fr' as Language },
]

const templateVariables = computed(() => {
  const json = JSON.stringify(store.document)
  const matches = json.match(/\{\{(\w+)\}\}/g)
  if (!matches) return []
  const unique = [...new Set(matches.map(m => m.replace(/\{|\}/g, '')))]
  return unique
})

function openSendTestDialog() {
  sendTestSuccess.value = false
  sendTestError.value = null
  testLanguage.value = store.selectedLanguage
  const vars: Record<string, string> = {}
  for (const v of templateVariables.value) {
    vars[v] = testVariables.value[v] ?? ''
  }
  testVariables.value = vars
  showSendTestDialog.value = true
}

async function sendTestEmail() {
  if (!testToEmail.value.trim() || store.templateId === null) return
  sendingTest.value = true
  sendTestSuccess.value = false
  sendTestError.value = null
  try {
    await apiFetch(`/send-email/template/${store.templateId}`, {
      method: 'POST',
      body: {
        toEmail: testToEmail.value.trim(),
        fromName: testFromName.value,
        fromEmail: testFromEmail.value,
        language: testLanguage.value,
        templateData: testVariables.value,
      },
    })
    sendTestSuccess.value = true
  } catch (e: any) {
    sendTestError.value = e?.data?.message || e?.message || 'Failed to send test email'
  } finally {
    sendingTest.value = false
  }
}

function onLanguageChange(lang: Language) {
  store.switchLanguage(lang)
}

async function handleSave() {
  if (store.isNewTemplate) {
    showCreateDialog.value = true
  } else {
    await store.saveTemplate()
  }
}

async function confirmCreate() {
  const name = newTemplateName.value.trim()
  if (!name) return
  const newId = await store.createTemplate(name)
  showCreateDialog.value = false
  newTemplateName.value = ''
  emailTemplates.fetchTemplates()
  router.replace(`/editor/${newId}`)
}

const mainBoxStyle = computed(() => {
  const base: Record<string, string> = { height: '100%' }
  if (store.selectedScreenSize === 'mobile') {
    return {
      ...base,
      margin: '32px auto',
      width: '370px',
      height: '800px',
      boxShadow: 'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    }
  }
  return base
})

function downloadJson() {
  const json = JSON.stringify(store.getTemplateJson(), null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'email-template.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div
      :style="{
        height: '49px',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
      }"
    >
      <!-- Left: language selector (API/new templates only) -->
      <div class="d-flex align-center" style="min-width: 140px">
        <v-select
          v-if="store.isApiMode"
          :model-value="store.selectedLanguage"
          :items="languageOptions"
          item-title="title"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 130px"
          @update:model-value="onLanguageChange"
        />
      </div>

      <div class="d-flex align-center" style="gap: 8px; flex: 1; justify-content: center">
        <v-btn-toggle
          :model-value="store.selectedMainTab"
          mandatory
          density="compact"
          color="primary"
          @update:model-value="(v: string) => store.selectedMainTab = v as any"
        >
          <v-btn value="editor" size="small">Editor</v-btn>
          <v-btn value="preview" size="small">Preview</v-btn>
          <v-btn value="html" size="small">HTML</v-btn>
          <v-btn value="json" size="small">JSON</v-btn>
          <v-btn v-if="store.isApiMode" value="plaintext" size="small">Plain Text</v-btn>
        </v-btn-toggle>

        <v-divider vertical class="mx-2" />

        <!-- Download / Import -->
        <v-tooltip text="Download JSON" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-btn icon variant="text" size="small" v-bind="tooltipProps" @click="downloadJson">
              <v-icon size="18">mdi-download</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Import JSON" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-btn icon variant="text" size="small" v-bind="tooltipProps" @click="showImportDialog = true">
              <v-icon size="18">mdi-upload</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-divider vertical class="mx-2" />

        <!-- Screen size toggle -->
        <v-btn-toggle
          :model-value="store.selectedScreenSize"
          mandatory
          density="compact"
          @update:model-value="(v: string) => store.selectedScreenSize = v as any"
        >
          <v-btn value="desktop" size="small">
            <v-icon size="18">mdi-monitor</v-icon>
          </v-btn>
          <v-btn value="mobile" size="small">
            <v-icon size="18">mdi-cellphone</v-icon>
          </v-btn>
        </v-btn-toggle>

        <!-- Save / Delete (API/new templates only) -->
        <template v-if="store.isApiMode">
          <v-divider vertical class="mx-2" />
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-content-save"
            :disabled="!store.isDirty && !store.isNewTemplate"
            :loading="store.saving"
            @click="handleSave"
          >
            {{ store.isNewTemplate ? 'Create' : 'Save' }}
          </v-btn>
          <!-- Send Test (existing templates only) -->
          <template v-if="store.templateId !== null">
            <v-divider vertical class="mx-2" />
            <v-btn
              size="small"
              variant="tonal"
              color="secondary"
              prepend-icon="mdi-email-fast-outline"
              @click="openSendTestDialog"
            >
              Send Test
            </v-btn>
          </template>
        </template>
      </div>

      <!-- Right: inspector toggle -->
      <v-btn icon variant="text" size="small" @click="store.toggleInspectorDrawer()">
        <v-icon>{{ store.inspectorDrawerOpen ? 'mdi-dock-right' : 'mdi-page-layout-sidebar-right' }}</v-icon>
      </v-btn>
    </div>

    <!-- Main content -->
    <div :style="{ height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: '370px' }">
      <!-- Editor tab -->
      <div v-if="store.selectedMainTab === 'editor'" :style="mainBoxStyle">
        <EditorBlock id="root" />
      </div>

      <!-- Preview tab -->
      <div v-else-if="store.selectedMainTab === 'preview'" :style="mainBoxStyle">
        <Reader :document="store.document" root-block-id="root" />
      </div>

      <!-- HTML tab -->
      <HtmlPanel v-else-if="store.selectedMainTab === 'html'" />

      <!-- JSON tab -->
      <JsonPanel v-else-if="store.selectedMainTab === 'json'" />

      <!-- Plain Text tab -->
      <PlainTextEditor v-else-if="store.selectedMainTab === 'plaintext'" />
    </div>

    <!-- Import Dialog -->
    <ImportJsonDialog v-if="showImportDialog" @close="showImportDialog = false" />

    <!-- Create Template Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Create New Template</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTemplateName"
            label="Template name"
            variant="outlined"
            density="compact"
            autofocus
            hide-details
            @keyup.enter="confirmCreate"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!newTemplateName.trim()"
            :loading="store.saving"
            @click="confirmCreate"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Send Test Email Dialog -->
    <v-dialog v-model="showSendTestDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Send Test Email</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="testToEmail"
            label="Recipient email"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="mb-3"
            placeholder="test@example.com"
          />
          <v-text-field
            v-model="testFromName"
            label="From name"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
          />
          <v-text-field
            v-model="testFromEmail"
            label="From email"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
          />
          <v-select
            v-model="testLanguage"
            :items="languageOptions"
            item-title="title"
            item-value="value"
            label="Language"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
          />

          <template v-if="templateVariables.length > 0">
            <v-divider class="mb-3" />
            <div class="text-subtitle-2 mb-2">Template Variables</div>
            <v-text-field
              v-for="varName in templateVariables"
              :key="varName"
              v-model="testVariables[varName]"
              :label="varName"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
              :placeholder="`Value for {{${varName}}}`"
            />
          </template>

          <v-alert v-if="sendTestSuccess" type="success" variant="tonal" density="compact" class="mt-3">
            Test email sent successfully.
          </v-alert>
          <v-alert v-if="sendTestError" type="error" variant="tonal" density="compact" class="mt-3">
            {{ sendTestError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showSendTestDialog = false">Close</v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            :disabled="!testToEmail.trim()"
            :loading="sendingTest"
            @click="sendTestEmail"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
