<script setup lang="ts">
import type { TEditorDocument } from '~/types/email-builder'
import ReaderBlock from './ReaderBlock.vue'

const props = defineProps<{
  document: TEditorDocument
  rootBlockId: string
}>()

const docRef = computed(() => props.document)

provide('readerDocument', docRef)
</script>

<template>
  <ReaderBlock :id="rootBlockId" />
</template>
