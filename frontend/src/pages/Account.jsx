import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  User,
  Package,
  Settings,
  ExternalLink,
  Copy,
  Clock,
  Calendar,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import api from '@services/api'
import AdminPanel from '@components/admin/AdminPanel'
import Card from '@components/common/Card'
import { TableSkeleton } from '@components/common/Skeleton'
import { formatDate, formatCurrency, classNames } from '@utils/helpers'
import toast from 'react-hot-toast'

export default function Account() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const activeTab = searchParams.get('tab') || 'purchases'

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/user/purchases')
      setPurchases(response.data)
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success(t('account.copied'))
  }

  const tabs = [
    { id: 'purchases', label: t('account.tabs.purchases'), icon: Package },
    { id: 'profile', label: t('account.tabs.profile'), icon: User },
    { id: 'settings', label: t('account.tabs.settings'), icon: Settings },
  ]

  const renderPurchases = () => {
    if (loading) return <TableSkeleton rows={3} />

    if (purchases.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">{t('account.noPurchases')}</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Purchase Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={classNames(
                      'px-3 py-1 text-xs font-bold rounded-full',
                      purchase.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : purchase.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {t(`account.status.${purchase.status}`)}
                  </span>
                  <span className="text-sm text-slate-500">
                    {purchase.product_type === 'hosting' ? '🖥️ Hosting' : '💻 Developer'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {i18n.language === 'id' ? purchase.name_id : purchase.name_en}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(purchase.created_at)}
                  </span>
                  {purchase.expires_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {t('account.expiresOn')} {formatDate(purchase.expires_at)}
                    </span>
                  )}
                </div>
              </div>

              {/* Details based on type */}
              <div className="md:text-right">
                {purchase.product_type === 'hosting' && purchase.details && (
                  <div className="space-y-2">
                    {purchase.details.panel_url && (
                      <a
                        href={purchase.details.panel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                      >
                        {t('account.openPanel')}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {purchase.details.username && (
                      <p className="flex items-center justify-end gap-2 text-sm">
                        <span className="text-slate-500">User:</span>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {purchase.details.username}
                        </code>
                        <button
                          onClick={() => copyToClipboard(purchase.details.username)}
                          className="text-slate-400 hover:text-primary-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </p>
                    )}
                    {purchase.details.password && (
                      <p className="flex items-center justify-end gap-2 text-sm">
                        <span className="text-slate-500">Pass:</span>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {purchase.details.password}
                        </code>
                        <button
                          onClick={() => copyToClipboard(purchase.details.password)}
                          className="text-slate-400 hover:text-primary-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </p>
                    )}
                  </div>
                )}

                {purchase.product_type === 'developer' && purchase.details && (
                  <div className="space-y-2">
                    <a
                      href={purchase.details.contact_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('account.contactDeveloper')}
                    </a>
                    {purchase.details.progress && (
                      <p className="text-sm text-slate-500">
                        {t('account.progress')}: {purchase.details.progress}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const renderProfile = () => (
    <Card className="p-8">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user?.avatar_url || '/default-avatar.png'}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900"
        />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {user?.name}
          </h2>
          <p className="text-slate-500">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm font-medium rounded-full">
            {user?.provider === 'google' ? 'Google' : 'Discord'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-500">{t('account.memberSince')}</label>
          <p className="font-medium text-slate-900 dark:text-white">
            {formatDate(user?.created_at || new Date())}
          </p>
        </div>
      </div>
    </Card>
  )

  const renderSettings = () => (
    <Card className="p-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {t('account.settingsTitle')}
      </h2>
      <p className="text-slate-500 mb-6">{t('account.settingsComingSoon')}</p>

      {Number(user?.admin) === 1 ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700 dark:border-primary-700 dark:bg-primary-950/20 dark:text-primary-300">
            You are an admin. Use the button below to open the admin panel and add products or categories.
          </div>
          <button
            type="button"
            onClick={() => setShowAdminPanel((prev) => !prev)}
            className="rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold transition hover:bg-primary-700"
          >
            {showAdminPanel ? 'Hide Admin Panel' : 'Open Admin Panel'}
          </button>
          {showAdminPanel && <AdminPanel />}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Admin panel is available only for admin users.
        </div>
      )}
    </Card>
  )

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-display">
            <span className="gradient-text">{t('account.title')}</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-4 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={classNames(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {activeTab === 'purchases' && renderPurchases()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && renderSettings()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
