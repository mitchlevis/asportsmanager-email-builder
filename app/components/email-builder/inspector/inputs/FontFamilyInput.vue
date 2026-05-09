<script setup lang="ts">
import type { FontFamily } from '~/utils/email-builder/font-families'

const props = defineProps<{
  label: string
  modelValue: FontFamily
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FontFamily]
}>()

const fontOptions = [
  { value: 'MODERN_SANS', label: 'Modern Sans' },
  { value: 'BOOK_SANS', label: 'Book Sans' },
  { value: 'ORGANIC_SANS', label: 'Organic Sans' },
  { value: 'GEOMETRIC_SANS', label: 'Geometric Sans' },
  { value: 'HEAVY_SANS', label: 'Heavy Sans' },
  { value: 'ROUNDED_SANS', label: 'Rounded Sans' },
  { value: 'MODERN_SERIF', label: 'Modern Serif' },
  { value: 'BOOK_SERIF', label: 'Book Serif' },
  { value: 'MONOSPACE', label: 'Monospace' },
]
</script>

<template>
  <v-select
    :label="label"
    :model-value="modelValue ?? 'MODERN_SANS'"
    :items="fontOptions"
    item-title="label"
    item-value="value"
    variant="outlined"
    density="compact"
    hide-details
    @update:model-value="(v: string) => emit('update:modelValue', v as FontFamily)"
  />
</template>
