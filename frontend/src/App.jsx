import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '@components/layout/Layout'
import Loading from '@components/common/Loading'
import ProtectedRoute from '@components/auth/ProtectedRoute'

// Lazy load pages
const Home = lazy(() => import('@pages/Home'))
const Auth = lazy(() => import('@pages/Auth'))
const Store = lazy(() => import('@pages/Store'))
const Configurator = lazy(() => import('@pages/Configurator'))
const Checkout = lazy(() => import('@pages/Checkout'))
const Success = lazy(() => import('@pages/Success'))
const Account = lazy(() => import('@pages/Account'))
const NotFound = lazy(() => import('@pages/NotFound'))

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          },
        }}
      />
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route
              path="store"
              element={
                <ProtectedRoute>
                  <Store />
                </ProtectedRoute>
              }
            />
            <Route
              path="configure/:type"
              element={
                <ProtectedRoute>
                  <Configurator />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
