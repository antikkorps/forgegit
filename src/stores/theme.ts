import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@/composables/useStorage'

export type ThemeName = 'default' | 'light' | 'brutalist'

const STORAGE_KEY = 'anvil.theme'

export const useThemeStore = defineStore('theme', () => {
  const current = ref<ThemeName>('default')
  const initialized = ref(false)

  function apply(name: ThemeName) {
    document.documentElement.setAttribute('data-theme', name)
    current.value = name
  }

  async function init() {
    if (initialized.value) return
    const saved = await storage.get(STORAGE_KEY)
    apply((saved as ThemeName) ?? 'default')
    initialized.value = true
  }

  async function setTheme(name: ThemeName) {
    apply(name)
    await storage.set(STORAGE_KEY, name)
  }

  return { current, initialized, init, setTheme }
})
