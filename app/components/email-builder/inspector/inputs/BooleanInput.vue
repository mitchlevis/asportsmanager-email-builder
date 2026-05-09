<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <v-switch
    :label="label"
    :model-value="modelValue"
    density="compact"
    hide-details
    color="primary"
    @update:model-value="(v: boolean) => emit('update:modelValue', v)"
  />
</template>
