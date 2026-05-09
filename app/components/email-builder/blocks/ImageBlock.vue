<script setup lang="ts">
import type { ImageProps } from '~/utils/email-builder/schemas'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: ImageProps }>()

const url = computed(() => props.data.props?.url ?? '')
const alt = computed(() => props.data.props?.alt ?? '')
const width = computed(() => props.data.props?.width ?? undefined)
const height = computed(() => props.data.props?.height ?? undefined)
const linkHref = computed(() => props.data.props?.linkHref ?? null)
const contentAlignment = computed(() => props.data.props?.contentAlignment ?? 'middle')

const sectionStyle = computed(() => ({
  padding: getPadding(props.data.style?.padding),
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  textAlign: (props.data.style?.textAlign ?? undefined) as 'left' | 'center' | 'right' | undefined,
}))

const imgStyle = computed(() => ({
  outline: 'none',
  border: 'none',
  textDecoration: 'none',
  verticalAlign: contentAlignment.value,
  display: 'inline-block',
  maxWidth: '100%',
  width: width.value ? `${width.value}px` : undefined,
  height: height.value ? `${height.value}px` : undefined,
}))
</script>

<template>
  <div :style="sectionStyle">
    <a v-if="linkHref" :href="linkHref" style="text-decoration: none" target="_blank">
      <img :alt="alt" :src="url" :width="width" :height="height" :style="imgStyle" />
    </a>
    <img v-else :alt="alt" :src="url" :width="width" :height="height" :style="imgStyle" />
  </div>
</template>
