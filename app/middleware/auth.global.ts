export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  if (to.path === '/login') return

  const auth = useAuth()

  if (auth.isAuthenticated) return

  const restored = await auth.tryRestoreSession()
  if (restored) return

  return navigateTo('/login')
})
