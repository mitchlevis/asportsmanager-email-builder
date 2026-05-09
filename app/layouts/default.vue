<script setup lang="ts">
import { useEmailTemplates } from '~/composables/useEmailTemplates'
import { useEmailEditor } from '~/composables/useEmailEditor'
import type { EmailTemplateRecord } from '~/types/email-builder'
import { apiFetch } from '~/utils/api'

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const emailTemplates = useEmailTemplates()
const editorStore = useEmailEditor()

const NAV_WIDTH = 220
const rail = ref(false)

const navItems = [
  { title: 'Home', icon: 'mdi-home', to: '/' },
  { title: 'Editor', icon: 'mdi-email-edit-outline', to: '/editor' },
]

const isEditorRoute = computed(() => route.path.startsWith('/editor'))
const activeTemplateId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : null
})

watch(isEditorRoute, (onEditor) => {
  if (!import.meta.client) return
  if (onEditor && emailTemplates.templates.length === 0 && !emailTemplates.loading) {
    emailTemplates.fetchTemplates()
  }
}, { immediate: true })

function onScrollSentinelVisible(isIntersecting: boolean) {
  if (isIntersecting && emailTemplates.hasMore && !emailTemplates.loadingMore) {
    emailTemplates.fetchMoreTemplates()
  }
}

function handleLogout() {
  auth.logout()
}

// ── Template context menu ───────────────────────────────────────────────────
const menuTemplateId = ref<number | null>(null)
const menuTemplateName = ref('')

const showSettingsDialog = ref(false)
const showDuplicateDialog = ref(false)
const showDeleteDialog = ref(false)

const settingsForm = ref({ Name: '', Description: '', SubjectEn: '', SubjectFr: '' })
const settingsLoading = ref(false)
const savingSettings = ref(false)

const duplicateName = ref('')
const duplicating = ref(false)

const deleting = ref(false)

async function openSettings(tplId: number) {
  menuTemplateId.value = tplId
  settingsLoading.value = true
  showSettingsDialog.value = true
  try {
    const record = await apiFetch<EmailTemplateRecord>(`/rest/email-templates/${tplId}`)
    settingsForm.value = {
      Name: record.Name ?? '',
      Description: record.Description ?? '',
      SubjectEn: record.SubjectEn ?? '',
      SubjectFr: record.SubjectFr ?? '',
    }
  } finally {
    settingsLoading.value = false
  }
}

async function saveSettings() {
  if (!menuTemplateId.value) return
  savingSettings.value = true
  try {
    await apiFetch(`/rest/email-templates/${menuTemplateId.value}`, {
      method: 'PUT',
      body: settingsForm.value,
    })
    emailTemplates.fetchTemplates()
    if (editorStore.apiRecord && editorStore.templateId === menuTemplateId.value) {
      editorStore.apiRecord.Name = settingsForm.value.Name
      editorStore.apiRecord.Description = settingsForm.value.Description
      editorStore.apiRecord.SubjectEn = settingsForm.value.SubjectEn
      editorStore.apiRecord.SubjectFr = settingsForm.value.SubjectFr
    }
    showSettingsDialog.value = false
  } finally {
    savingSettings.value = false
  }
}

function openDuplicate(tplId: number, name: string) {
  menuTemplateId.value = tplId
  duplicateName.value = `Copy of ${name}`
  showDuplicateDialog.value = true
}

function parseJsonField(value: unknown): unknown {
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return value }
  }
  return value
}

async function confirmDuplicate() {
  const name = duplicateName.value.trim()
  if (!name || !menuTemplateId.value) return
  duplicating.value = true
  try {
    const source = await apiFetch<EmailTemplateRecord>(`/rest/email-templates/${menuTemplateId.value}`)
    const { Id: _, ...body } = source
    body.Name = name
    body.JsonEn = parseJsonField(body.JsonEn) as any
    body.JsonFr = parseJsonField(body.JsonFr) as any
    const created = await apiFetch<EmailTemplateRecord>('/rest/email-templates', {
      method: 'POST',
      body,
    })
    showDuplicateDialog.value = false
    emailTemplates.fetchTemplates()
    router.push(`/editor/${created.Id}`)
  } finally {
    duplicating.value = false
  }
}

function openDelete(tplId: number, name: string) {
  menuTemplateId.value = tplId
  menuTemplateName.value = name
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!menuTemplateId.value) return
  deleting.value = true
  try {
    if (editorStore.templateId === menuTemplateId.value) {
      await editorStore.deleteTemplate()
      router.replace('/editor')
    } else {
      await apiFetch(`/rest/email-templates/${menuTemplateId.value}`, { method: 'DELETE' })
    }
    emailTemplates.fetchTemplates()
    showDeleteDialog.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <v-app>
    <v-navigation-drawer :width="NAV_WIDTH" :rail="rail" permanent>
      <div class="d-flex flex-column" style="height: 100%">
        <div class="pa-4 d-flex justify-center">
          <img
            src="/images/asm_logo.png"
            alt="ASportsManager"
            :style="{ width: rail ? '32px' : '80px', height: 'auto', transition: 'width 0.2s ease' }"
          />
        </div>

        <v-divider />

        <v-list nav density="compact">
          <v-list-item
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            :active="route.path === item.to"
            color="primary"
          />
        </v-list>

        <!-- Template list (visible on editor routes) -->
        <template v-if="isEditorRoute">
          <v-divider />

          <div style="flex: 1; min-height: 0; overflow-y: auto">
            <v-list nav density="compact">
              <v-list-item
                to="/editor/new"
                prepend-icon="mdi-plus"
                title="Create new"
                color="primary"
                variant="tonal"
                class="mb-1"
              />

              <v-list-item
                v-if="emailTemplates.loading"
                disabled
              >
                <template #prepend>
                  <v-progress-circular indeterminate size="16" width="2" class="mr-2" />
                </template>
                <v-list-item-title v-if="!rail">Loading...</v-list-item-title>
              </v-list-item>

              <v-tooltip
                v-for="tpl in emailTemplates.templates"
                :key="tpl.Id"
                :text="tpl.Description || 'No description'"
                location="end"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-list-item
                    v-bind="tooltipProps"
                    :to="`/editor/${tpl.Id}`"
                    :active="activeTemplateId === tpl.Id"
                    :prepend-icon="rail ? 'mdi-email-outline' : undefined"
                    color="primary"
                  >
                    <template v-if="!rail" #prepend>
                      <v-chip size="x-small" color="blue" variant="flat" class="mr-2 font-weight-bold">{{ tpl.Id }}</v-chip>
                    </template>
                    <v-list-item-title>{{ tpl.Name }}</v-list-item-title>
                    <template v-if="!rail" #append>
                      <v-menu location="end">
                        <template #activator="{ props: menuProps }">
                          <v-btn
                            v-bind="menuProps"
                            icon="mdi-dots-vertical"
                            size="x-small"
                            variant="text"
                            density="compact"
                            @click.prevent.stop
                          />
                        </template>
                        <v-list density="compact" min-width="160">
                          <v-list-item
                            prepend-icon="mdi-cog-outline"
                            title="Settings"
                            @click="openSettings(tpl.Id)"
                          />
                          <v-list-item
                            prepend-icon="mdi-content-copy"
                            title="Duplicate"
                            @click="openDuplicate(tpl.Id, tpl.Name)"
                          />
                          <v-divider class="my-1" />
                          <v-list-item
                            prepend-icon="mdi-delete-outline"
                            title="Delete"
                            base-color="error"
                            @click="openDelete(tpl.Id, tpl.Name)"
                          />
                        </v-list>
                      </v-menu>
                    </template>
                  </v-list-item>
                </template>
              </v-tooltip>

              <!-- Infinite scroll sentinel -->
              <div
                v-if="emailTemplates.hasMore"
                v-intersect="{ handler: onScrollSentinelVisible, options: { threshold: 0.1 } }"
                class="d-flex justify-center pa-2"
              >
                <v-progress-circular
                  v-if="emailTemplates.loadingMore"
                  indeterminate
                  size="20"
                  width="2"
                />
              </div>
            </v-list>
          </div>
        </template>

        <template v-else>
          <div style="flex: 1" />
        </template>

        <v-divider />

        <v-list nav density="compact">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout"
          />
          <v-list-item
            :prepend-icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            :title="rail ? 'Expand' : 'Collapse'"
            @click="rail = !rail"
          />
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>

    <!-- Settings Dialog -->
    <v-dialog v-model="showSettingsDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Template Settings</v-card-title>
        <v-card-text>
          <template v-if="settingsLoading">
            <div class="d-flex justify-center pa-6">
              <v-progress-circular indeterminate />
            </div>
          </template>
          <template v-else>
            <div class="rounded-lg pa-4 mb-4" style="background-color: #f5f5f5">
              <div class="text-subtitle-2 font-weight-bold mb-3" style="color: #1565C0">Internal</div>
              <v-text-field v-model="settingsForm.Name" label="Name" class="mb-2" bg-color="white" />
              <v-textarea v-model="settingsForm.Description" label="Description" rows="2" auto-grow bg-color="white" />
            </div>
            <div class="rounded-lg pa-4" style="background-color: #f5f5f5">
              <div class="text-subtitle-2 font-weight-bold mb-3" style="color: #1565C0">Public - Users will see</div>
              <v-text-field v-model="settingsForm.SubjectEn" label="Subject (English)" class="mb-2" bg-color="white" />
              <v-text-field v-model="settingsForm.SubjectFr" label="Subject (French)" bg-color="white" />
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showSettingsDialog = false" :disabled="savingSettings">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveSettings" :loading="savingSettings" :disabled="settingsLoading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Duplicate Dialog -->
    <v-dialog v-model="showDuplicateDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Duplicate Template</v-card-title>
        <v-card-text>
          <v-text-field v-model="duplicateName" label="New template name" autofocus />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDuplicateDialog = false" :disabled="duplicating">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmDuplicate" :loading="duplicating" :disabled="!duplicateName.trim()">Duplicate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Delete Template</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>{{ menuTemplateName }}</strong>? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false" :disabled="deleting">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
