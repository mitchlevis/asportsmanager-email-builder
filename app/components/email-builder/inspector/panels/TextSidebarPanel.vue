<script setup lang="ts">
import type { TextProps } from '~/utils/email-builder/schemas'
import { TextPropsSchema } from '~/utils/email-builder/schemas'
import { TextInput, BooleanInput, ColorInput, FontFamilyInput, NumberInput, RadioGroupInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: TextProps }>()
const emit = defineEmits<{ 'update:data': [value: TextProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = TextPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Text block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <TextInput label="Content" :model-value="data.props?.text ?? ''" :rows="5" @update:model-value="(v: string) => update({ props: { ...data.props, text: v } })" />
      <BooleanInput label="Markdown" :model-value="data.props?.markdown ?? false" @update:model-value="(v: boolean) => update({ props: { ...data.props, markdown: v } })" />
      <ColorInput label="Text color" :model-value="data.style?.color" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, color: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <FontFamilyInput label="Font family" :model-value="data.style?.fontFamily" @update:model-value="(v: any) => update({ style: { ...data.style, fontFamily: v } })" />
      <NumberInput label="Font size" :model-value="data.style?.fontSize" @update:model-value="(v: number | null) => update({ style: { ...data.style, fontSize: v } })" />
      <RadioGroupInput label="Font weight" :model-value="data.style?.fontWeight ?? 'normal'" :options="[{ value: 'normal', label: 'Normal' }, { value: 'bold', label: 'Bold' }]" @update:model-value="(v: string) => update({ style: { ...data.style, fontWeight: v } })" />
      <RadioGroupInput label="Text align" :model-value="data.style?.textAlign ?? 'left'" :options="[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]" @update:model-value="(v: string) => update({ style: { ...data.style, textAlign: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
