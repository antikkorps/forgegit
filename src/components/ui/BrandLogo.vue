<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
  }>(),
  { size: 28 },
)
</script>

<template>
  <div
    class="brand-logo"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `${Math.round(size * 0.28)}px`,
    }"
  >
    <i
      class="i-tabler-flame"
      :style="{ fontSize: `${Math.round(size * 0.55)}px`, color: '#fef3e2' }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--c-accent-500) 0%, var(--c-accent-600) 100%);
}
</style>
