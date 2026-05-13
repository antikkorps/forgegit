<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

interface Tab {
  name: string
  to: string
  icon: string
  label: string
}

const tabs = computed<Tab[]>(() => [
  { name: 'repos', to: '/repos', icon: 'i-tabler-folder', label: t('nav.repos') },
  { name: 'prs', to: '/prs', icon: 'i-tabler-git-pull-request', label: t('nav.prs') },
  { name: 'issues', to: '/issues', icon: 'i-tabler-alert-circle', label: t('nav.issues') },
  { name: 'settings', to: '/settings', icon: 'i-tabler-settings', label: t('nav.settings') },
])
</script>

<template>
  <nav
    class="flex items-stretch justify-around px-4 py-2.5 border-t border-border bg-canvas"
    :aria-label="t('nav.repos')"
  >
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.to"
      class="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors duration-150"
      :class="
        route.name === tab.name
          ? 'text-accent-500'
          : 'text-text-tertiary active:text-text-primary'
      "
      :aria-current="route.name === tab.name ? 'page' : undefined"
    >
      <i
        :class="tab.icon"
        class="text-[20px]"
        aria-hidden="true"
      />
      <span
        class="text-[10px]"
        :class="route.name === tab.name ? 'font-medium' : ''"
      >
        {{ tab.label }}
      </span>
    </RouterLink>
  </nav>
</template>
