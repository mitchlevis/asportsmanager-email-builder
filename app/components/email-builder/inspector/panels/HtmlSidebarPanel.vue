<script setup lang="ts">
import type { HtmlProps } from '~/utils/email-builder/schemas'
import { HtmlPropsSchema } from '~/utils/email-builder/schemas'
import { TextInput, ColorInput, FontFamilyInput, NumberInput, RadioGroupInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: HtmlProps }>()
const emit = defineEmits<{ 'update:data': [value: HtmlProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = HtmlPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">HTML block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <TextInput label="HTML Contents" :model-value="data.props?.contents ?? ''" :rows="8" @update:model-value="(v: string) => update({ props: { ...data.props, contents: v } })" />
      <ColorInput label="Text color" :model-value="data.style?.color" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, color: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <FontFamilyInput label="Font family" :model-value="data.style?.fontFamily" @update:model-value="(v: any) => update({ style: { ...data.style, fontFamily: v } })" />
      <NumberInput label="Font size" :model-value="data.style?.fontSize" @update:model-value="(v: number | null) => update({ style: { ...data.style, fontSize: v } })" />
      <RadioGroupInput label="Text align" :model-value="data.style?.textAlign ?? 'left'" :options="[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]" @update:model-value="(v: string) => update({ style: { ...data.style, textAlign: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
