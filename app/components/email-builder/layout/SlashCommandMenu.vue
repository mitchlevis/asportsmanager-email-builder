<script setup lang="ts">
import { slashCommands, type SlashCommand } from '~/utils/email-builder/slash-commands'

const props = defineProps<{
  filter: string
  x: number
  y: number
}>()

const emit = defineEmits<{
  select: [command: SlashCommand]
  close: []
}>()

const selectedIndex = ref(0)

const filtered = computed(() => {
  const q = props.filter.toLowerCase()
  if (!q) return slashCommands
  return slashCommands.filter(c => c.label.toLowerCase().includes(q))
})

watch(filtered, () => {
  selectedIndex.value = 0
})

watch(() => filtered.value.length, (len) => {
  if (len === 0) emit('close')
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (filtered.value.length > 0) {
      emit('select', filtered.value[selectedIndex.value])
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
}

defineExpose({ handleKeydown })
</script>

<template>
  <div
    v-if="filtered.length > 0"
    class="slash-menu elevation-4"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <v-list density="compact" nav min-width="260">
      <v-list-subheader>Commands</v-list-subheader>
      <v-list-item
        v-for="(cmd, i) in filtered"
        :key="cmd.id"
        :prepend-icon="cmd.icon"
        :active="i === selectedIndex"
        color="primary"
        @click="emit('select', cmd)"
        @mouseenter="selectedIndex = i"
      >
        <v-list-item-title>{{ cmd.label }}</v-list-item-title>
        <v-list-item-subtitle>{{ cmd.description }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.slash-menu {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  max-height: 240px;
  overflow-y: auto;
}
</style>
