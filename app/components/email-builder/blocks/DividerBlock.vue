<script setup lang="ts">
import type { DividerProps } from '~/utils/email-builder/schemas'
import { DividerPropsDefaults } from '~/utils/email-builder/schemas'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: DividerProps }>()

const lineHeight = computed(() => props.data.props?.lineHeight ?? DividerPropsDefaults.lineHeight)
const lineColor = computed(() => props.data.props?.lineColor ?? DividerPropsDefaults.lineColor)

const wrapperStyle = computed(() => ({
  padding: getPadding(props.data.style?.padding),
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
}))

const hrStyle = computed(() => ({
  width: '100%',
  border: 'none',
  borderTop: `${lineHeight.value}px solid ${lineColor.value}`,
  margin: '0',
}))
</script>

<template>
  <div :style="wrapperStyle">
    <hr :style="hrStyle" />
  </div>
</template>
