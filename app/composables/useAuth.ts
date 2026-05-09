import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'asm_api_key'

export const useAuth = defineStore('auth', () => {
  const apiKey = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isValidating = ref(false)
  const error = ref<string | null>(null)
  const sessionRestored = ref(false)

  async function validateKey(key: string): Promise<boolean> {
    const config = useRuntimeConfig()
    try {
      await $fetch('/validate-api-key', {
        baseURL: config.public.apiBaseUrl as string,
        headers: { Authorization: key },
      })
      return true
    } catch {
      return false
    }
  }

  async function login(key: string): Promise<boolean> {
    isValidating.value = true
    error.value = null

    try {
      const valid = await validateKey(key)
      if (valid) {
        apiKey.value = key
        isAuthenticated.value = true
        localStorage.setItem(STORAGE_KEY, key)
        return true
      } else {
        error.value = 'Invalid API Key'
        return false
      }
    } catch {
      error.value = 'Unable to validate API Key. Please try again.'
      return false
    } finally {
      isValidating.value = false
    }
  }

  function logout() {
    apiKey.value = null
    isAuthenticated.value = false
    error.value = null
    localStorage.removeItem(STORAGE_KEY)
    navigateTo('/login')
  }

  async function tryRestoreSession(): Promise<boolean> {
    if (sessionRestored.value) return isAuthenticated.value

    const storedKey = localStorage.getItem(STORAGE_KEY)
    if (!storedKey) {
      sessionRestored.value = true
      return false
    }

    isValidating.value = true
    try {
      const valid = await validateKey(storedKey)
      if (valid) {
        apiKey.value = storedKey
        isAuthenticated.value = true
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      isValidating.value = false
      sessionRestored.value = true
    }

    return isAuthenticated.value
  }

  return {
    apiKey,
    isAuthenticated,
    isValidating,
    error,
    sessionRestored,
    login,
    logout,
    tryRestoreSession,
  }
})
