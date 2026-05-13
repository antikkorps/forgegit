import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'
import type { ForgejoRepo } from '@/types/forgejo'

export const useReposStore = defineStore('repos', () => {
  const items = ref<ForgejoRepo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchedAt = ref<number | null>(null)

  const sortedByActivity = computed(() =>
    [...items.value].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    ),
  )

  const mostRecentUpdate = computed(() =>
    sortedByActivity.value[0]?.updated_at ?? null,
  )

  async function fetchAll() {
    const auth = useAuthStore()
    if (!auth.api) {
      error.value = 'Non authentifié'
      return
    }
    loading.value = true
    error.value = null
    const res = await auth.api.listMyRepos({ page: 1, limit: 50 })
    if (res.ok) {
      items.value = res.data
      lastFetchedAt.value = Date.now()
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  function reset() {
    items.value = []
    error.value = null
    lastFetchedAt.value = null
  }

  return { items, loading, error, lastFetchedAt, sortedByActivity, mostRecentUpdate, fetchAll, reset }
})
