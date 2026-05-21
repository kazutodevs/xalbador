import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Shield } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import AuthButtons from '@components/auth/AuthButtons'
import { generateSessionId } from '@utils/helpers'

export default function Auth() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, handleAuthCallback } = useAuth()

  useEffect(() => {
    // Handle OAuth callback
    const token = searchParams.get('token')
    if (token) {
      handleAuthCallback(token).then(() => {
        const sessionId = generateSessionId()
        navigate(`/store?session=${sessionId}`, { replace: true })
      })
      return
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      const sessionId = generateSessionId()
      navigate(`/store?session=${sessionId}`, { replace: true })
    }
  }, [isAuthenticated, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-300 dark:via-dark-200 dark:to-primary-950" />
      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-96 h-96 border border-primary-200 dark:border-primary-800 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 w-80 h-80 border border-primary-200 dark:border-primary-800 rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 overflow-hidden">
              <img
                src="https://kcdanyszvnympanrtjff.supabase.co/storage/v1/object/sign/xalbador/!xalbador.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mYzhmZjUxNC1lNmJiLTQzNDctYTM2YS1jMjdmZmI1MzY0MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ4YWxiYWRvci8heGFsYmFkb3IucG5nIiwiaWF0IjoxNzc5MzczNzg3LCJleHAiOjE4NzM5ODE3ODd9.rviJlCkpex_r8AVCUAY-xW59dkE5CaNJi_9HeXbsEZ4"
                alt="Xalbador"
                className="w-12 h-12 object-cover rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {t('auth.welcome')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Auth Buttons */}
          <AuthButtons />

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            <span>{t('auth.secure')}</span>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-slate-500 mt-6">
          {t('auth.terms.prefix')}{' '}
          <a href="/terms" className="text-primary-600 hover:underline">
            {t('auth.terms.tos')}
          </a>{' '}
          {t('auth.terms.and')}{' '}
          <a href="/privacy" className="text-primary-600 hover:underline">
            {t('auth.terms.privacy')}
          </a>
        </p>
      </motion.div>
    </div>
  )
}
