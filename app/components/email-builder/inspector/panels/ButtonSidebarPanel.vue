<script setup lang="ts">
import type { ButtonProps } from '~/utils/email-builder/schemas'
import { ButtonPropsSchema, ButtonPropsDefaults } from '~/utils/email-builder/schemas'
import { TextInput, ColorInput, RadioGroupInput, FontFamilyInput, PaddingInput } from '../inputs'

const props = defineProps<{ data: ButtonProps }>()
const emit = defineEmits<{ 'update:data': [value: ButtonProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = ButtonPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Button block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <TextInput label="Text" :model-value="data.props?.text ?? ButtonPropsDefaults.text" @update:model-value="(v: string) => update({ props: { ...data.props, text: v } })" />
      <TextInput label="URL" :model-value="data.props?.url ?? ButtonPropsDefaults.url" @update:model-value="(v: string) => update({ props: { ...data.props, url: v } })" />
      <RadioGroupInput label="Width" :model-value="(data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth) ? 'FULL_WIDTH' : 'AUTO'" :options="[{ value: 'FULL_WIDTH', label: 'Full' }, { value: 'AUTO', label: 'Auto' }]" @update:model-value="(v: string) => update({ props: { ...data.props, fullWidth: v === 'FULL_WIDTH' } })" />
      <RadioGroupInput label="Size" :model-value="data.props?.size ?? ButtonPropsDefaults.size" :options="[{ value: 'x-small', label: 'Xs' }, { value: 'small', label: 'Sm' }, { value: 'medium', label: 'Md' }, { value: 'large', label: 'Lg' }]" @update:model-value="(v: string) => update({ props: { ...data.props, size: v } })" />
      <RadioGroupInput label="Style" :model-value="data.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle" :options="[{ value: 'rectangle', label: 'Rect' }, { value: 'rounded', label: 'Round' }, { value: 'pill', label: 'Pill' }]" @update:model-value="(v: string) => update({ props: { ...data.props, buttonStyle: v } })" />
      <ColorInput label="Text color" :model-value="data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor" @update:model-value="(v: string | null) => update({ props: { ...data.props, buttonTextColor: v } })" />
      <ColorInput label="Button color" :model-value="data.props?.buttonBackgroundColor ?? ButtonPropsDefaults.buttonBackgroundColor" @update:model-value="(v: string | null) => update({ props: { ...data.props, buttonBackgroundColor: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <FontFamilyInput label="Font family" :model-value="data.style?.fontFamily" @update:model-value="(v: any) => update({ style: { ...data.style, fontFamily: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
