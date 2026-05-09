<script setup lang="ts">
import type { TEditorBlock } from '~/types/email-builder'
import { generateBlockId } from '~/utils/email-builder/block-defaults'
import EditorBlock from './EditorBlock.vue'
import AddBlockMenu from './AddBlockMenu.vue'

const props = defineProps<{
  childrenIds: string[] | null | undefined
}>()

const emit = defineEmits<{
  change: [payload: { blockId: string; block: TEditorBlock; childrenIds: string[] }]
}>()

function appendBlock(block: TEditorBlock) {
  const blockId = generateBlockId()
  emit('change', {
    blockId,
    block,
    childrenIds: [...(props.childrenIds || []), blockId],
  })
}

function insertBlock(block: TEditorBlock, index: number) {
  const blockId = generateBlockId()
  const newChildren = [...(props.childrenIds || [])]
  newChildren.splice(index, 0, blockId)
  emit('change', {
    blockId,
    block,
    childrenIds: newChildren,
  })
}
</script>

<template>
  <div v-if="!childrenIds || childrenIds.length === 0">
    <AddBlockMenu placeholder @select="appendBlock" />
  </div>
  <template v-else>
    <template v-for="(childId, i) in childrenIds" :key="childId">
      <AddBlockMenu @select="(block: TEditorBlock) => insertBlock(block, i)" />
      <EditorBlock :id="childId" />
    </template>
    <AddBlockMenu @select="appendBlock" />
  </template>
</template>
