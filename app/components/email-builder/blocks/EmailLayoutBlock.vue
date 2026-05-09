<script setup lang="ts">
import type { EmailLayoutProps } from '~/utils/email-builder/schemas'
import { getFontFamily } from '~/utils/email-builder/font-families'

const props = defineProps<{ data: EmailLayoutProps }>()

const fontFamilyValue = computed(() =>
  getFontFamily(props.data.fontFamily) ?? '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif'
)

const outerStyle = computed(() => ({
  backgroundColor: props.data.backdropColor ?? '#F5F5F5',
  color: props.data.textColor ?? '#262626',
  fontFamily: fontFamilyValue.value,
  fontSize: '16px',
  fontWeight: '400',
  letterSpacing: '0.15008px',
  lineHeight: '1.5',
  margin: '0',
  padding: '32px 0',
  minHeight: '100%',
  width: '100%',
}))

const tableStyle = computed(() => ({
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: props.data.canvasColor ?? '#FFFFFF',
  borderRadius: props.data.borderRadius ? `${props.data.borderRadius}px` : undefined,
  border: props.data.borderColor ? `1px solid ${props.data.borderColor}` : undefined,
}))
</script>

<template>
  <div :style="outerStyle">
    <table
      align="center"
      width="100%"
      :style="tableStyle"
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <slot />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
