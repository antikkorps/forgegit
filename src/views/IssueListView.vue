<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="screen-pad py-4">
    <h1 class="text-[18px] text-text-primary">
      {{ t('nav.issues') }}
    </h1>
    <p class="mt-2 text-[12px] text-text-tertiary">
      À venir.
    </p>
  </div>
</template>
