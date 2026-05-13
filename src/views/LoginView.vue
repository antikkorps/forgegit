<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useAppConfig } from '@/composables/useAppConfig'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import IconButton from '@/components/ui/IconButton.vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const app = useAppConfig()

const instance = ref('https://codeberg.org')
const token = ref('')
const showToken = ref(false)
const submitting = ref(false)
const formError = ref<string | null>(null)
const instanceError = ref<string | null>(null)
const tokenError = ref<string | null>(null)

const tokenInputType = computed(() => (showToken.value ? 'text' : 'password'))

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const u = new URL(withScheme)
    return `${u.protocol}//${u.host}${u.pathname.replace(/\/+$/, '')}`
  } catch {
    return null
  }
}

function mapLoginError(message: string): string {
  if (/network|fetch|failed/i.test(message)) return t('login.errors.network')
  if (/token|unauthor|401|forbidden|403/i.test(message)) return t('login.errors.auth_failed')
  return message || t('login.errors.auth_failed')
}

async function submit() {
  formError.value = null
  instanceError.value = null
  tokenError.value = null

  const normalized = normalizeUrl(instance.value)
  if (!normalized) {
    instanceError.value = t('login.errors.invalid_url')
    return
  }
  if (!token.value.trim()) {
    tokenError.value = t('login.errors.missing_token')
    return
  }

  submitting.value = true
  try {
    const res = await auth.login(normalized, token.value.trim())
    if (res.ok) {
      await router.push({ name: 'repos' })
    } else {
      formError.value = mapLoginError(res.message)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full screen-pad py-10">
    <header class="flex flex-col items-center gap-3 mb-10">
      <BrandLogo :size="48" />
      <h1 class="text-[22px]">
        {{ app.name }}
      </h1>
      <p class="text-[12px] text-text-tertiary">
        {{ app.tagline }}
      </p>
    </header>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <h2 class="text-[16px] font-medium text-text-primary">
        {{ t('login.title') }}
      </h2>
      <p class="text-[12px] text-text-secondary -mt-2">
        {{ t('login.subtitle') }}
      </p>

      <Input
        v-model="instance"
        :label="t('login.instance_label')"
        :placeholder="t('login.instance_placeholder')"
        :error="instanceError"
        type="url"
        inputmode="url"
        autocomplete="url"
        :disabled="submitting"
      />

      <div class="relative">
        <Input
          v-model="token"
          :label="t('login.token_label')"
          :placeholder="t('login.token_placeholder')"
          :hint="t('login.token_help')"
          :error="tokenError"
          :type="tokenInputType"
          autocomplete="off"
          :disabled="submitting"
        />
        <div class="absolute right-2 top-7">
          <IconButton
            :icon="showToken ? 'i-tabler-eye-off' : 'i-tabler-eye'"
            :label="showToken ? t('login.hide_token') : t('login.show_token')"
            @click="showToken = !showToken"
          />
        </div>
      </div>

      <p
        v-if="formError"
        class="text-[12px] text-danger"
        role="alert"
      >
        {{ formError }}
      </p>

      <Button
        type="submit"
        block
        :disabled="submitting"
      >
        {{ submitting ? t('login.submitting') : t('login.submit') }}
      </Button>
    </form>
  </div>
</template>
