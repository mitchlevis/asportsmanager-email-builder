<script setup lang="ts">
import type { RepeaterProps } from '~/utils/email-builder/schemas'
import type { TEditorBlock } from '~/types/email-builder'
import { getPadding } from '~/utils/email-builder/style-schemas'
import { useEmailEditor } from '~/composables/useEmailEditor'
import EditorChildrenIds from '../EditorChildrenIds.vue'

const props = defineProps<{ data: RepeaterProps }>()

const store = useEmailEditor()
const currentBlockId = inject<string>('currentBlockId', '')

const childrenIds = computed(() => props.data.props?.childrenIds ?? [])
const dataVariable = computed(() => props.data.props?.dataVariable || '')

const wStyle = computed(() => ({
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  border: props.data.style?.borderColor ? `1px solid ${props.data.style.borderColor}` : '1px dashed rgba(0, 121, 204, 0.3)',
  borderRadius: props.data.style?.borderRadius ? `${props.data.style.borderRadius}px` : undefined,
  padding: getPadding(props.data.style?.padding),
}))

function onChildrenChange(payload: { blockId: string; block: TEditorBlock; childrenIds: string[] }) {
  store.setDocument({
    [payload.blockId]: payload.block,
    [currentBlockId]: {
      type: 'Repeater',
      data: {
        ...props.data,
        props: { ...props.data.props, childrenIds: payload.childrenIds },
      },
    },
  })
  store.setSelectedBlockId(payload.blockId)
}
</script>

<template>
  <div :style="wStyle">
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        marginBottom: '4px',
        fontSize: '11px',
        color: 'rgba(0, 121, 204, 0.8)',
        userSelect: 'none',
      }"
    >
      <v-icon size="14" color="rgba(0, 121, 204, 0.8)">mdi-repeat</v-icon>
      <span v-if="dataVariable">Repeats over: <strong>{{ dataVariable }}</strong></span>
      <span v-else style="font-style: italic; opacity: 0.6">No variable set</span>
    </div>
    <EditorChildrenIds
      :children-ids="childrenIds"
      @change="onChildrenChange"
    />
  </div>
</template>
