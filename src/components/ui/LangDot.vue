<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  language: string | null
}>()

const LANG_COLORS: Record<string, string> = {
  javascript: '#f59e0b',
  typescript: '#3b82f6',
  vue: '#22c55e',
  quasar: '#22c55e',
  rust: '#ea580c',
  go: '#3b82f6',
  python: '#eab308',
  markdown: '#6b6f7a',
}

const color = computed(() => {
  if (!props.language) return '#6b6f7a'
  return LANG_COLORS[props.language.toLowerCase()] ?? '#6b6f7a'
})

const label = computed(() => props.language ?? '—')
</script>

<template>
  <span class="inline-flex items-center gap-1">
    <span
      class="inline-block rounded-full"
      :style="{ width: '6px', height: '6px', background: color }"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
  </span>
</template>
