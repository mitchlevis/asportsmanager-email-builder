<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string
  rows?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)
watch(() => props.modelValue, (v) => { localValue.value = v })

function onInput(val: string) {
  localValue.value = val
  emit('update:modelValue', val)
}
</script>

<template>
  <v-textarea
    v-if="rows && rows > 1"
    :label="label"
    :model-value="localValue"
    :rows="rows"
    variant="outlined"
    density="compact"
    hide-details
    @update:model-value="onInput"
  />
  <v-text-field
    v-else
    :label="label"
    :model-value="localValue"
    variant="outlined"
    density="compact"
    hide-details
    @update:model-value="onInput"
  />
</template>
