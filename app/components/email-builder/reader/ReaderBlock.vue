<script setup lang="ts">
import { defineComponent } from 'vue'
import type { TEditorDocument } from '~/types/email-builder'
import { useEmailEditor } from '~/composables/useEmailEditor'
import EmailLayoutBlock from '~/components/email-builder/blocks/EmailLayoutBlock.vue'
import ContainerBlock from '~/components/email-builder/blocks/ContainerBlock.vue'
import ColumnsContainerBlock from '~/components/email-builder/blocks/ColumnsContainerBlock.vue'
import RepeaterBlock from '~/components/email-builder/blocks/RepeaterBlock.vue'
import AvatarBlock from '~/components/email-builder/blocks/AvatarBlock.vue'
import ButtonBlock from '~/components/email-builder/blocks/ButtonBlock.vue'
import DividerBlock from '~/components/email-builder/blocks/DividerBlock.vue'
import HeadingBlock from '~/components/email-builder/blocks/HeadingBlock.vue'
import HtmlBlock from '~/components/email-builder/blocks/HtmlBlock.vue'
import ImageBlock from '~/components/email-builder/blocks/ImageBlock.vue'
import SpacerBlock from '~/components/email-builder/blocks/SpacerBlock.vue'
import TextBlock from '~/components/email-builder/blocks/TextBlock.vue'

defineOptions({ name: 'ReaderBlock' })

const props = defineProps<{ id: string }>()

const store = useEmailEditor()
const document = inject<Ref<TEditorDocument>>('readerDocument')
const repeaterContext = inject<Ref<Record<string, unknown>>>('repeaterContext', ref({}))
const repeaterItemIndex = inject<Ref<number>>('repeaterItemIndex', ref(-1))

const block = computed(() => document?.value?.[props.id])

const childrenIds = computed(() => {
  if (!block.value) return []
  const data = block.value.data as Record<string, unknown>
  return (data.childrenIds ?? (data.props as Record<string, unknown>)?.childrenIds ?? []) as string[]
})

const columns = computed(() => {
  if (!block.value || block.value.type !== 'ColumnsContainer') return []
  const data = block.value.data as Record<string, unknown>
  const p = data.props as Record<string, unknown> | undefined
  return (p?.columns ?? []) as { childrenIds: string[] }[]
})

const repeaterVarName = computed(() => {
  if (!block.value || block.value.type !== 'Repeater') return ''
  const dv = (block.value.data as any)?.props?.dataVariable ?? ''
  return dv.replace(/^\{\{|\}\}$/g, '')
})

const repeaterPreviewItems = computed(() => {
  if (!block.value || block.value.type !== 'Repeater') return null
  const manual = store.repeaterPreviewData[props.id]
  if (manual) return manual

  const varName = repeaterVarName.value
  if (!varName) return null

  const dotIdx = varName.lastIndexOf('.')
  if (dotIdx === -1) return null

  const parentVar = varName.substring(0, dotIdx)
  const childProp = varName.substring(dotIdx + 1)
  const parentItem = repeaterContext.value[parentVar]
  if (!parentItem || typeof parentItem !== 'object') return null

  const items = (parentItem as Record<string, unknown>)[childProp]
  return Array.isArray(items) ? items : null
})

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function substituteVars(text: string, varName: string, item: unknown): string {
  let result = text
  const escaped = escapeRegExp(varName)
  if (typeof item === 'object' && item !== null) {
    const re = new RegExp(`\\{\\{${escaped}\\.(\\w+)\\}\\}`, 'g')
    result = result.replace(re, (_, field: string) => {
      const val = (item as Record<string, unknown>)[field]
      return val !== undefined && val !== null ? String(val) : ''
    })
  }
  result = result.replace(new RegExp(`\\{\\{${escaped}\\}\\}`, 'g'), String(item ?? ''))
  return result
}

const substitutedBlockData = computed(() => {
  if (!block.value) return null
  if (block.value.type === 'Repeater') return block.value.data
  const ctx = repeaterContext.value
  if (Object.keys(ctx).length === 0) return block.value.data

  return JSON.parse(JSON.stringify(block.value.data), (_, value) => {
    if (typeof value !== 'string') return value
    let result = value
    for (const [varName, item] of Object.entries(ctx)) {
      result = substituteVars(result, varName, item)
    }
    return result
  })
})

const RepeaterItemProvider = defineComponent({
  props: {
    varName: { type: String, required: true },
    item: { type: [Object, String, Number, Boolean, Array], default: null },
    itemIndex: { type: Number, default: -1 },
  },
  setup(providerProps, { slots }) {
    const parentCtx = inject<Ref<Record<string, unknown>>>('repeaterContext', ref({}))
    const merged = computed(() => ({
      ...parentCtx.value,
      [providerProps.varName]: providerProps.item,
    }))
    provide('repeaterContext', merged)
    provide('repeaterItemIndex', computed(() => providerProps.itemIndex))
    return () => slots.default?.()
  },
})
</script>

<template>
  <template v-if="block">
    <EmailLayoutBlock v-if="block.type === 'EmailLayout'" :data="substitutedBlockData as any">
      <ReaderBlock v-for="childId in childrenIds" :key="childId" :id="childId" />
    </EmailLayoutBlock>

    <ContainerBlock v-else-if="block.type === 'Container'" :data="substitutedBlockData as any">
      <ReaderBlock v-for="childId in childrenIds" :key="childId" :id="childId" />
    </ContainerBlock>

    <ColumnsContainerBlock v-else-if="block.type === 'ColumnsContainer'" :data="substitutedBlockData as any">
      <template v-for="(col, colIndex) in columns" :key="colIndex" #[`column-${colIndex}`]>
        <ReaderBlock v-for="childId in col.childrenIds" :key="childId" :id="childId" />
      </template>
    </ColumnsContainerBlock>

    <template v-else-if="block.type === 'Repeater'">
      <template v-if="repeaterPreviewItems">
        <RepeaterBlock v-for="(item, idx) in repeaterPreviewItems" :key="idx" :data="block.data as any" :item-index="idx">
          <RepeaterItemProvider :var-name="repeaterVarName" :item="item" :item-index="idx">
            <ReaderBlock v-for="childId in childrenIds" :key="childId" :id="childId" />
          </RepeaterItemProvider>
        </RepeaterBlock>
      </template>
      <RepeaterBlock v-else :data="block.data as any">
        <ReaderBlock v-for="childId in childrenIds" :key="childId" :id="childId" />
      </RepeaterBlock>
    </template>

    <AvatarBlock v-else-if="block.type === 'Avatar'" :data="substitutedBlockData as any" />
    <ButtonBlock v-else-if="block.type === 'Button'" :data="substitutedBlockData as any" />
    <DividerBlock v-else-if="block.type === 'Divider'" :data="substitutedBlockData as any" />
    <HeadingBlock v-else-if="block.type === 'Heading'" :data="substitutedBlockData as any" />
    <HtmlBlock v-else-if="block.type === 'Html'" :data="substitutedBlockData as any" />
    <ImageBlock v-else-if="block.type === 'Image'" :data="substitutedBlockData as any" />
    <SpacerBlock v-else-if="block.type === 'Spacer'" :data="substitutedBlockData as any" />
    <TextBlock v-else-if="block.type === 'Text'" :data="substitutedBlockData as any" />
  </template>
</template>
