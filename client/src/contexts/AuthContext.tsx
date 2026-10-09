import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { apiRequest, isApiConfigured } from '../api/client'

type Credentials = { email: string; password: string }
type Registration = Credentials & { fullName: string; phone: string; dateOfBirth?: string; gender?: string; address?: string; emergencyContactName?: string; emergencyContactNumber?: string; bloodGroup?: string }
type AuthContextValue = { isAuthenticated: boolean; login: (values: Credentials) => Promise<void>; register: (values: Registration) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('dnx-member')))
  const saveSession = (user: { email: string; name?: string }, accessToken?: string, refreshToken?: string) => {
    localStorage.setItem('dnx-member', JSON.stringify(user))
    if (accessToken) localStorage.setItem('dnx-access-token', accessToken)
    if (refreshToken) localStorage.setItem('dnx-refresh-token', refreshToken)
    setIsAuthenticated(true)
  }
  const login = async (values: Credentials) => {
    if (isApiConfigured) {
      const result = await apiRequest<{ user: { email: string }; accessToken: string; refreshToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ identifier: values.email, password: values.password }) })
      saveSession(result.user, result.accessToken, result.refreshToken)
    } else if (values.email === 'demo@dnxfitnest.com' && values.password === 'Demo@123') {
      saveSession({ email: values.email, name: 'Arjun Kumar' })
    } else {
      throw new Error('Use the demo account shown below, or configure the API.')
    }
  }
  const register = async (values: Registration) => {
    if (isApiConfigured) {
      const result = await apiRequest<{ user: { email: string }; accessToken: string; refreshToken: string }>('/auth/register', { method: 'POST', body: JSON.stringify(values) })
      saveSession(result.user, result.accessToken, result.refreshToken)
    } else {
      saveSession({ email: values.email, name: values.fullName })
    }
  }
  const logout = () => { localStorage.removeItem('dnx-member'); localStorage.removeItem('dnx-access-token'); localStorage.removeItem('dnx-refresh-token'); setIsAuthenticated(false) }
  return <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}