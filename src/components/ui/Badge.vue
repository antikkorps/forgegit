<script setup lang="ts">
type Variant = 'neutral' | 'accent'

withDefaults(
  defineProps<{
    variant?: Variant
    mono?: boolean
  }>(),
  { variant: 'neutral', mono: false },
)
</script>

<template>
  <span
    class="inline-flex items-center px-1.5 py-0.5 rounded-pill text-[10px] font-medium leading-none"
    :class="[
      variant === 'accent' ? 'bg-accent-bg text-accent-500' : 'bg-border text-text-secondary',
      mono ? 'font-mono' : '',
    ]"
  >
    <slot />
  </span>
</template>
