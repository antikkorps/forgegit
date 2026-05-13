<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    label: string
    size?: number
    active?: boolean
  }>(),
  { size: 18, active: false },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="inline-flex items-center justify-center w-9 h-9 -m-1.5 rounded-btn transition-colors duration-150"
    :class="active ? 'text-accent-500' : 'text-text-tertiary active:text-text-primary'"
    @click="$emit('click', $event)"
  >
    <i
      :class="icon"
      :style="{ fontSize: `${size}px` }"
      aria-hidden="true"
    />
  </button>
</template>
