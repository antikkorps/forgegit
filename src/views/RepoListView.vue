<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReposStore } from '@/stores/repos'
import { useRelativeTime } from '@/composables/useRelativeTime'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import RepoCard from '@/components/repo/RepoCard.vue'
import RepoCardSkeleton from '@/components/repo/RepoCardSkeleton.vue'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const repos = useReposStore()
const { format } = useRelativeTime()

const scrollEl = ref<HTMLElement | null>(null)
const { pull, refreshing } = usePullToRefresh({
  el: scrollEl,
  onRefresh: () => repos.fetchAll(),
})

const isInitialLoading = computed(() => repos.loading && repos.items.length === 0)
const showEmpty = computed(
  () => !repos.loading && !repos.error && repos.items.length === 0,
)

const subtitle = computed(() => {
  const list = repos.sortedByActivity
  if (list.length === 0) return t('repos.subtitle_empty')
  return t('repos.subtitle_active', {
    count: list.length,
    time: format(repos.mostRecentUpdate),
  })
})

onMounted(() => {
  if (repos.items.length === 0) repos.fetchAll()
})
</script>

<template>
  <div
    ref="scrollEl"
    class="relative h-full overflow-y-auto"
    style="overscroll-behavior: contain"
  >
    <div
      v-if="pull > 0 || refreshing"
      class="flex items-center justify-center text-text-tertiary"
      :style="{ height: `${pull}px`, transition: refreshing ? 'none' : 'height 200ms' }"
    >
      <i
        class="i-tabler-refresh text-[18px]"
        :class="refreshing ? 'animate-spin' : ''"
        :style="{ transform: refreshing ? 'none' : `rotate(${pull * 4}deg)` }"
        aria-hidden="true"
      />
    </div>

    <div class="screen-pad py-4">
      <header class="flex justify-between items-baseline mb-3.5">
        <div>
          <h1 class="text-[18px] mb-0.5">
            {{ t('repos.title') }}
          </h1>
          <p class="text-[12px] text-text-tertiary">
            {{ subtitle }}
          </p>
        </div>
        <button
          type="button"
          class="flex items-center gap-1.5 bg-elevated px-2.5 py-1.5 rounded-btn text-[11px] text-text-secondary"
        >
          <i
            class="i-tabler-filter text-[12px]"
            aria-hidden="true"
          />
          {{ t('repos.filter_active') }}
        </button>
      </header>

      <div
        v-if="isInitialLoading"
        class="flex flex-col gap-1.5"
      >
        <RepoCardSkeleton
          v-for="i in 4"
          :key="i"
        />
      </div>

      <div
        v-else-if="repos.error"
        class="card-base px-3.5 py-4 flex flex-col gap-3"
      >
        <p class="text-[13px] text-danger">
          {{ repos.error }}
        </p>
        <Button
          variant="secondary"
          @click="repos.fetchAll"
        >
          {{ t('common.retry') }}
        </Button>
      </div>

      <div
        v-else-if="showEmpty"
        class="card-base px-3.5 py-6 text-center"
      >
        <p class="text-[13px] text-text-secondary">
          {{ t('repos.empty') }}
        </p>
      </div>

      <div
        v-else
        class="flex flex-col gap-1.5"
      >
        <router-link
          v-for="(repo, index) in repos.sortedByActivity"
          :key="repo.id"
          :to="{ name: 'repo-detail', params: { owner: repo.owner.login, repo: repo.name } }"
          class="block no-underline text-inherit active:opacity-80"
        >
          <RepoCard
            :repo="repo"
            :active="index === 0"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 800ms linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
