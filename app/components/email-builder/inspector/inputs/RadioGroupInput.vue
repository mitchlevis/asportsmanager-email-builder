<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string
  options: { value: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <v-label class="text-caption mb-1">{{ label }}</v-label>
    <v-btn-toggle
      :model-value="modelValue"
      mandatory
      density="compact"
      color="primary"
      @update:model-value="(v: string) => emit('update:modelValue', v)"
    >
      <v-btn
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        size="small"
      >
        {{ opt.label }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>
