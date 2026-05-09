<script setup lang="ts">
import type { MediaPublic } from '~/types/media'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select': [url: string]
}>()

const PAGE_SIZE = 50

const images = ref<MediaPublic[]>([])
const totalCount = ref(0)
const offset = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const uploading = ref(false)
const searchTerm = ref('')
const searchDebounced = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const hasMore = computed(() => offset.value < totalCount.value)

function buildFilter() {
  const filter: Record<string, unknown> = { Key: { $startsWith: 'emails/' } }
  if (searchDebounced.value.trim()) {
    filter.Name = { $substring: searchDebounced.value.trim() }
  }
  return JSON.stringify(filter)
}

async function fetchImages(append = false) {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const response = await apiFetch<MediaPublic[]>('/rest/media-publics', {
      query: {
        filter: buildFilter(),
        limit: PAGE_SIZE,
        offset: append ? offset.value : 0,
        sort: 'CreatedAt',
        sort_direction: 'DESC',
      },
      onResponse({ response: res }) {
        const count = res.headers.get('x-total-count')
        if (count) totalCount.value = parseInt(count, 10)
      },
    })

    if (append) {
      images.value.push(...response)
      offset.value += response.length
    } else {
      images.value = response
      offset.value = response.length
    }
  } catch (e) {
    console.error('Failed to fetch images:', e)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function onSearchInput(value: string) {
  searchTerm.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchDebounced.value = value
    offset.value = 0
    fetchImages(false)
  }, 300)
}

function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (!el || loadingMore.value || !hasMore.value) return
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200
  if (nearBottom) {
    fetchImages(true)
  }
}

function selectImage(image: MediaPublic) {
  emit('select', image.Url)
  emit('update:modelValue', false)
}

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const response = await apiFetch<MediaPublic>(`/s3/media-public/emails/${file.name}`, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    })
    images.value.unshift(response)
    totalCount.value += 1
    offset.value += 1
  } catch (e) {
    console.error('Failed to upload image:', e)
  } finally {
    uploading.value = false
    input.value = ''
  }
}

watch(() => props.modelValue, (open) => {
  if (open) {
    searchTerm.value = ''
    searchDebounced.value = ''
    offset.value = 0
    images.value = []
    fetchImages(false)
  }
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card height="600">
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-0">
        <span>Image Library</span>
        <v-btn icon variant="text" size="small" @click="emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <div class="px-4 pt-3 d-flex align-center" style="gap: 8px;">
        <v-text-field
          :model-value="searchTerm"
          placeholder="Search images..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="flex-grow-1"
          @update:model-value="onSearchInput"
          @click:clear="onSearchInput('')"
        />
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-upload"
          :loading="uploading"
          @click="triggerUpload"
        >
          Upload
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileUpload"
        />
      </div>

      <v-card-text
        ref="scrollContainer"
        class="pa-4"
        style="overflow-y: auto; flex: 1;"
        @scroll="onScroll"
      >
        <div v-if="loading && images.length === 0" class="d-flex flex-wrap" style="gap: 12px;">
          <v-skeleton-loader
            v-for="i in 9"
            :key="i"
            type="image"
            style="width: calc(33.333% - 8px); aspect-ratio: 1;"
          />
        </div>

        <div v-else-if="!loading && images.length === 0" class="text-center text-medium-emphasis py-8">
          <v-icon size="48" class="mb-2">mdi-image-off-outline</v-icon>
          <div>No images found</div>
        </div>

        <div v-else class="d-flex flex-wrap" style="gap: 12px;">
          <div
            v-for="image in images"
            :key="image.Id"
            class="image-thumb"
            style="width: calc(33.333% - 8px); cursor: pointer;"
            @click="selectImage(image)"
          >
            <v-card variant="outlined" rounded="lg" class="pa-1" hover>
              <v-img
                :src="image.Url"
                :alt="image.Name"
                aspect-ratio="1"
                cover
                class="rounded"
                :style="{ backgroundColor: '#f5f5f5' }"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="24" />
                  </div>
                </template>
              </v-img>
              <div class="text-caption text-truncate text-center mt-1 px-1" :title="image.Name">
                {{ image.Name }}
              </div>
            </v-card>
          </div>
        </div>

        <div v-if="loadingMore" class="d-flex justify-center py-4">
          <v-progress-circular indeterminate size="24" />
        </div>
      </v-card-text>
    </v-card>

    <v-overlay
      v-model="uploading"
      contained
      persistent
      class="d-flex align-center justify-center"
    >
      <v-progress-circular indeterminate size="48" color="primary" />
    </v-overlay>
  </v-dialog>
</template>
