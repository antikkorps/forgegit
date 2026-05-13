<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'

withDefaults(
  defineProps<{
    variant?: Variant
    type?: 'button' | 'submit'
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false, block: false },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 px-4 h-10 rounded-btn text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
      block ? 'w-full' : '',
      variant === 'primary' && 'bg-accent-500 text-white active:bg-accent-600',
      variant === 'secondary' && 'bg-elevated text-text-primary active:bg-border',
      variant === 'ghost' && 'text-text-secondary active:text-text-primary',
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
