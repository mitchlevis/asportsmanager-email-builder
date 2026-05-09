<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import type { TEditorBlock } from '~/types/email-builder'
import AvatarSidebarPanel from './panels/AvatarSidebarPanel.vue'
import ButtonSidebarPanel from './panels/ButtonSidebarPanel.vue'
import ColumnsContainerSidebarPanel from './panels/ColumnsContainerSidebarPanel.vue'
import ContainerSidebarPanel from './panels/ContainerSidebarPanel.vue'
import RepeaterSidebarPanel from './panels/RepeaterSidebarPanel.vue'
import DividerSidebarPanel from './panels/DividerSidebarPanel.vue'
import HeadingSidebarPanel from './panels/HeadingSidebarPanel.vue'
import HtmlSidebarPanel from './panels/HtmlSidebarPanel.vue'
import ImageSidebarPanel from './panels/ImageSidebarPanel.vue'
import EmailLayoutSidebarPanel from './panels/EmailLayoutSidebarPanel.vue'
import SpacerSidebarPanel from './panels/SpacerSidebarPanel.vue'
import TextSidebarPanel from './panels/TextSidebarPanel.vue'

const store = useEmailEditor()

const selectedBlock = computed(() => {
  if (!store.selectedBlockId) return null
  return store.document[store.selectedBlockId] ?? null
})

function setBlock(data: Record<string, unknown>) {
  if (!store.selectedBlockId || !selectedBlock.value) return
  store.setDocument({
    [store.selectedBlockId]: { type: selectedBlock.value.type, data } as TEditorBlock,
  })
}
</script>

<template>
  <div v-if="!store.selectedBlockId" class="pa-4">
    <v-alert type="info" variant="tonal" density="compact">
      Click on a block to inspect.
    </v-alert>
  </div>

  <div v-else-if="!selectedBlock" class="pa-4">
    <v-alert type="warning" variant="tonal" density="compact">
      Block not found. Click on a block to reset.
    </v-alert>
  </div>

  <template v-else>
    <AvatarSidebarPanel
      v-if="selectedBlock.type === 'Avatar'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <ButtonSidebarPanel
      v-else-if="selectedBlock.type === 'Button'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <ColumnsContainerSidebarPanel
      v-else-if="selectedBlock.type === 'ColumnsContainer'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <ContainerSidebarPanel
      v-else-if="selectedBlock.type === 'Container'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <RepeaterSidebarPanel
      v-else-if="selectedBlock.type === 'Repeater'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <DividerSidebarPanel
      v-else-if="selectedBlock.type === 'Divider'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <HeadingSidebarPanel
      v-else-if="selectedBlock.type === 'Heading'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <HtmlSidebarPanel
      v-else-if="selectedBlock.type === 'Html'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <ImageSidebarPanel
      v-else-if="selectedBlock.type === 'Image'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <EmailLayoutSidebarPanel
      v-else-if="selectedBlock.type === 'EmailLayout'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <SpacerSidebarPanel
      v-else-if="selectedBlock.type === 'Spacer'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <TextSidebarPanel
      v-else-if="selectedBlock.type === 'Text'"
      :key="store.selectedBlockId"
      :data="selectedBlock.data as any"
      @update:data="setBlock"
    />
    <div v-else class="pa-4">
      <pre>{{ JSON.stringify(selectedBlock, null, 2) }}</pre>
    </div>
  </template>
</template>
