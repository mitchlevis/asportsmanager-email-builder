<script setup lang="ts">
import type { ImageProps } from '~/utils/email-builder/schemas'
import { ImagePropsSchema } from '~/utils/email-builder/schemas'
import { TextInput, ColorInput, RadioGroupInput, NumberInput, PaddingInput } from '../inputs'
import ImagePickerDialog from '../ImagePickerDialog.vue'

const props = defineProps<{ data: ImageProps }>()
const emit = defineEmits<{ 'update:data': [value: ImageProps] }>()

const showPicker = ref(false)

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = ImagePropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}

function onImageSelected(url: string) {
  update({ props: { ...props.data.props, url } })
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Image block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <div>
        <TextInput label="Source URL" :model-value="data.props?.url ?? ''" @update:model-value="(v: string) => update({ props: { ...data.props, url: v.trim() || null } })" />
        <v-btn variant="tonal" size="small" prepend-icon="mdi-image-search" class="mt-1" block @click="showPicker = true">
          Browse Library
        </v-btn>
      </div>
      <ImagePickerDialog v-model="showPicker" @select="onImageSelected" />
      <TextInput label="Alt text" :model-value="data.props?.alt ?? ''" @update:model-value="(v: string) => update({ props: { ...data.props, alt: v } })" />
      <TextInput label="Click through URL" :model-value="data.props?.linkHref ?? ''" @update:model-value="(v: string) => update({ props: { ...data.props, linkHref: v.trim() || null } })" />
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
        <NumberInput label="Width" :model-value="data.props?.width" @update:model-value="(v: number | null) => update({ props: { ...data.props, width: v } })" />
        <NumberInput label="Height" :model-value="data.props?.height" @update:model-value="(v: number | null) => update({ props: { ...data.props, height: v } })" />
      </div>
      <RadioGroupInput label="Alignment" :model-value="data.props?.contentAlignment ?? 'middle'" :options="[{ value: 'top', label: 'Top' }, { value: 'middle', label: 'Mid' }, { value: 'bottom', label: 'Bot' }]" @update:model-value="(v: string) => update({ props: { ...data.props, contentAlignment: v } })" />
      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <RadioGroupInput label="Text align" :model-value="data.style?.textAlign ?? 'center'" :options="[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]" @update:model-value="(v: string) => update({ style: { ...data.style, textAlign: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
