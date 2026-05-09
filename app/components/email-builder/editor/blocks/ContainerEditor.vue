<script setup lang="ts">
import type { ContainerProps } from '~/utils/email-builder/schemas'
import type { TEditorBlock } from '~/types/email-builder'
import { getPadding } from '~/utils/email-builder/style-schemas'
import { useEmailEditor } from '~/composables/useEmailEditor'
import EditorChildrenIds from '../EditorChildrenIds.vue'

const props = defineProps<{ data: ContainerProps }>()

const store = useEmailEditor()
const currentBlockId = inject<string>('currentBlockId', '')

const childrenIds = computed(() => props.data.props?.childrenIds ?? [])

const wStyle = computed(() => ({
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  border: props.data.style?.borderColor ? `1px solid ${props.data.style.borderColor}` : undefined,
  borderRadius: props.data.style?.borderRadius ? `${props.data.style.borderRadius}px` : undefined,
  padding: getPadding(props.data.style?.padding),
}))

function onChildrenChange(payload: { blockId: string; block: TEditorBlock; childrenIds: string[] }) {
  store.setDocument({
    [payload.blockId]: payload.block,
    [currentBlockId]: {
      type: 'Container',
      data: {
        ...props.data,
        props: { childrenIds: payload.childrenIds },
      },
    },
  })
  store.setSelectedBlockId(payload.blockId)
}
</script>

<template>
  <div :style="wStyle">
    <EditorChildrenIds
      :children-ids="childrenIds"
      @change="onChildrenChange"
    />
  </div>
</template>
