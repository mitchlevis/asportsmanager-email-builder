<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'

const store = useEmailEditor()

onMounted(() => {
  store.templateId = null
  store.apiRecord = null
})
</script>

<template>
  <div class="d-flex flex-column align-center justify-center" style="height: 100vh">
    <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-email-open-outline</v-icon>
    <p class="text-body-1 text-medium-emphasis text-center" style="max-width: 320px">
      Open an existing template or create a new one from the sidebar on the left.
    </p>
  </div>
</template>
