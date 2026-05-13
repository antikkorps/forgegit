<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  label?: string
  hint?: string
  error?: string | null
  autocomplete?: string
  inputmode?: 'text' | 'url' | 'email' | 'numeric'
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="flex flex-col gap-1.5">
    <span
      v-if="label"
      class="text-[11px] font-medium text-text-secondary"
    >{{ label }}</span>
    <input
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :disabled="disabled"
      class="w-full h-11 px-3.5 rounded-btn bg-surface border text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors duration-150"
      :class="error ? 'border-danger' : 'border-border focus:border-accent-500'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span
      v-if="error"
      class="text-[11px] text-danger"
    >{{ error }}</span>
    <span
      v-else-if="hint"
      class="text-[11px] text-text-tertiary"
    >{{ hint }}</span>
  </label>
</template>
