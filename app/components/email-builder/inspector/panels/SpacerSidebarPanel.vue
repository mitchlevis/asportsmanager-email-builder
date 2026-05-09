<script setup lang="ts">
import type { SpacerProps } from '~/utils/email-builder/schemas'
import { SpacerPropsSchema, SpacerPropsDefaults } from '~/utils/email-builder/schemas'
import { SliderInput } from '../inputs'

const props = defineProps<{ data: SpacerProps }>()
const emit = defineEmits<{ 'update:data': [value: SpacerProps] }>()

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = SpacerPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Spacer block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <SliderInput label="Height" :model-value="data.props?.height ?? SpacerPropsDefaults.height" :min="0" :max="128" :step="4" units="px" @update:model-value="(v: number) => update({ props: { ...data.props, height: v } })" />
    </div>
  </v-card-text>
</template>
