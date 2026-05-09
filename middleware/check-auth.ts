import { usePbClient } from '@/composables/pbClient'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const client = usePbClient()
  const isUserLoggedIn = await client.authStore.isValid

  if(isUserLoggedIn) return navigateTo('/')
})
