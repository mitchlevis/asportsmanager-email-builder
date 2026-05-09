<script setup lang="ts">
import type { EmailLayoutProps } from '~/utils/email-builder/schemas'
import { EmailLayoutPropsSchema } from '~/utils/email-builder/schemas'
import { ColorInput, SliderInput, FontFamilyInput } from '../inputs'

const props = defineProps<{ data: EmailLayoutProps }>()
const emit = defineEmits<{ 'update:data': [value: EmailLayoutProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = EmailLayoutPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Global</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ColorInput label="Backdrop color" :model-value="data.backdropColor ?? '#F5F5F5'" @update:model-value="(v: string | null) => update({ backdropColor: v })" />
      <ColorInput label="Canvas color" :model-value="data.canvasColor ?? '#FFFFFF'" @update:model-value="(v: string | null) => update({ canvasColor: v })" />
      <ColorInput label="Canvas border color" :model-value="data.borderColor" nullable @update:model-value="(v: string | null) => update({ borderColor: v })" />
      <SliderInput label="Canvas border radius" :model-value="data.borderRadius ?? 0" :min="0" :max="48" :step="4" units="px" @update:model-value="(v: number) => update({ borderRadius: v })" />
      <FontFamilyInput label="Font family" :model-value="data.fontFamily" @update:model-value="(v: any) => update({ fontFamily: v })" />
      <ColorInput label="Text color" :model-value="data.textColor ?? '#262626'" @update:model-value="(v: string | null) => update({ textColor: v })" />
    </div>
  </v-card-text>
</template>
