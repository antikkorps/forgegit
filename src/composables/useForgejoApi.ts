import { ofetch, type $Fetch, FetchError } from 'ofetch'
import type {
  ForgejoRepo,
  ForgejoUser,
  ForgejoBranch,
  ForgejoCommit,
  ForgejoLanguages,
  ForgejoContent,
  ApiError,
  Result,
} from '@/types/forgejo'

export interface ForgejoApiOptions {
  baseUrl: string
  token: string
}

export interface ListReposParams {
  page?: number
  limit?: number
}

export interface ListCommitsParams {
  sha?: string
  page?: number
  limit?: number
}

export interface ForgejoApi {
  getCurrentUser(): Promise<Result<ForgejoUser>>
  listMyRepos(params?: ListReposParams): Promise<Result<ForgejoRepo[]>>
  searchRepos(query: string, params?: ListReposParams): Promise<Result<ForgejoRepo[]>>
  getRepo(owner: string, repo: string): Promise<Result<ForgejoRepo>>
  listBranches(owner: string, repo: string, params?: ListReposParams): Promise<Result<ForgejoBranch[]>>
  listCommits(owner: string, repo: string, params?: ListCommitsParams): Promise<Result<ForgejoCommit[]>>
  getReadme(owner: string, repo: string, ref?: string): Promise<Result<ForgejoContent>>
  getLanguages(owner: string, repo: string): Promise<Result<ForgejoLanguages>>
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

// In browser dev, route requests through the Vite proxy to bypass CORS on
// self-hosted Forgejo instances. In production (Capacitor), hit the URL directly.
function resolveApiBase(baseUrl: string): string {
  const normalized = normalizeBaseUrl(baseUrl)
  if (import.meta.env.DEV) {
    try {
      const u = new URL(normalized)
      return `/__forge/${u.host}/api/v1`
    } catch {
      return `${normalized}/api/v1`
    }
  }
  return `${normalized}/api/v1`
}

function toApiError(err: unknown): ApiError {
  if (err instanceof FetchError) {
    return {
      status: err.response?.status ?? 0,
      message: (err.data as { message?: string })?.message ?? err.message,
    }
  }
  if (err instanceof Error) {
    return { status: 0, message: err.message }
  }
  return { status: 0, message: 'Unknown error' }
}

export function createForgejoApi(opts: ForgejoApiOptions): ForgejoApi {
  const client: $Fetch = ofetch.create({
    baseURL: resolveApiBase(opts.baseUrl),
    headers: {
      Authorization: `token ${opts.token}`,
      Accept: 'application/json',
    },
    retry: 0,
  })

  async function wrap<T>(fn: () => Promise<T>): Promise<Result<T>> {
    try {
      const data = await fn()
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: toApiError(err) }
    }
  }

  return {
    getCurrentUser() {
      return wrap(() => client<ForgejoUser>('/user'))
    },
    listMyRepos(params = {}) {
      return wrap(() =>
        client<ForgejoRepo[]>('/user/repos', {
          query: { page: params.page ?? 1, limit: params.limit ?? 50 },
        }),
      )
    },
    searchRepos(query, params = {}) {
      return wrap(() =>
        client<{ data: ForgejoRepo[] }>('/repos/search', {
          query: { q: query, page: params.page ?? 1, limit: params.limit ?? 50 },
        }).then((r) => r.data),
      )
    },
    getRepo(owner, repo) {
      return wrap(() => client<ForgejoRepo>(`/repos/${owner}/${repo}`))
    },
    listBranches(owner, repo, params = {}) {
      return wrap(() =>
        client<ForgejoBranch[]>(`/repos/${owner}/${repo}/branches`, {
          query: { page: params.page ?? 1, limit: params.limit ?? 50 },
        }),
      )
    },
    listCommits(owner, repo, params = {}) {
      return wrap(() =>
        client<ForgejoCommit[]>(`/repos/${owner}/${repo}/commits`, {
          query: {
            ...(params.sha ? { sha: params.sha } : {}),
            page: params.page ?? 1,
            limit: params.limit ?? 20,
          },
        }),
      )
    },
    getReadme(owner, repo, ref) {
      return wrap(() =>
        client<ForgejoContent>(`/repos/${owner}/${repo}/readme`, {
          query: ref ? { ref } : {},
        }),
      )
    },
    getLanguages(owner, repo) {
      return wrap(() => client<ForgejoLanguages>(`/repos/${owner}/${repo}/languages`))
    },
  }
}
