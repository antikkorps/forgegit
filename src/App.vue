<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(async () => {
  await themeStore.init()
})
</script>

<template>
  <RouterView />
</template>
