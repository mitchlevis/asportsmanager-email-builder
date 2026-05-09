import type { FetchOptions } from 'ofetch'

function getApiFetchOptions(options: FetchOptions = {}) {
  const config = useRuntimeConfig()
  const auth = useAuth()

  return {
    ...options,
    baseURL: config.public.apiBaseUrl as string,
    headers: {
      ...options.headers,
      Authorization: auth.apiKey ?? '',
    },
    onResponseError({ response }: { response: { status: number } }) {
      if (response.status === 401) {
        auth.logout()
      }
    },
  }
}

/**
 * Authenticated $fetch wrapper that attaches the API key
 * from the auth store to every outgoing request.
 *
 * Usage: const data = await apiFetch('/some-endpoint', { method: 'POST', body: { ... } })
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  return await $fetch<T>(path, getApiFetchOptions(options))
}

/**
 * Like apiFetch but returns the raw Response so callers can read headers
 * (e.g. x-total-count for pagination).
 */
export async function apiFetchRaw<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<{ data: T; headers: Headers }> {
  const response = await $fetch.raw<T>(path, getApiFetchOptions(options))
  return {
    data: response._data as T,
    headers: response.headers,
  }
}
