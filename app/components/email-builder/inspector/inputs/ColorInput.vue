<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string | null | undefined
  nullable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const menuOpen = ref(false)
const localValue = ref(props.modelValue ?? '#000000')

watch(() => props.modelValue, (v) => {
  if (v) localValue.value = v
})

function onColorChange(val: string) {
  localValue.value = val
  emit('update:modelValue', val)
}

function clearColor() {
  emit('update:modelValue', null)
  menuOpen.value = false
}
</script>

<template>
  <div>
    <v-label class="text-caption mb-1">{{ label }}</v-label>
    <div style="display: flex; align-items: center; gap: 8px">
      <div
        :style="{
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          backgroundColor: modelValue ?? '#FFFFFF',
          cursor: 'pointer',
          flexShrink: 0,
        }"
        @click="menuOpen = !menuOpen"
      />
      <v-text-field
        :model-value="modelValue ?? ''"
        variant="outlined"
        density="compact"
        hide-details
        placeholder="#000000"
        style="max-width: 140px"
        @update:model-value="(v: string) => { if (/^#[0-9a-fA-F]{6}$/.test(v)) emit('update:modelValue', v) }"
      />
      <v-btn
        v-if="nullable && modelValue"
        size="x-small"
        icon
        variant="text"
        @click="clearColor"
      >
        <v-icon size="14">mdi-close</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="menuOpen" max-width="300">
      <v-card class="pa-4">
        <v-color-picker
          :model-value="localValue"
          mode="hex"
          hide-inputs
          @update:model-value="onColorChange"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn size="small" @click="menuOpen = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
