<script setup lang="ts">
import type { ContainerProps } from '~/utils/email-builder/schemas'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: ContainerProps }>()

const wStyle = computed(() => ({
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  border: props.data.style?.borderColor ? `1px solid ${props.data.style.borderColor}` : undefined,
  borderRadius: props.data.style?.borderRadius ? `${props.data.style.borderRadius}px` : undefined,
  padding: getPadding(props.data.style?.padding),
}))
</script>

<template>
  <div :style="wStyle">
    <slot />
  </div>
</template>
