<script setup lang="ts">
import type { ButtonProps } from '~/utils/email-builder/schemas'
import { ButtonPropsDefaults } from '~/utils/email-builder/schemas'
import { getFontFamily } from '~/utils/email-builder/font-families'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: ButtonProps }>()

const text = computed(() => props.data.props?.text ?? ButtonPropsDefaults.text)
const url = computed(() => props.data.props?.url ?? ButtonPropsDefaults.url)
const fullWidth = computed(() => props.data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth)
const buttonTextColor = computed(() => props.data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor)
const buttonBg = computed(() => props.data.props?.buttonBackgroundColor ?? ButtonPropsDefaults.buttonBackgroundColor)
const bStyle = computed(() => props.data.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle)
const size = computed(() => props.data.props?.size ?? ButtonPropsDefaults.size)

const borderRadiusValue = computed(() => {
  if (bStyle.value === 'rectangle') return undefined
  if (bStyle.value === 'pill') return '64px'
  return '4px'
})

const sizePadding = computed(() => {
  switch (size.value) {
    case 'x-small': return [4, 8]
    case 'small': return [8, 12]
    case 'large': return [16, 32]
    default: return [12, 20]
  }
})

const msoRaise = computed(() => (sizePadding.value[1] * 2 * 3) / 4)

const wrapperStyle = computed(() => ({
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  textAlign: (props.data.style?.textAlign ?? undefined) as 'left' | 'center' | 'right' | undefined,
  padding: getPadding(props.data.style?.padding),
}))

const linkStyle = computed(() => ({
  color: buttonTextColor.value,
  fontSize: `${props.data.style?.fontSize ?? 16}px`,
  fontFamily: props.data.style?.fontFamily ? getFontFamily(props.data.style.fontFamily) : undefined,
  fontWeight: props.data.style?.fontWeight ?? 'bold',
  backgroundColor: buttonBg.value,
  borderRadius: borderRadiusValue.value,
  display: fullWidth.value ? 'block' : 'inline-block',
  padding: `${sizePadding.value[0]}px ${sizePadding.value[1]}px`,
  textDecoration: 'none',
}))

const msoStartHtml = computed(() =>
  `<!--[if mso]><i style="letter-spacing: ${sizePadding.value[1]}px;mso-font-width:-100%;mso-text-raise:${msoRaise.value}" hidden>&nbsp;</i><![endif]-->`
)
const msoEndHtml = computed(() =>
  `<!--[if mso]><i style="letter-spacing: ${sizePadding.value[1]}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`
)
</script>

<template>
  <div :style="wrapperStyle">
    <a :href="url" :style="linkStyle" target="_blank">
      <span v-html="msoStartHtml" />
      <span>{{ text }}</span>
      <span v-html="msoEndHtml" />
    </a>
  </div>
</template>
