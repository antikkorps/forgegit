import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createForgejoApi } from '../useForgejoApi'

const ORIGINAL_FETCH = globalThis.fetch

function mockFetchOnce(status: number, body: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  ) as unknown as typeof fetch
}

// In test mode (Vitest), import.meta.env.DEV is true → the API client routes via /__forge/<host>.
// We assert that shape; in production (Capacitor) the URL is direct, but the wire-level behavior is identical.
function lastFetchUrl(): URL {
  const [url] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
  return new URL(String(url), 'http://localhost/')
}

describe('createForgejoApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH
  })

  it('strips trailing slashes from baseUrl and calls /user with token header (via dev proxy)', async () => {
    mockFetchOnce(200, { id: 1, login: 'franck', full_name: 'Franck', email: '', avatar_url: '', language: 'fr' })
    const api = createForgejoApi({ baseUrl: 'https://codeberg.org///', token: 'tok' })

    const res = await api.getCurrentUser()

    expect(res.ok).toBe(true)
    expect(globalThis.fetch).toHaveBeenCalledOnce()
    const u = lastFetchUrl()
    expect(u.pathname).toBe('/__forge/codeberg.org/api/v1/user')
    const init = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]
    const headers = new Headers((init as RequestInit).headers)
    expect(headers.get('authorization')).toBe('token tok')
    if (res.ok) expect(res.data.login).toBe('franck')
  })

  it('returns a structured error on 401', async () => {
    mockFetchOnce(401, { message: 'token is invalid' })
    const api = createForgejoApi({ baseUrl: 'https://codeberg.org', token: 'bad' })

    const res = await api.getCurrentUser()

    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error.status).toBe(401)
      expect(res.error.message).toContain('invalid')
    }
  })

  it('listMyRepos passes pagination query params', async () => {
    mockFetchOnce(200, [])
    const api = createForgejoApi({ baseUrl: 'https://codeberg.org', token: 'tok' })

    await api.listMyRepos({ page: 2, limit: 20 })

    const u = lastFetchUrl()
    expect(u.pathname).toBe('/__forge/codeberg.org/api/v1/user/repos')
    expect(u.searchParams.get('page')).toBe('2')
    expect(u.searchParams.get('limit')).toBe('20')
  })
})
