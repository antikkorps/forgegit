<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '@/composables/useAppConfig'
import { useAuthStore } from '@/stores/auth'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import IconButton from '@/components/ui/IconButton.vue'
import Avatar from '@/components/ui/Avatar.vue'

const app = useAppConfig()
const auth = useAuthStore()

const userName = computed(() => auth.user?.full_name || auth.user?.login || '')
const avatarSrc = computed(() => auth.user?.avatar_url ?? null)

defineEmits<{
  search: []
  notifications: []
  profile: []
}>()
</script>

<template>
  <header class="flex items-center justify-between px-4 py-3.5 border-b border-border bg-canvas">
    <div class="flex items-center gap-2.5">
      <BrandLogo :size="28" />
      <span class="brand-name">{{ app.name }}</span>
    </div>

    <div class="flex items-center gap-3.5">
      <IconButton
        icon="i-tabler-search"
        label="Rechercher"
        @click="$emit('search')"
      />
      <IconButton
        icon="i-tabler-bell"
        label="Notifications"
        @click="$emit('notifications')"
      />
      <button
        type="button"
        :aria-label="userName || 'Profil'"
        @click="$emit('profile')"
      >
        <Avatar
          :src="avatarSrc"
          :name="userName"
          :size="26"
        />
      </button>
    </div>
  </header>
</template>

<style scoped>
.brand-name {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--c-text-primary);
}
</style>
