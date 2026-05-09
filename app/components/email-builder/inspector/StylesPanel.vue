<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import EmailLayoutSidebarPanel from './panels/EmailLayoutSidebarPanel.vue'

const store = useEmailEditor()

const rootBlock = computed(() => store.document.root)
const rootData = computed(() => rootBlock.value?.data as Record<string, unknown> | undefined)

function updateRoot(data: Record<string, unknown>) {
  if (!rootBlock.value) return
  store.setDocument({
    root: { type: 'EmailLayout', data: { ...rootData.value, ...data } },
  })
}
</script>

<template>
  <div v-if="rootData">
    <EmailLayoutSidebarPanel
      :data="rootData as any"
      @update:data="updateRoot"
    />
  </div>
  <div v-else class="pa-4">
    <v-alert type="info" variant="tonal" density="compact">
      No email layout found.
    </v-alert>
  </div>
</template>
