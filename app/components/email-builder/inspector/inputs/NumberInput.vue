<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: number | null | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()
</script>

<template>
  <v-text-field
    :label="label"
    :model-value="modelValue ?? ''"
    type="number"
    variant="outlined"
    density="compact"
    hide-details
    @update:model-value="(v: string) => emit('update:modelValue', v === '' ? null : Number(v))"
  />
</template>
