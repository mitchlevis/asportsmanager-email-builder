<script setup lang="ts">
import type { HtmlProps } from '~/utils/email-builder/schemas'
import { getFontFamily } from '~/utils/email-builder/font-families'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: HtmlProps }>()

const cssStyle = computed(() => ({
  color: props.data.style?.color ?? undefined,
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  fontFamily: props.data.style?.fontFamily ? getFontFamily(props.data.style.fontFamily) : undefined,
  fontSize: props.data.style?.fontSize ? `${props.data.style.fontSize}px` : undefined,
  textAlign: (props.data.style?.textAlign ?? undefined) as 'left' | 'center' | 'right' | undefined,
  padding: getPadding(props.data.style?.padding),
}))

const contents = computed(() => props.data.props?.contents ?? '')
</script>

<template>
  <div :style="cssStyle" v-html="contents" />
</template>
