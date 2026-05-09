<script setup lang="ts">
import type { EmailLayoutProps } from '~/utils/email-builder/schemas'
import type { TEditorBlock } from '~/types/email-builder'
import { getFontFamily } from '~/utils/email-builder/font-families'
import { useEmailEditor } from '~/composables/useEmailEditor'
import EditorChildrenIds from '../EditorChildrenIds.vue'

const props = defineProps<{ data: EmailLayoutProps }>()

const store = useEmailEditor()
const currentBlockId = inject<string>('currentBlockId', 'root')

const childrenIds = computed(() => props.data.childrenIds ?? [])

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
  width: '100%',
  minHeight: '100%',
}))

const tableStyle = computed(() => ({
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: props.data.canvasColor ?? '#FFFFFF',
  borderRadius: props.data.borderRadius ? `${props.data.borderRadius}px` : undefined,
  border: props.data.borderColor ? `1px solid ${props.data.borderColor}` : undefined,
}))

function onBackdropClick() {
  store.setSelectedBlockId(null)
}

function onChildrenChange(payload: { blockId: string; block: TEditorBlock; childrenIds: string[] }) {
  store.setDocument({
    [payload.blockId]: payload.block,
    [currentBlockId]: {
      type: 'EmailLayout',
      data: {
        ...props.data,
        childrenIds: payload.childrenIds,
      },
    },
  })
  store.setSelectedBlockId(payload.blockId)
}
</script>

<template>
  <div :style="outerStyle" @click="onBackdropClick">
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
            <EditorChildrenIds
              :children-ids="childrenIds"
              @change="onChildrenChange"
            />
            <div
              v-if="(!childrenIds || childrenIds.length === 0) && store.canCopyFromEnglish"
              style="text-align: center; padding: 0 16px 16px"
            >
              <a
                href="#"
                style="color: #1565C0; font-size: 14px"
                @click.prevent="store.copyFromEnglish()"
              >or Copy English Version</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
