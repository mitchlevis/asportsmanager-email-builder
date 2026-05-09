<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('json', json)

const store = useEmailEditor()

const jsonCode = computed(() => JSON.stringify(store.getTemplateJson(), null, 2))
const highlighted = computed(() => hljs.highlight(jsonCode.value, { language: 'json' }).value)

function copyToClipboard() {
  navigator.clipboard.writeText(jsonCode.value)
}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex justify-end mb-2">
      <v-btn size="small" variant="outlined" prepend-icon="mdi-content-copy" @click="copyToClipboard">
        Copy JSON
      </v-btn>
    </div>
    <pre
      class="pa-4"
      :style="{
        backgroundColor: '#f6f8fa',
        borderRadius: '8px',
        overflow: 'auto',
        fontSize: '13px',
        lineHeight: '1.5',
        maxHeight: 'calc(100vh - 130px)',
      }"
    ><code v-html="highlighted" /></pre>
  </div>
</template>
