import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EmailTemplateListItem } from '~/types/email-builder'
import { apiFetchRaw } from '~/utils/api'

const PAGE_SIZE = 100

export const useEmailTemplates = defineStore('emailTemplates', () => {
  const templates = ref<EmailTemplateListItem[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)

  const hasMore = computed(() => templates.value.length < totalCount.value)

  async function fetchTemplates() {
    loading.value = true
    try {
      const { data, headers } = await apiFetchRaw<EmailTemplateListItem[]>(
        '/rest/email-templates',
        {
          params: {
            attributes: 'Id,Name,Description',
            limit: PAGE_SIZE,
            offset: 0,
          },
        },
      )
      templates.value = data
      totalCount.value = parseInt(headers.get('x-total-count') ?? '0', 10)
    } finally {
      loading.value = false
    }
  }

  async function fetchMoreTemplates() {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const { data, headers } = await apiFetchRaw<EmailTemplateListItem[]>(
        '/rest/email-templates',
        {
          params: {
            attributes: 'Id,Name,Description',
            limit: PAGE_SIZE,
            offset: templates.value.length,
          },
        },
      )
      templates.value.push(...data)
      totalCount.value = parseInt(headers.get('x-total-count') ?? '0', 10)
    } finally {
      loadingMore.value = false
    }
  }

  return {
    templates,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    fetchTemplates,
    fetchMoreTemplates,
  }
})
