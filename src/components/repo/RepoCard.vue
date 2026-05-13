<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import LangDot from '@/components/ui/LangDot.vue'
import { useRelativeTime } from '@/composables/useRelativeTime'
import type { ForgejoRepo } from '@/types/forgejo'

const props = defineProps<{
  repo: ForgejoRepo
  active?: boolean
}>()

const { format } = useRelativeTime()

const branchVariant = computed<'neutral' | 'accent'>(() =>
  props.active && props.repo.default_branch === 'main' ? 'accent' : 'neutral',
)

const relativeTime = computed(() => format(props.repo.updated_at))

const counters = computed(() =>
  [
    { count: props.repo.open_pr_counter, icon: 'i-tabler-git-pull-request', key: 'prs' },
    { count: props.repo.open_issues_count, icon: 'i-tabler-alert-circle', key: 'issues' },
    { count: props.repo.stars_count, icon: 'i-tabler-star', key: 'stars' },
  ].filter((c) => c.count > 0),
)
</script>

<template>
  <Card :active="active">
    <header class="flex items-center justify-between mb-1.5">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-[14px] font-medium text-text-primary truncate">
          {{ repo.name }}
        </span>
        <Badge
          :variant="branchVariant"
          mono
        >
          {{ repo.default_branch }}
        </Badge>
      </div>
      <span class="text-[11px] text-text-tertiary flex-shrink-0 ml-2">
        {{ relativeTime }}
      </span>
    </header>

    <p
      v-if="repo.description"
      class="text-[12px] text-text-secondary mb-2"
    >
      {{ repo.description }}
    </p>

    <footer class="meta-row">
      <LangDot :language="repo.language" />
      <span
        v-for="meta in counters"
        :key="meta.key"
        class="flex items-center gap-1"
      >
        <i
          :class="meta.icon"
          class="text-[13px]"
          aria-hidden="true"
        />
        {{ meta.count }}
      </span>
    </footer>
  </Card>
</template>
