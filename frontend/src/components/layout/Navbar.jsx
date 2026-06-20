// Navbar.jsx — Redesigned to match dark space / minimal aesthetic
//
// CHANGES vs. original:
//   • Logo: removed gradient box wrapper → plain img + white wordmark only
//   • Nav links: centered on desktop, minimal white/opacity treatment
//   • "Let's Talk!" CTA: restyled as rounded-full pill outline (btn-outline kept,
//     class augmented inline) to match the pill button in the inspiration
//   • Scrolled state: bg-black/60 + backdrop-blur instead of glass class, so the
//     navbar stays on-brand with the black hero below it
//   • Desktop right side: kept Globe (lang), Cart, Auth — removed Sun/Moon theme
//     toggle from the visible row (it conflicts with the pure-dark aesthetic);
//     theme toggle preserved in mobile menu so power users still have access
//   • Mobile menu: glass surface → bg-black/90 + border-white/10 to stay dark
//   • All other logic (scroll detection, auth guards, cart count, i18n) UNCHANGED

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
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
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
        // Change: scrolled/non-home → black frosted; on hero → fully transparent
        isScrolled || !isHome
          ? 'bg-black/60 backdrop-blur-md border-b border-white/8 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">

          {/* ── Logo ── */}
          {/* Change: removed gradient rounded-xl box; now plain img + white wordmark */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://kcdanyszvnympanrtjff.supabase.co/storage/v1/object/sign/xalbador/!xalbador.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mYzhmZjUxNC1lNmJiLTQzNDctYTM2YS1jMjdmZmI1MzY0MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ4YWxiYWRvci8heGFsYmFkb3IucG5nIiwiaWF0IjoxNzc5MzczNzg3LCJleHAiOjE4NzM5ODE3ODd9.rviJlCkpex_r8AVCUAY-xW59dkE5CaNJi_9HeXbsEZ4"
              alt="Xalbador"
              className="w-8 h-8 object-cover rounded-lg"
            />
            <span className="text-lg font-bold text-white tracking-tight">
              Xalbador
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          {/* Change: centered links, white/60 inactive → white active, no underline group */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={classNames(
                    'text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">

              {/* Language toggle — kept, icon-only to keep nav clean */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2 rounded-xl text-white/60 hover:text-white transition-colors"
                title={t('nav.language')}
              >
                <Globe className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              {isAuthenticated && (
                <Link to="/checkout" className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-xl text-white/60 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              )}

              {/* Auth / User */}
              {isAuthenticated ? (
                <UserMenu user={user} />
              ) : (
                <Link to="/auth">
                  <Button size="sm">{t('nav.login')}</Button>
                </Link>
              )}

              {/* "Let's Talk!" pill */}
              {/* Change: was btn-outline with default styling; now explicit rounded-full
                  pill with white border, matching the inspiration's top-right button */}
              <Link to="/contact">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    hidden lg:inline-flex items-center justify-center
                    px-5 py-2 rounded-full
                    border border-white/40 hover:border-white/80
                    text-white text-sm font-medium
                    transition-colors duration-150
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                  "
                >
                  {t('nav.letsTalk', "Let's Talk!")}
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-white/70 hover:text-white transition-colors md:hidden"
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

        {/* ── Mobile Menu ── */}
        {/* Change: glass → bg-black/90 with white/10 border to stay on-brand */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="bg-black/90 border border-white/10 rounded-2xl p-4 space-y-1 backdrop-blur-md">
                {navLinks.map((link) => {
                  if (link.protected && !isAuthenticated) return null
                  const isActive = location.pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={classNames(
                        'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}

                {/* Mobile utility row — kept theme toggle here for accessibility */}
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false) }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    {t('nav.language')}
                  </button>
                  <button
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false) }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {t('nav.theme')}
                  </button>
                </div>

                {/* Mobile CTA */}
                {!isAuthenticated && (
                  <div className="pt-2">
                    <Link
                      to="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-colors"
                    >
                      {t('nav.login')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}