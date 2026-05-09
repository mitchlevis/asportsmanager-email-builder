<script setup lang="ts">
import type { HeadingProps } from '~/utils/email-builder/schemas'
import { HeadingPropsSchema, HeadingPropsDefaults } from '~/utils/email-builder/schemas'
import { TextInput, ColorInput, FontFamilyInput, RadioGroupInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: HeadingProps }>()
const emit = defineEmits<{ 'update:data': [value: HeadingProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = HeadingPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Heading block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <TextInput label="Text" :model-value="data.props?.text ?? HeadingPropsDefaults.text" @update:model-value="(v: string) => update({ props: { ...data.props, text: v } })" />
      <RadioGroupInput label="Level" :model-value="data.props?.level ?? HeadingPropsDefaults.level" :options="[{ value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' }]" @update:model-value="(v: string) => update({ props: { ...data.props, level: v } })" />
      <ColorInput label="Text color" :model-value="data.style?.color" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, color: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <FontFamilyInput label="Font family" :model-value="data.style?.fontFamily" @update:model-value="(v: any) => update({ style: { ...data.style, fontFamily: v } })" />
      <RadioGroupInput label="Font weight" :model-value="data.style?.fontWeight ?? 'bold'" :options="[{ value: 'normal', label: 'Normal' }, { value: 'bold', label: 'Bold' }]" @update:model-value="(v: string) => update({ style: { ...data.style, fontWeight: v } })" />
      <RadioGroupInput label="Text align" :model-value="data.style?.textAlign ?? 'left'" :options="[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]" @update:model-value="(v: string) => update({ style: { ...data.style, textAlign: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
