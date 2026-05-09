<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: number
  min?: number
  max?: number
  step?: number
  units?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div>
    <v-label class="text-caption mb-1">
      {{ label }}
      <span v-if="units" class="text-grey">{{ modelValue }}{{ units }}</span>
    </v-label>
    <v-slider
      :model-value="modelValue"
      :min="min ?? 0"
      :max="max ?? 100"
      :step="step ?? 1"
      density="compact"
      hide-details
      thumb-label
      @update:model-value="(v: number) => emit('update:modelValue', v)"
    />
  </div>
</template>
