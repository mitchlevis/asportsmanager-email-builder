<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import TuneMenu from './TuneMenu.vue'

const store = useEmailEditor()
const blockId = inject<string>('currentBlockId', '')
const mouseInside = ref(false)

const isSelected = computed(() => store.selectedBlockId === blockId)

const outline = computed(() => {
  if (isSelected.value) return '2px solid rgba(0, 121, 204, 1)'
  if (mouseInside.value) return '2px solid rgba(0, 121, 204, 0.3)'
  return undefined
})

function onMouseEnter(ev: MouseEvent) {
  mouseInside.value = true
  ev.stopPropagation()
}

function onMouseLeave() {
  mouseInside.value = false
}

function onClick(ev: MouseEvent) {
  store.setSelectedBlockId(blockId)
  ev.stopPropagation()
  ev.preventDefault()
}
</script>

<template>
  <div
    :style="{
      position: 'relative',
      maxWidth: '100%',
      outlineOffset: '-1px',
      outline,
      cursor: 'pointer',
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <TuneMenu v-if="isSelected" :block-id="blockId" />
    <slot />
  </div>
</template>
