<script setup lang="ts">
import type { ColumnsContainerProps } from '~/utils/email-builder/schemas'
import { ColumnsContainerPropsSchema, ColumnsContainerPropsDefaults } from '~/utils/email-builder/schemas'
import { RadioGroupInput, SliderInput, ColorInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: ColumnsContainerProps }>()
const emit = defineEmits<{ 'update:data': [value: ColumnsContainerProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = ColumnsContainerPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Columns block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <RadioGroupInput label="Columns" :model-value="String(data.props?.columnsCount ?? ColumnsContainerPropsDefaults.columnsCount)" :options="[{ value: '2', label: '2' }, { value: '3', label: '3' }]" @update:model-value="(v: string) => update({ props: { ...data.props, columnsCount: Number(v) } })" />
      <SliderInput label="Gap" :model-value="data.props?.columnsGap ?? ColumnsContainerPropsDefaults.columnsGap" :min="0" :max="64" :step="4" units="px" @update:model-value="(v: number) => update({ props: { ...data.props, columnsGap: v } })" />
      <RadioGroupInput label="Vertical alignment" :model-value="data.props?.contentAlignment ?? ColumnsContainerPropsDefaults.contentAlignment" :options="[{ value: 'top', label: 'Top' }, { value: 'middle', label: 'Middle' }, { value: 'bottom', label: 'Bottom' }]" @update:model-value="(v: string) => update({ props: { ...data.props, contentAlignment: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
