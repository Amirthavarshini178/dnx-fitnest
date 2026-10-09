const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiBase) throw new Error('API is not configured')
  const token = localStorage.getItem('dnx-access-token')
  const response = await fetch(`${apiBase}/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  })
  if (response.status === 401 && path !== '/auth/refresh') {
    const refreshToken = localStorage.getItem('dnx-refresh-token')
    if (refreshToken) {
      const refresh = await fetch(`${apiBase}/api/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) })
      if (refresh.ok) {
        const tokens = await refresh.json() as { accessToken: string; refreshToken: string }
        localStorage.setItem('dnx-access-token', tokens.accessToken)
        localStorage.setItem('dnx-refresh-token', tokens.refreshToken)
        return apiRequest<T>(path, init)
      }
    }
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'The request could not be completed')
  return payload as T
}

export const isApiConfigured = Boolean(apiBase)