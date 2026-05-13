import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { storage } from '@/composables/useStorage'
import { createForgejoApi, type ForgejoApi } from '@/composables/useForgejoApi'
import type { ForgejoUser } from '@/types/forgejo'

const KEYS = {
  baseUrl: 'anvil.auth.baseUrl',
  token: 'anvil.auth.token',
  user: 'anvil.auth.user',
} as const

export const useAuthStore = defineStore('auth', () => {
  const baseUrl = ref<string | null>(null)
  const token = ref<string | null>(null)
  const user = ref<ForgejoUser | null>(null)
  const initialized = ref(false)
  const api = shallowRef<ForgejoApi | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!baseUrl.value)

  function rebuildApi() {
    api.value = baseUrl.value && token.value
      ? createForgejoApi({ baseUrl: baseUrl.value, token: token.value })
      : null
  }

  async function init() {
    if (initialized.value) return
    baseUrl.value = await storage.get(KEYS.baseUrl)
    token.value = await storage.get(KEYS.token)
    const cachedUser = await storage.get(KEYS.user)
    if (cachedUser) {
      try {
        user.value = JSON.parse(cachedUser) as ForgejoUser
      } catch {
        user.value = null
      }
    }
    rebuildApi()
    initialized.value = true
  }

  async function login(instanceUrl: string, personalToken: string): Promise<{ ok: true } | { ok: false; message: string }> {
    const trial = createForgejoApi({ baseUrl: instanceUrl, token: personalToken })
    const res = await trial.getCurrentUser()
    if (!res.ok) {
      return { ok: false, message: res.error.message }
    }
    baseUrl.value = instanceUrl
    token.value = personalToken
    user.value = res.data
    await storage.set(KEYS.baseUrl, instanceUrl)
    await storage.set(KEYS.token, personalToken)
    await storage.set(KEYS.user, JSON.stringify(res.data))
    rebuildApi()
    return { ok: true }
  }

  async function logout() {
    baseUrl.value = null
    token.value = null
    user.value = null
    api.value = null
    await storage.remove(KEYS.baseUrl)
    await storage.remove(KEYS.token)
    await storage.remove(KEYS.user)
  }

  return { baseUrl, token, user, initialized, isAuthenticated, api, init, login, logout }
})
