<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import InspectorDrawer from '~/components/email-builder/layout/InspectorDrawer.vue'
import TemplatePanel from '~/components/email-builder/layout/TemplatePanel.vue'

const store = useEmailEditor()

onMounted(() => {
  store.initNewTemplate()
})
</script>

<template>
  <ClientOnly>
    <v-layout full-height>
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
