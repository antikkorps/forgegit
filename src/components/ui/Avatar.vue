<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    name?: string
    size?: number
  }>(),
  { src: null, size: 26, name: '' },
)

const initial = computed(() => {
  const n = props.name?.trim()
  return n ? n.charAt(0).toUpperCase() : '?'
})
</script>

<template>
  <div
    class="inline-flex items-center justify-center bg-border text-accent-500 font-medium overflow-hidden"
    :style="{ width: `${size}px`, height: `${size}px`, borderRadius: '7px', fontSize: `${Math.round(size * 0.42)}px` }"
  >
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="w-full h-full object-cover"
    >
    <span v-else>{{ initial }}</span>
  </div>
</template>
