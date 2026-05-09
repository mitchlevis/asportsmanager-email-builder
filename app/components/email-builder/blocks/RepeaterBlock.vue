<script setup lang="ts">
import type { RepeaterProps } from '~/utils/email-builder/schemas'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = withDefaults(defineProps<{ data: RepeaterProps; itemIndex?: number }>(), {
  itemIndex: -1,
})

const wStyle = computed(() => {
  const isOdd = props.itemIndex >= 0 && props.itemIndex % 2 === 1
  const altColor = props.data.style?.backgroundAlternatingColor
  const bgColor = isOdd && altColor ? altColor : (props.data.style?.backgroundColor ?? undefined)

  return {
    backgroundColor: bgColor,
    border: props.data.style?.borderColor ? `1px solid ${props.data.style.borderColor}` : undefined,
    borderRadius: props.data.style?.borderRadius ? `${props.data.style.borderRadius}px` : undefined,
    padding: getPadding(props.data.style?.padding),
  }
})
</script>

<template>
  <div :style="wStyle">
    <slot />
  </div>
</template>
