<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import { apiFetch } from '~/utils/api'
import type { EmailTemplateRecord } from '~/types/email-builder'
import InspectorDrawer from '~/components/email-builder/layout/InspectorDrawer.vue'
import TemplatePanel from '~/components/email-builder/layout/TemplatePanel.vue'

const route = useRoute()
const store = useEmailEditor()
const loading = ref(true)
const error = ref<string | null>(null)

async function loadTemplate(id: string) {
  loading.value = true
  error.value = null
  try {
    const record = await apiFetch<EmailTemplateRecord>(
      `/rest/email-templates/${id}`,
    )
    store.loadFromApi(record)
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Failed to load template'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = route.params.id as string
  loadTemplate(id)
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTemplate(newId as string)
  }
})
</script>

<template>
  <ClientOnly>
    <div v-if="loading" style="display: flex; justify-content: center; align-items: center; height: 100vh">
      <v-progress-circular indeterminate size="48" />
    </div>

    <div v-else-if="error" style="display: flex; justify-content: center; align-items: center; height: 100vh">
      <v-alert type="error" variant="tonal" max-width="400">
        {{ error }}
      </v-alert>
    </div>

    <v-layout v-else full-height>
      <InspectorDrawer />
      <v-main>
        <TemplatePanel />
      </v-main>
    </v-layout>

    <template #fallback>
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh">
        Loading email builder...
      </div>
    </template>
  </ClientOnly>
</template>
