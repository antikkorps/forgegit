// Forgejo API types (Gitea-compatible).
// Intentional subset — only the fields the app uses.

export interface ForgejoUser {
  id: number
  login: string
  full_name: string
  email: string
  avatar_url: string
  language: string
}

export interface ForgejoRepoOwner {
  id: number
  login: string
  avatar_url: string
  full_name: string
}

export interface ForgejoRepo {
  id: number
  name: string
  full_name: string
  description: string
  private: boolean
  fork: boolean
  archived: boolean
  empty: boolean
  owner: ForgejoRepoOwner
  default_branch: string
  language: string | null
  stars_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  open_pr_counter: number
  updated_at: string
  created_at: string
  html_url: string
}

export interface ApiError {
  status: number
  message: string
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError }
