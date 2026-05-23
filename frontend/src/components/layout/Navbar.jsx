import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, Globe, ShoppingCart } from 'lucide-react'
import { useTheme } from '@context/ThemeContext'
import { useAuth } from '@context/AuthContext'
import { useCart } from '@context/CartContext'
import UserMenu from '@components/auth/UserMenu'
import Button from '@components/common/Button'
import { classNames } from '@utils/helpers'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const { getItemCount } = useCart()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const cartCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')
  }

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/store', label: t('nav.store'), protected: true },
    { href: '/account', label: t('nav.account'), protected: true },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled || !isHome
          ? 'glass py-3 shadow-lg'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 overflow-hidden"
            >
              <img
                src="https://kcdanyszvnympanrtjff.supabase.co/storage/v1/object/sign/xalbador/!xalbador.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mYzhmZjUxNC1lNmJiLTQzNDctYTM2YS1jMjdmZmI1MzY0MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ4YWxiYWRvci8heGFsYmFkb3IucG5nIiwiaWF0IjoxNzc5MzczNzg3LCJleHAiOjE4NzM5ODE3ODd9.rviJlCkpex_r8AVCUAY-xW59dkE5CaNJi_9HeXbsEZ4"
                alt="Xalbador"
                className="w-8 h-8 object-cover rounded-lg"
              />
            </motion.div>
            <span className="text-xl font-bold font-display gradient-text">
              Xalbador
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={classNames(
                    'font-medium transition-colors relative group',
                    location.pathname === link.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2 rounded-xl glass-button"
                title={t('nav.language')}
              >
                <Globe className="w-5 h-5" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-xl glass-button"
                title={t('nav.theme')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Cart */}
              {isAuthenticated && (
                <Link to="/checkout" className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-xl glass-button"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              )}

              {/* Auth / User Menu */}
              {isAuthenticated ? (
                <UserMenu user={user} />
              ) : (
                <Link to="/auth">
                  <Button size="sm">{t('nav.login')}</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl glass-button md:hidden"
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="glass rounded-2xl p-4 space-y-2">
                    {navLinks.map((link) => {
                  if (link.protected && !isAuthenticated) return null
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={classNames(
                        'block px-4 py-3 rounded-xl font-medium transition-colors',
                        location.pathname === link.href
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}

                <div className="mt-4 border-t border-slate-200/70 dark:border-slate-700/70 pt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      toggleLanguage()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-button"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('nav.language')}</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-button"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{t('nav.theme')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
