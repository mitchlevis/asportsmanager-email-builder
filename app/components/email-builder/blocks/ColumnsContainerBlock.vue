<script setup lang="ts">
import type { ColumnsContainerProps } from '~/utils/email-builder/schemas'
import { ColumnsContainerPropsDefaults } from '~/utils/email-builder/schemas'
import { getPadding } from '~/utils/email-builder/style-schemas'

const props = defineProps<{ data: ColumnsContainerProps }>()

const columnsCount = computed(() => props.data.props?.columnsCount ?? ColumnsContainerPropsDefaults.columnsCount)
const columnsGap = computed(() => props.data.props?.columnsGap ?? ColumnsContainerPropsDefaults.columnsGap)
const contentAlignment = computed(() => props.data.props?.contentAlignment ?? ColumnsContainerPropsDefaults.contentAlignment)

const wStyle = computed(() => ({
  backgroundColor: props.data.style?.backgroundColor ?? undefined,
  padding: getPadding(props.data.style?.padding),
}))

function getCellStyle(index: number) {
  let paddingLeft = 0
  let paddingRight = 0
  const gap = columnsGap.value
  const count = columnsCount.value

  if (count === 2) {
    paddingLeft = index === 0 ? 0 : gap / 2
    paddingRight = index === 0 ? gap / 2 : 0
  } else {
    if (index === 0) { paddingLeft = 0; paddingRight = (2 * gap) / 3 }
    else if (index === 1) { paddingLeft = gap / 3; paddingRight = gap / 3 }
    else { paddingLeft = (2 * gap) / 3; paddingRight = 0 }
  }

  const fixedWidth = props.data.props?.fixedWidths?.[index]
  return {
    boxSizing: 'content-box' as const,
    verticalAlign: contentAlignment.value,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    width: fixedWidth ? `${fixedWidth}px` : undefined,
  }
}

const visibleColumns = computed(() => {
  const indices = [0, 1]
  if (columnsCount.value === 3) indices.push(2)
  return indices
})
</script>

<template>
  <div :style="wStyle">
    <table
      align="center"
      width="100%"
      cellpadding="0"
      border="0"
      :style="{ tableLayout: 'fixed', borderCollapse: 'collapse' }"
    >
      <tbody style="width: 100%">
        <tr style="width: 100%">
          <td
            v-for="index in visibleColumns"
            :key="index"
            :style="getCellStyle(index)"
          >
            <slot :name="`column-${index}`" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
