import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { User, Settings, LogOut, ShoppingBag, ChevronDown } from 'lucide-react'
import { useAuth } from '@context/AuthContext'

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const { t } = useTranslation()
  const { logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { icon: User, label: t('menu.profile'), href: '/account' },
    { icon: ShoppingBag, label: t('menu.purchases'), href: '/account?tab=purchases' },
    { icon: Settings, label: t('menu.settings'), href: '/account?tab=settings' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl glass-button"
      >
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
        />
        <span className="hidden lg:block font-medium text-sm max-w-[100px] truncate">
          {user.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 glass rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* User Info */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setIsOpen(false)
                  logout()
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{t('menu.logout')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
