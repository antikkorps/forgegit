<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useReposStore } from '@/stores/repos'
import { useRelativeTime } from '@/composables/useRelativeTime'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import LangDot from '@/components/ui/LangDot.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Button from '@/components/ui/Button.vue'
import IconButton from '@/components/ui/IconButton.vue'
import type {
  ForgejoRepo,
  ForgejoBranch,
  ForgejoCommit,
  ForgejoLanguages,
} from '@/types/forgejo'

const props = defineProps<{
  owner: string
  repo: string
}>()

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const reposStore = useReposStore()
const { format } = useRelativeTime()

const repoData = ref<ForgejoRepo | null>(null)
const branches = ref<ForgejoBranch[]>([])
const commits = ref<ForgejoCommit[]>([])
const languages = ref<ForgejoLanguages>({})
const readme = ref<string | null>(null)

const loading = ref(true)
const error = ref<string | null>(null)
const readmeMissing = ref(false)

// Seed with cached data from list to avoid an empty header during fetch.
function seedFromCache() {
  const cached = reposStore.items.find(
    (r) => r.owner.login === props.owner && r.name === props.repo,
  )
  if (cached) repoData.value = cached
}

function decodeBase64(content: string): string {
  // Forgejo returns base64 — sometimes with line breaks.
  const clean = content.replace(/\s/g, '')
  try {
    return decodeURIComponent(
      atob(clean)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
  } catch {
    return atob(clean)
  }
}

async function loadAll() {
  if (!auth.api) {
    error.value = t('repo_detail.errors.not_authenticated')
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  readmeMissing.value = false

  const api = auth.api
  const [repoRes, branchesRes, commitsRes, langsRes, readmeRes] = await Promise.all([
    api.getRepo(props.owner, props.repo),
    api.listBranches(props.owner, props.repo, { limit: 50 }),
    api.listCommits(props.owner, props.repo, { limit: 10 }),
    api.getLanguages(props.owner, props.repo),
    api.getReadme(props.owner, props.repo),
  ])

  if (!repoRes.ok) {
    error.value = repoRes.error.message
    loading.value = false
    return
  }
  repoData.value = repoRes.data
  branches.value = branchesRes.ok ? branchesRes.data : []
  commits.value = commitsRes.ok ? commitsRes.data : []
  languages.value = langsRes.ok ? langsRes.data : {}

  if (readmeRes.ok && readmeRes.data.content && readmeRes.data.encoding === 'base64') {
    readme.value = decodeBase64(readmeRes.data.content)
  } else if (!readmeRes.ok && readmeRes.error.status === 404) {
    readmeMissing.value = true
  } else if (readmeRes.ok) {
    readme.value = readmeRes.data.content ?? null
  }

  loading.value = false
}

onMounted(() => {
  seedFromCache()
  loadAll()
})

watch(
  () => [props.owner, props.repo],
  () => {
    repoData.value = null
    seedFromCache()
    loadAll()
  },
)

const langTotal = computed(() =>
  Object.values(languages.value).reduce((sum, n) => sum + n, 0),
)

const langBreakdown = computed(() => {
  const total = langTotal.value
  if (total === 0) return []
  return Object.entries(languages.value)
    .map(([name, bytes]) => ({ name, bytes, pct: (bytes / total) * 100 }))
    .sort((a, b) => b.bytes - a.bytes)
})

const visibleBranches = computed(() => branches.value.slice(0, 5))

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push({ name: 'repos' })
}

function shortSha(sha: string): string {
  return sha.slice(0, 7)
}

function firstLine(message: string): string {
  return message.split('\n')[0]
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="screen-pad py-3">
      <div class="flex items-center gap-1 mb-3">
        <IconButton
          icon="i-tabler-arrow-left"
          :label="t('common.back')"
          @click="goBack"
        />
        <span class="text-[13px] font-mono text-text-secondary truncate">
          {{ owner }}/{{ repo }}
        </span>
      </div>

      <!-- Header card -->
      <Card
        v-if="repoData"
        active
      >
        <header class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-[15px] font-medium text-text-primary truncate">
              {{ repoData.name }}
            </span>
            <Badge
              variant="accent"
              mono
            >
              {{ repoData.default_branch }}
            </Badge>
            <Badge
              v-if="repoData.private"
              variant="neutral"
            >
              {{ t('repo_detail.badges.private') }}
            </Badge>
            <Badge
              v-if="repoData.archived"
              variant="neutral"
            >
              {{ t('repo_detail.badges.archived') }}
            </Badge>
          </div>
          <span class="text-[11px] text-text-tertiary flex-shrink-0 ml-2">
            {{ format(repoData.updated_at) }}
          </span>
        </header>
        <p
          v-if="repoData.description"
          class="text-[12px] text-text-secondary mb-2"
        >
          {{ repoData.description }}
        </p>
        <footer class="meta-row">
          <LangDot :language="repoData.language" />
          <span class="flex items-center gap-1">
            <i
              class="i-tabler-star text-[13px]"
              aria-hidden="true"
            />
            {{ repoData.stars_count }}
          </span>
          <span class="flex items-center gap-1">
            <i
              class="i-tabler-git-pull-request text-[13px]"
              aria-hidden="true"
            />
            {{ repoData.open_pr_counter }}
          </span>
          <span class="flex items-center gap-1">
            <i
              class="i-tabler-alert-circle text-[13px]"
              aria-hidden="true"
            />
            {{ repoData.open_issues_count }}
          </span>
        </footer>
      </Card>
      <Skeleton
        v-else-if="loading"
        height="84px"
      />

      <!-- Error -->
      <div
        v-if="error"
        class="card-base px-3.5 py-4 flex flex-col gap-3 mt-3"
      >
        <p class="text-[13px] text-danger">
          {{ error }}
        </p>
        <Button
          variant="secondary"
          @click="loadAll"
        >
          {{ t('common.retry') }}
        </Button>
      </div>

      <!-- Languages -->
      <section
        v-if="!error && langBreakdown.length > 0"
        class="mt-4"
      >
        <h2 class="section-title">
          {{ t('repo_detail.sections.languages') }}
        </h2>
        <div class="card-base px-3.5 py-3">
          <div class="lang-bar mb-2.5">
            <span
              v-for="l in langBreakdown"
              :key="l.name"
              class="lang-bar-seg"
              :style="{ width: l.pct + '%', background: 'var(--c-accent-500)' }"
              :title="`${l.name} ${l.pct.toFixed(1)}%`"
              aria-hidden="true"
            />
          </div>
          <ul class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-secondary">
            <li
              v-for="l in langBreakdown.slice(0, 6)"
              :key="l.name"
              class="flex items-center gap-1.5"
            >
              <LangDot :language="l.name" />
              <span class="text-text-tertiary">{{ l.pct.toFixed(1) }}%</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Branches -->
      <section
        v-if="!error"
        class="mt-4"
      >
        <header class="flex items-baseline justify-between mb-2">
          <h2 class="section-title mb-0">
            {{ t('repo_detail.sections.branches') }}
          </h2>
          <span class="text-[11px] text-text-tertiary">
            {{ branches.length }}
          </span>
        </header>
        <div
          v-if="loading && branches.length === 0"
          class="flex flex-col gap-1.5"
        >
          <Skeleton
            v-for="i in 3"
            :key="i"
            height="44px"
          />
        </div>
        <div
          v-else-if="branches.length === 0"
          class="card-base px-3.5 py-3 text-[12px] text-text-tertiary"
        >
          {{ t('repo_detail.empty.branches') }}
        </div>
        <ul
          v-else
          class="flex flex-col gap-1.5"
        >
          <li
            v-for="b in visibleBranches"
            :key="b.name"
            class="card-base px-3.5 py-2.5 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 min-w-0">
              <i
                class="i-tabler-git-branch text-[13px] text-text-tertiary flex-shrink-0"
                aria-hidden="true"
              />
              <span class="text-[12px] font-mono truncate">{{ b.name }}</span>
              <Badge
                v-if="b.protected"
                variant="neutral"
              >
                {{ t('repo_detail.badges.protected') }}
              </Badge>
            </div>
            <span class="text-[11px] text-text-tertiary flex-shrink-0">
              {{ format(b.commit.timestamp) }}
            </span>
          </li>
        </ul>
      </section>

      <!-- Commits -->
      <section
        v-if="!error"
        class="mt-4"
      >
        <h2 class="section-title">
          {{ t('repo_detail.sections.commits') }}
        </h2>
        <div
          v-if="loading && commits.length === 0"
          class="flex flex-col gap-1.5"
        >
          <Skeleton
            v-for="i in 3"
            :key="i"
            height="52px"
          />
        </div>
        <div
          v-else-if="commits.length === 0"
          class="card-base px-3.5 py-3 text-[12px] text-text-tertiary"
        >
          {{ t('repo_detail.empty.commits') }}
        </div>
        <ul
          v-else
          class="flex flex-col gap-1.5"
        >
          <li
            v-for="c in commits"
            :key="c.sha"
            class="card-base px-3.5 py-2.5"
          >
            <div class="flex items-baseline justify-between gap-2 mb-0.5">
              <span class="text-[12px] text-text-primary truncate">
                {{ firstLine(c.commit.message) }}
              </span>
              <span class="font-mono text-[10px] text-text-tertiary flex-shrink-0">
                {{ shortSha(c.sha) }}
              </span>
            </div>
            <div class="text-[11px] text-text-tertiary">
              {{ c.commit.author.name }} · {{ format(c.commit.author.date) }}
            </div>
          </li>
        </ul>
      </section>

      <!-- README -->
      <section
        v-if="!error"
        class="mt-4 mb-4"
      >
        <h2 class="section-title">
          {{ t('repo_detail.sections.readme') }}
        </h2>
        <div
          v-if="loading && readme === null && !readmeMissing"
          class="card-base px-3.5 py-3"
        >
          <Skeleton
            height="14px"
            width="80%"
          />
          <div class="h-1.5" />
          <Skeleton
            height="14px"
            width="60%"
          />
        </div>
        <div
          v-else-if="readmeMissing || readme === null"
          class="card-base px-3.5 py-3 text-[12px] text-text-tertiary"
        >
          {{ t('repo_detail.empty.readme') }}
        </div>
        <div
          v-else
          class="card-base px-3.5 py-3"
        >
          <!-- v1: raw text. Markdown rendering tracked in BACKLOG. -->
          <pre class="readme-text">{{ readme }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--c-text-tertiary);
  margin-bottom: 8px;
}

.lang-bar {
  display: flex;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: var(--c-bg-elevated);
}

.lang-bar-seg {
  display: block;
  height: 100%;
  opacity: 1;
}

.lang-bar-seg + .lang-bar-seg {
  opacity: 0.7;
}

.lang-bar-seg + .lang-bar-seg + .lang-bar-seg {
  opacity: 0.45;
}

.lang-bar-seg + .lang-bar-seg + .lang-bar-seg + .lang-bar-seg {
  opacity: 0.25;
}

.readme-text {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  color: var(--c-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 480px;
  overflow-y: auto;
  margin: 0;
}
</style>
