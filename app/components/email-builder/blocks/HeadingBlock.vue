<script setup lang="ts">
import type { HeadingProps } from '~/utils/email-builder/schemas'
import { HeadingPropsDefaults } from '~/utils/email-builder/schemas'
import { getFontFamily } from '~/utils/email-builder/font-families'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: HeadingProps }>()

const level = computed(() => props.data.props?.level ?? HeadingPropsDefaults.level)
const text = computed(() => props.data.props?.text ?? HeadingPropsDefaults.text)

const fontSize = computed(() => {
  switch (level.value) {
    case 'h1': return 32
    case 'h3': return 20
    default: return 24
  }
})

const hStyle = computed(() => ({
  color: props.data.style?.color ?? undefined,
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  fontWeight: props.data.style?.fontWeight ?? 'bold',
  textAlign: (props.data.style?.textAlign ?? undefined) as 'left' | 'center' | 'right' | undefined,
  margin: '0',
  fontFamily: props.data.style?.fontFamily ? getFontFamily(props.data.style.fontFamily) : undefined,
  fontSize: `${fontSize.value}px`,
  padding: getPadding(props.data.style?.padding),
}))
</script>

<template>
  <component :is="level" :style="hStyle">{{ text }}</component>
</template>
