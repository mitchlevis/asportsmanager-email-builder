<script setup lang="ts">
import type { SpacerProps } from '~/utils/email-builder/schemas'
import { SpacerPropsDefaults } from '~/utils/email-builder/schemas'

const props = defineProps<{ data: SpacerProps }>()

const spacerHeight = computed(() => props.data.props?.height ?? SpacerPropsDefaults.height)
</script>

<template>
  <div :style="{ height: `${spacerHeight}px` }" />
</template>
