import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppLayout from './layouts/AppLayout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const FeaturePage = lazy(() => import('./pages/FeaturePage'))
const Login = lazy(() => import('./pages/Login'))
const PublicHome = lazy(() => import('./pages/PublicHome'))

const queryClient = new QueryClient()
const protectedPages = ['profile', 'attendance', 'workout', 'exercises', 'diet', 'progress', 'measurements', 'trainer', 'payments', 'notifications', 'announcements', 'support', 'settings']

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
}

function MembershipRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <AppLayout /> : <PublicHome />
}

export default function App() {
  return <AuthProvider><QueryClientProvider client={queryClient}><BrowserRouter><Suspense fallback={<div className="route-loading">DNX FITNEST <span /> LOADING</div>}><Routes>
    <Route path="/" element={<PublicHome />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Login register />} />
    <Route path="/forgot-password" element={<FeaturePage page="forgot-password" />} /><Route path="/reset-password" element={<FeaturePage page="reset-password" />} />
    <Route path="/membership" element={<MembershipRoute />}><Route index element={<FeaturePage page="membership" />} /></Route>
    {['about', 'trainers', 'facilities', 'programs', 'gallery', 'contact'].map((page) => <Route key={page} path={`/${page}`} element={<PublicHome />} />)}
    <Route element={<ProtectedLayout />}><Route path="/dashboard" element={<Dashboard />} />
      {protectedPages.map((page) => <Route key={page} path={`/${page}`} element={<FeaturePage page={page} />} />)}
    </Route><Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></BrowserRouter></QueryClientProvider></AuthProvider>
}
