<script setup lang="ts">
import { useRouter } from 'vue-router'
import TopBar from './TopBar.vue'
import BottomNav from './BottomNav.vue'

const router = useRouter()

function onProfile() {
  // Profile button routes to Settings (the only place to log out for now).
  router.push({ name: 'settings' })
}
</script>

<template>
  <div class="flex flex-col h-full bg-canvas">
    <TopBar @profile="onProfile" />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>
