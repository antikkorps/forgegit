<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore, type ThemeName } from '@/stores/theme'
import { useReposStore } from '@/stores/repos'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()
const repos = useReposStore()

const themes: { value: ThemeName; label: string }[] = [
  { value: 'default', label: 'Default (dark)' },
  { value: 'light', label: 'Light' },
  { value: 'brutalist', label: 'Brutalist (wip)' },
]

async function logout() {
  await auth.logout()
  repos.reset()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="screen-pad py-4 flex flex-col gap-6">
    <section>
      <h1 class="text-[18px] text-text-primary mb-1">
        {{ t('nav.settings') }}
      </h1>
      <p
        v-if="auth.user"
        class="text-[12px] text-text-tertiary"
      >
        {{ auth.user.full_name || auth.user.login }} · {{ auth.baseUrl }}
      </p>
    </section>

    <section>
      <h2 class="text-[11px] uppercase tracking-wide text-text-secondary mb-2">
        Thème
      </h2>
      <div class="flex flex-col gap-1.5">
        <button
          v-for="option in themes"
          :key="option.value"
          type="button"
          class="flex items-center justify-between px-3.5 py-3 rounded-card bg-surface border border-border text-left"
          @click="theme.setTheme(option.value)"
        >
          <span class="text-sm text-text-primary">{{ option.label }}</span>
          <span
            v-if="theme.current === option.value"
            class="text-[11px] text-accent-500 font-medium"
          >Actif</span>
        </button>
      </div>
    </section>

    <section>
      <Button
        variant="secondary"
        block
        @click="logout"
      >
        {{ t('common.logout') }}
      </Button>
    </section>
  </div>
</template>
