<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div
    class="card-base px-3.5 py-3"
    :class="active ? 'is-active' : ''"
  >
    <span
      v-if="active"
      class="active-bar"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>

<style scoped>
.active-bar {
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: var(--c-accent-500);
  border-radius: 0 2px 2px 0;
}
</style>
