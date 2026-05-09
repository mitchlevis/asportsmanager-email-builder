<script setup lang="ts">
import type { Padding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{
  modelValue: Padding
}>()

const emit = defineEmits<{
  'update:modelValue': [value: NonNullable<Padding>]
}>()

const padding = computed(() => props.modelValue ?? { top: 0, bottom: 0, left: 0, right: 0 })

function update(key: 'top' | 'bottom' | 'left' | 'right', value: number) {
  emit('update:modelValue', { ...padding.value, [key]: value })
}
</script>

<template>
  <div>
    <v-label class="text-caption mb-1">Padding</v-label>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
      <v-text-field
        label="Top"
        type="number"
        :model-value="padding.top"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="(v: string) => update('top', Number(v))"
      />
      <v-text-field
        label="Bottom"
        type="number"
        :model-value="padding.bottom"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="(v: string) => update('bottom', Number(v))"
      />
      <v-text-field
        label="Left"
        type="number"
        :model-value="padding.left"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="(v: string) => update('left', Number(v))"
      />
      <v-text-field
        label="Right"
        type="number"
        :model-value="padding.right"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="(v: string) => update('right', Number(v))"
      />
    </div>
  </div>
</template>
