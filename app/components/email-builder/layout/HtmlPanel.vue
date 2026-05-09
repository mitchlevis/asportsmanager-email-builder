<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('xml', xml)

const store = useEmailEditor()

const VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr',
])

function beautifyHtml(html: string): string {
  const tab = '  '
  const lines: string[] = []
  let indent = 0

  const parts = html.replace(/>\s*</g, '>\n<').split('\n')

  for (const raw of parts) {
    const token = raw.trim()
    if (!token) continue

    const openTags: string[] = []
    const closeTags: string[] = []
    let isSelfClose = false

    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)[^>]*\/?>/g
    let match
    while ((match = tagRegex.exec(token)) !== null) {
      const full = match[0]
      const name = match[1].toLowerCase()
      if (full.startsWith('</')) {
        closeTags.push(name)
      } else if (full.endsWith('/>') || VOID_ELEMENTS.has(name)) {
        isSelfClose = true
      } else if (!full.startsWith('<!')) {
        openTags.push(name)
      }
    }

    const netClose = closeTags.filter(c => {
      const idx = openTags.indexOf(c)
      if (idx !== -1) { openTags.splice(idx, 1); return false }
      return true
    })

    if (netClose.length > 0) indent = Math.max(0, indent - netClose.length)
    lines.push(tab.repeat(indent) + token)
    indent += openTags.length
  }

  return lines.join('\n')
}

const htmlCode = computed(() => store.getTemplateHtml())
const prettyHtml = computed(() => beautifyHtml(htmlCode.value))
const highlighted = computed(() => hljs.highlight(prettyHtml.value, { language: 'xml' }).value)

function copyToClipboard() {
  navigator.clipboard.writeText(htmlCode.value)
}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex justify-end mb-2">
      <v-btn size="small" variant="outlined" prepend-icon="mdi-content-copy" @click="copyToClipboard">
        Copy HTML
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
