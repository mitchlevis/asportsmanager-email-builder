<script setup lang="ts">
import { marked } from 'marked'
import type { TextProps } from '~/utils/email-builder/schemas'
import { TextPropsDefaults } from '~/utils/email-builder/schemas'
import { getFontFamily } from '~/utils/email-builder/font-families'
import { getPadding } from '~/utils/email-builder/style-schemas'

marked.setOptions({ breaks: true, gfm: true })

const props = defineProps<{ data: TextProps }>()

const text = computed(() => props.data.props?.text ?? TextPropsDefaults.text)
const isMarkdown = computed(() => props.data.props?.markdown ?? false)

const renderedHtml = computed(() => {
  if (!isMarkdown.value) return null
  return marked.parse(text.value, { async: false }) as string
})

const wStyle = computed(() => ({
  color: props.data.style?.color ?? undefined,
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  fontSize: props.data.style?.fontSize ? `${props.data.style.fontSize}px` : undefined,
  fontFamily: props.data.style?.fontFamily ? getFontFamily(props.data.style.fontFamily) : undefined,
  fontWeight: props.data.style?.fontWeight ?? undefined,
  textAlign: (props.data.style?.textAlign ?? undefined) as 'left' | 'center' | 'right' | undefined,
  padding: getPadding(props.data.style?.padding),
}))
</script>

<template>
  <div v-if="isMarkdown" :style="wStyle" v-html="renderedHtml" />
  <div v-else :style="wStyle">{{ text }}</div>
</template>
