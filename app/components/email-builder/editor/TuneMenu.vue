<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'

const props = defineProps<{ blockId: string }>()
const store = useEmailEditor()

function findParentBlockId(): { parentId: string; childrenIds: string[]; key: string } | null {
  for (const [id, block] of Object.entries(store.document)) {
    const data = block.data as Record<string, unknown>
    const directChildren = data.childrenIds as string[] | undefined
    if (directChildren?.includes(props.blockId)) {
      return { parentId: id, childrenIds: directChildren, key: 'childrenIds' }
    }
    const propsChildren = (data.props as Record<string, unknown>)?.childrenIds as string[] | undefined
    if (propsChildren?.includes(props.blockId)) {
      return { parentId: id, childrenIds: propsChildren, key: 'props.childrenIds' }
    }
    const columns = (data.props as Record<string, unknown>)?.columns as { childrenIds: string[] }[] | undefined
    if (columns) {
      for (let ci = 0; ci < columns.length; ci++) {
        if (columns[ci].childrenIds.includes(props.blockId)) {
          return { parentId: id, childrenIds: columns[ci].childrenIds, key: `props.columns.${ci}.childrenIds` }
        }
      }
    }
  }
  return null
}

function moveBlock(direction: -1 | 1) {
  const parent = findParentBlockId()
  if (!parent) return
  const idx = parent.childrenIds.indexOf(props.blockId)
  const newIdx = idx + direction
  if (newIdx < 0 || newIdx >= parent.childrenIds.length) return

  const newChildren = [...parent.childrenIds]
  ;[newChildren[idx], newChildren[newIdx]] = [newChildren[newIdx], newChildren[idx]]

  const parentBlock = store.document[parent.parentId]
  const parentData = { ...parentBlock.data } as Record<string, unknown>

  if (parent.key === 'childrenIds') {
    parentData.childrenIds = newChildren
  } else if (parent.key === 'props.childrenIds') {
    parentData.props = { ...(parentData.props as Record<string, unknown>), childrenIds: newChildren }
  } else if (parent.key.startsWith('props.columns.')) {
    const colIndex = parseInt(parent.key.split('.')[2])
    const cols = [...((parentData.props as Record<string, unknown>).columns as { childrenIds: string[] }[])]
    cols[colIndex] = { childrenIds: newChildren }
    parentData.props = { ...(parentData.props as Record<string, unknown>), columns: cols }
  }

  store.setDocument({ [parent.parentId]: { type: parentBlock.type, data: parentData } })
}

function deleteBlock() {
  const parent = findParentBlockId()
  if (!parent) return

  const newChildren = parent.childrenIds.filter((id) => id !== props.blockId)
  const parentBlock = store.document[parent.parentId]
  const parentData = { ...parentBlock.data } as Record<string, unknown>

  if (parent.key === 'childrenIds') {
    parentData.childrenIds = newChildren
  } else if (parent.key === 'props.childrenIds') {
    parentData.props = { ...(parentData.props as Record<string, unknown>), childrenIds: newChildren }
  } else if (parent.key.startsWith('props.columns.')) {
    const colIndex = parseInt(parent.key.split('.')[2])
    const cols = [...((parentData.props as Record<string, unknown>).columns as { childrenIds: string[] }[])]
    cols[colIndex] = { childrenIds: newChildren }
    parentData.props = { ...(parentData.props as Record<string, unknown>), columns: cols }
  }

  const newDoc = { ...store.document }
  delete newDoc[props.blockId]
  newDoc[parent.parentId] = { type: parentBlock.type, data: parentData }
  store.loadTemplate(newDoc)
  store.setSelectedBlockId(null)
}

function duplicateBlock() {
  const parent = findParentBlockId()
  if (!parent) return

  const blockToDuplicate = store.document[props.blockId]
  const newId = `block-${Date.now()}`
  const idx = parent.childrenIds.indexOf(props.blockId)
  const newChildren = [...parent.childrenIds]
  newChildren.splice(idx + 1, 0, newId)

  const parentBlock = store.document[parent.parentId]
  const parentData = { ...parentBlock.data } as Record<string, unknown>

  if (parent.key === 'childrenIds') {
    parentData.childrenIds = newChildren
  } else if (parent.key === 'props.childrenIds') {
    parentData.props = { ...(parentData.props as Record<string, unknown>), childrenIds: newChildren }
  } else if (parent.key.startsWith('props.columns.')) {
    const colIndex = parseInt(parent.key.split('.')[2])
    const cols = [...((parentData.props as Record<string, unknown>).columns as { childrenIds: string[] }[])]
    cols[colIndex] = { childrenIds: newChildren }
    parentData.props = { ...(parentData.props as Record<string, unknown>), columns: cols }
  }

  store.setDocument({
    [parent.parentId]: { type: parentBlock.type, data: parentData },
    [newId]: JSON.parse(JSON.stringify(blockToDuplicate)),
  })
  store.setSelectedBlockId(newId)
}
</script>

<template>
  <div
    :style="{
      position: 'absolute',
      top: '-12px',
      right: '4px',
      zIndex: 10,
      display: 'flex',
      gap: '2px',
    }"
    @click.stop
  >
    <v-btn size="x-small" icon variant="flat" color="primary" @click="moveBlock(-1)">
      <v-icon size="14">mdi-arrow-up</v-icon>
    </v-btn>
    <v-btn size="x-small" icon variant="flat" color="primary" @click="moveBlock(1)">
      <v-icon size="14">mdi-arrow-down</v-icon>
    </v-btn>
    <v-btn size="x-small" icon variant="flat" color="primary" @click="duplicateBlock">
      <v-icon size="14">mdi-content-copy</v-icon>
    </v-btn>
    <v-btn size="x-small" icon variant="flat" color="error" @click="deleteBlock">
      <v-icon size="14">mdi-delete</v-icon>
    </v-btn>
  </div>
</template>
