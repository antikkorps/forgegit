import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppShell.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'repos' },
      },
      {
        path: 'repos',
        name: 'repos',
        component: () => import('@/views/RepoListView.vue'),
      },
      {
        path: 'repos/:owner/:repo',
        name: 'repo-detail',
        component: () => import('@/views/RepoDetailView.vue'),
        props: true,
      },
      {
        path: 'prs',
        name: 'prs',
        component: () => import('@/views/PullRequestListView.vue'),
      },
      {
        path: 'issues',
        name: 'issues',
        component: () => import('@/views/IssueListView.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'repos' }
  }
})
