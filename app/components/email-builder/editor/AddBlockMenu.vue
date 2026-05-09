<script setup lang="ts">
import type { TEditorBlock, BlockType } from '~/types/email-builder'
import { getDefaultBlock } from '~/utils/email-builder/block-defaults'

defineProps<{
  placeholder?: boolean
}>()

const emit = defineEmits<{
  select: [block: TEditorBlock]
}>()

const menuOpen = ref(false)

const blockTypes: { type: BlockType; label: string; icon: string }[] = [
  { type: 'Text', label: 'Text', icon: 'mdi-text' },
  { type: 'Heading', label: 'Heading', icon: 'mdi-format-header-2' },
  { type: 'Button', label: 'Button', icon: 'mdi-button-cursor' },
  { type: 'Image', label: 'Image', icon: 'mdi-image' },
  { type: 'Avatar', label: 'Avatar', icon: 'mdi-account-circle' },
  { type: 'Divider', label: 'Divider', icon: 'mdi-minus' },
  { type: 'Spacer', label: 'Spacer', icon: 'mdi-arrow-expand-vertical' },
  { type: 'Html', label: 'HTML', icon: 'mdi-code-tags' },
  { type: 'Container', label: 'Container', icon: 'mdi-card-outline' },
  { type: 'ColumnsContainer', label: 'Columns', icon: 'mdi-view-column' },
  { type: 'Repeater', label: 'Repeater', icon: 'mdi-repeat' },
]

function addBlock(type: BlockType) {
  emit('select', getDefaultBlock(type))
  menuOpen.value = false
}
</script>

<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom center">
    <template #activator="{ props: menuProps }">
      <div
        v-if="placeholder"
        v-bind="menuProps"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px 16px',
          border: '2px dashed #ccc',
          borderRadius: '4px',
          margin: '8px',
          cursor: 'pointer',
          color: '#999',
        }"
      >
        <v-icon class="mr-1" size="18">mdi-plus</v-icon>
        Add block
      </div>

      <div
        v-else
        :style="{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          height: '0',
          overflow: 'visible',
          zIndex: 5,
        }"
      >
        <v-btn
          v-bind="menuProps"
          size="x-small"
          icon
          variant="text"
          color="primary"
          :style="{ opacity: 0.3, transition: 'opacity 0.2s' }"
          class="add-block-btn"
        >
          <v-icon size="16">mdi-plus-circle</v-icon>
        </v-btn>
      </div>
    </template>

    <v-card min-width="200">
      <v-list density="compact">
        <v-list-subheader>Add Block</v-list-subheader>
        <v-list-item
          v-for="bt in blockTypes"
          :key="bt.type"
          :prepend-icon="bt.icon"
          :title="bt.label"
          @click="addBlock(bt.type)"
        />
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
.add-block-btn:hover {
  opacity: 1 !important;
}
</style>
