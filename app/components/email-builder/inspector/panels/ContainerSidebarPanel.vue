<script setup lang="ts">
import type { ContainerProps } from '~/utils/email-builder/schemas'
import { ContainerPropsSchema } from '~/utils/email-builder/schemas'
import { ColorInput, SliderInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: ContainerProps }>()
const emit = defineEmits<{ 'update:data': [value: ContainerProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = ContainerPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Container block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <ColorInput label="Border color" :model-value="data.style?.borderColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, borderColor: v } })" />
      <SliderInput label="Border radius" :model-value="data.style?.borderRadius ?? 0" :min="0" :max="48" :step="4" units="px" @update:model-value="(v: number) => update({ style: { ...data.style, borderRadius: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
