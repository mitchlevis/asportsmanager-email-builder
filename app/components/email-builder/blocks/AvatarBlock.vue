<script setup lang="ts">
import type { AvatarProps } from '~/utils/email-builder/schemas'
import { AvatarPropsDefaults } from '~/utils/email-builder/schemas'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: AvatarProps }>()

const size = computed(() => props.data.props?.size ?? AvatarPropsDefaults.size)
const imageUrl = computed(() => props.data.props?.imageUrl ?? AvatarPropsDefaults.imageUrl)
const alt = computed(() => props.data.props?.alt ?? AvatarPropsDefaults.alt)
const shape = computed(() => props.data.props?.shape ?? AvatarPropsDefaults.shape)

const borderRadius = computed(() => {
  if (shape.value === 'circle') return `${size.value}px`
  if (shape.value === 'rounded') return `${size.value * 0.125}px`
  return undefined
})

const sectionStyle = computed(() => ({
  textAlign: (props.data.style?.textAlign ?? undefined) as 'left' | 'center' | 'right' | undefined,
  padding: getPadding(props.data.style?.padding),
}))

const imgStyle = computed(() => ({
  outline: 'none',
  border: 'none',
  textDecoration: 'none',
  objectFit: 'cover' as const,
  height: `${size.value}px`,
  width: `${size.value}px`,
  maxWidth: '100%',
  display: 'inline-block',
  verticalAlign: 'middle',
  textAlign: 'center' as const,
  borderRadius: borderRadius.value,
}))
</script>

<template>
  <div :style="sectionStyle">
    <img
      :alt="alt"
      :src="imageUrl"
      :height="size"
      :width="size"
      :style="imgStyle"
    />
  </div>
</template>
