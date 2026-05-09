<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import type { TEditorDocument } from '~/types/email-builder'

const emit = defineEmits<{ close: [] }>()

const store = useEmailEditor()
const jsonInput = ref('')
const error = ref<string | null>(null)

function importJson() {
  try {
    const parsed = JSON.parse(jsonInput.value) as TEditorDocument
    if (!parsed.root) {
      error.value = 'Invalid template: missing "root" block'
      return
    }
    store.loadTemplate(parsed)
    emit('close')
  } catch {
    error.value = 'Invalid JSON format'
  }
}
</script>

<template>
  <v-dialog :model-value="true" max-width="600" @update:model-value="emit('close')">
    <v-card>
      <v-card-title>Import JSON</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="jsonInput"
          label="Paste your email template JSON"
          :rows="12"
          variant="outlined"
          :error-messages="error ?? undefined"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="importJson">Import</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
