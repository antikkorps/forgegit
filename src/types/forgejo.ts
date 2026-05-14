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

export interface ForgejoBranch {
  name: string
  commit: {
    id: string
    message: string
    timestamp: string
  }
  protected: boolean
}

export interface ForgejoCommitAuthor {
  name: string
  email: string
  username?: string
}

export interface ForgejoCommit {
  sha: string
  html_url: string
  commit: {
    message: string
    author: ForgejoCommitAuthor & { date: string }
    committer: ForgejoCommitAuthor & { date: string }
  }
  author: ForgejoUser | null
  committer: ForgejoUser | null
  created: string
}

// Forgejo /repos/{owner}/{repo}/languages returns a map of { language: bytes }.
export type ForgejoLanguages = Record<string, number>

// /repos/{owner}/{repo}/readme — base64 ContentsResponse.
export interface ForgejoContent {
  name: string
  path: string
  content: string | null
  encoding: 'base64' | string | null
}

export interface ApiError {
  status: number
  message: string
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError }
