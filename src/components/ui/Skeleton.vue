<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    radius?: string
  }>(),
  { width: '100%', height: '14px', radius: '6px' },
)
</script>

<template>
  <span
    class="skeleton block"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--c-bg-elevated) 0%,
    var(--c-bg-border) 50%,
    var(--c-bg-elevated) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
