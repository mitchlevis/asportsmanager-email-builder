<script setup lang="ts">
import type { AvatarProps } from '~/utils/email-builder/schemas'
import { AvatarPropsSchema, AvatarPropsDefaults } from '~/utils/email-builder/schemas'
import { TextInput, SliderInput, RadioGroupInput, PaddingInput } from '../inputs'
import ImagePickerDialog from '../ImagePickerDialog.vue'

const props = defineProps<{ data: AvatarProps }>()
const emit = defineEmits<{ 'update:data': [value: AvatarProps] }>()

const showPicker = ref(false)

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = AvatarPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}

function onImageSelected(url: string) {
  update({ props: { ...props.data.props, imageUrl: url } })
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Avatar block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <div>
        <TextInput label="Image URL" :model-value="data.props?.imageUrl ?? AvatarPropsDefaults.imageUrl" @update:model-value="(v: string) => update({ props: { ...data.props, imageUrl: v } })" />
        <v-btn variant="tonal" size="small" prepend-icon="mdi-image-search" class="mt-1" block @click="showPicker = true">
          Browse Library
        </v-btn>
      </div>
      <ImagePickerDialog v-model="showPicker" @select="onImageSelected" />
      <TextInput label="Alt text" :model-value="data.props?.alt ?? AvatarPropsDefaults.alt" @update:model-value="(v: string) => update({ props: { ...data.props, alt: v } })" />
      <SliderInput label="Size" :model-value="data.props?.size ?? AvatarPropsDefaults.size" :min="16" :max="256" :step="4" units="px" @update:model-value="(v: number) => update({ props: { ...data.props, size: v } })" />
      <RadioGroupInput label="Shape" :model-value="data.props?.shape ?? AvatarPropsDefaults.shape" :options="[{ value: 'circle', label: 'Circle' }, { value: 'rounded', label: 'Rounded' }, { value: 'square', label: 'Square' }]" @update:model-value="(v: string) => update({ props: { ...data.props, shape: v } })" />
      <RadioGroupInput label="Alignment" :model-value="data.style?.textAlign ?? 'center'" :options="[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]" @update:model-value="(v: string) => update({ style: { ...data.style, textAlign: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />
    </div>
  </v-card-text>
</template>
