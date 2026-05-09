<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import EditorBlockWrapper from './EditorBlockWrapper.vue'
import EmailLayoutEditor from './blocks/EmailLayoutEditor.vue'
import ContainerEditor from './blocks/ContainerEditor.vue'
import ColumnsContainerEditor from './blocks/ColumnsContainerEditor.vue'
import RepeaterEditor from './blocks/RepeaterEditor.vue'
import AvatarBlock from '~/components/email-builder/blocks/AvatarBlock.vue'
import ButtonBlock from '~/components/email-builder/blocks/ButtonBlock.vue'
import DividerBlock from '~/components/email-builder/blocks/DividerBlock.vue'
import HeadingBlock from '~/components/email-builder/blocks/HeadingBlock.vue'
import HtmlBlock from '~/components/email-builder/blocks/HtmlBlock.vue'
import ImageBlock from '~/components/email-builder/blocks/ImageBlock.vue'
import SpacerBlock from '~/components/email-builder/blocks/SpacerBlock.vue'
import TextBlock from '~/components/email-builder/blocks/TextBlock.vue'

defineOptions({ name: 'EditorBlock' })

const props = defineProps<{ id: string }>()

const store = useEmailEditor()

provide('currentBlockId', props.id)

const block = computed(() => store.document[props.id])
</script>

<template>
  <template v-if="block">
    <EmailLayoutEditor
      v-if="block.type === 'EmailLayout'"
      :data="block.data as any"
    />

    <EditorBlockWrapper v-else-if="block.type === 'Container'">
      <ContainerEditor :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'ColumnsContainer'">
      <ColumnsContainerEditor :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Repeater'">
      <RepeaterEditor :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Avatar'">
      <AvatarBlock :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Button'">
      <ButtonBlock :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Divider'">
      <DividerBlock :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Heading'">
      <HeadingBlock :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Html'">
      <HtmlBlock :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Image'">
      <ImageBlock
        :data="{
          ...block.data as any,
          props: {
            ...(block.data as any).props,
            url: (block.data as any).props?.url || 'https://placehold.co/600x400@2x/F8F8F8/CCC?text=Your%20image',
          },
        }"
      />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Spacer'">
      <SpacerBlock :data="block.data as any" />
    </EditorBlockWrapper>

    <EditorBlockWrapper v-else-if="block.type === 'Text'">
      <TextBlock :data="block.data as any" />
    </EditorBlockWrapper>
  </template>
</template>
