<script setup lang="ts">
import type { DividerProps } from '~/utils/email-builder/schemas'
import { DividerPropsSchema, DividerPropsDefaults } from '~/utils/email-builder/schemas'
import { ColorInput, SliderInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: DividerProps }>()
const emit = defineEmits<{ 'update:data': [value: DividerProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = DividerPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Divider block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ColorInput label="Line color" :model-value="data.props?.lineColor ?? DividerPropsDefaults.lineColor" @update:model-value="(v: string | null) => update({ props: { ...data.props, lineColor: v } })" />
      <SliderInput label="Line height" :model-value="data.props?.lineHeight ?? DividerPropsDefaults.lineHeight" :min="1" :max="8" :step="1" units="px" @update:model-value="(v: number) => update({ props: { ...data.props, lineHeight: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
