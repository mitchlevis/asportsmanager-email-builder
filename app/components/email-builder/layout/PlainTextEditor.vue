<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import SlashCommandMenu from './SlashCommandMenu.vue'
import type { SlashCommand } from '~/utils/email-builder/slash-commands'

const store = useEmailEditor()

const editorRef = ref<HTMLDivElement | null>(null)
const menuRef = ref<InstanceType<typeof SlashCommandMenu> | null>(null)

const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const slashFilter = ref('')
const slashStartOffset = ref(0)
const slashNode = ref<Node | null>(null)

let internalUpdate = false

onMounted(() => {
  if (editorRef.value && store.plainText) {
    editorRef.value.innerText = store.plainText
  }
})

watch(() => store.plainText, (val) => {
  if (internalUpdate) return
  if (editorRef.value && editorRef.value.innerText !== val) {
    editorRef.value.innerText = val
  }
})

function syncToStore() {
  if (!editorRef.value) return
  internalUpdate = true
  store.plainText = editorRef.value.innerText
  nextTick(() => { internalUpdate = false })
}

function onInput() {
  syncToStore()
  updateSlashState()
}

function onKeydown(e: KeyboardEvent) {
  if (showMenu.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
      menuRef.value?.handleKeydown(e)
      return
    }
  }

  if (e.key === 'Tab' && showMenu.value) {
    e.preventDefault()
    menuRef.value?.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))
  }
}

function updateSlashState() {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || !editorRef.value) {
    closeMenu()
    return
  }

  const range = sel.getRangeAt(0)
  if (!range.collapsed) {
    closeMenu()
    return
  }

  const node = range.startContainer
  if (node.nodeType !== Node.TEXT_NODE) {
    closeMenu()
    return
  }

  const text = node.textContent ?? ''
  const cursorPos = range.startOffset

  let slashIdx = -1
  for (let i = cursorPos - 1; i >= 0; i--) {
    const ch = text[i]
    if (ch === '/') {
      if (i === 0 || /\s/.test(text[i - 1])) {
        slashIdx = i
      }
      break
    }
    if (/\s/.test(ch)) break
  }

  if (slashIdx === -1) {
    closeMenu()
    return
  }

  const query = text.substring(slashIdx + 1, cursorPos)
  slashFilter.value = query
  slashStartOffset.value = slashIdx
  slashNode.value = node

  const caretRect = getCaretRect(range)
  if (caretRect) {
    menuX.value = caretRect.left
    menuY.value = caretRect.bottom + 4
  }

  showMenu.value = true
}

function getCaretRect(range: Range): DOMRect | null {
  const rect = range.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    const tempSpan = document.createElement('span')
    tempSpan.textContent = '\u200b'
    range.insertNode(tempSpan)
    const spanRect = tempSpan.getBoundingClientRect()
    tempSpan.parentNode?.removeChild(tempSpan)
    const sel = window.getSelection()
    if (sel) sel.collapse(range.startContainer, range.startOffset)
    return spanRect
  }
  return rect
}

function closeMenu() {
  showMenu.value = false
  slashFilter.value = ''
  slashNode.value = null
}

function onSelectCommand(cmd: SlashCommand) {
  const node = slashNode.value
  if (!node || !editorRef.value) {
    closeMenu()
    return
  }

  const text = node.textContent ?? ''
  const sel = window.getSelection()
  if (!sel) { closeMenu(); return }

  const cursorPos = sel.getRangeAt(0).startOffset
  const before = text.substring(0, slashStartOffset.value)
  const after = text.substring(cursorPos)
  const insertText = cmd.insert()

  node.textContent = before + insertText + after

  const newRange = document.createRange()
  const newPos = before.length + insertText.length
  newRange.setStart(node, Math.min(newPos, node.textContent!.length))
  newRange.collapse(true)
  sel.removeAllRanges()
  sel.addRange(newRange)

  closeMenu()
  syncToStore()
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') ?? ''
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return
  const range = sel.getRangeAt(0)
  range.deleteContents()
  range.insertNode(document.createTextNode(text))
  range.collapse(false)
  sel.removeAllRanges()
  sel.addRange(range)
  syncToStore()
}

function onClickOutside(e: MouseEvent) {
  if (!showMenu.value) return
  const target = e.target as HTMLElement
  if (target.closest('.slash-menu')) return
  closeMenu()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div style="height: 100%; display: flex; flex-direction: column; position: relative">
    <div
      ref="editorRef"
      contenteditable="true"
      class="plain-text-editor-ce"
      spellcheck="false"
      @input="onInput"
      @keydown="onKeydown"
      @paste="onPaste"
    />
    <SlashCommandMenu
      v-if="showMenu"
      ref="menuRef"
      :filter="slashFilter"
      :x="menuX"
      :y="menuY"
      @select="onSelectCommand"
      @close="closeMenu"
    />
  </div>
</template>

<style scoped>
.plain-text-editor-ce {
  flex: 1;
  margin: 16px;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-y: auto;
  outline: none;
  min-height: 200px;
  background: white;
}

.plain-text-editor-ce:focus {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
  padding: 11px 15px;
}

.plain-text-editor-ce:empty::before {
  content: 'Enter plain text version of the email... Type / for commands';
  color: rgba(0, 0, 0, 0.38);
  pointer-events: none;
}
</style>
