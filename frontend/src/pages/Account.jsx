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
  Eye,
  X,
} from 'lucide-react'

import { useAuth } from '@context/AuthContext'
import api from '@services/api'
import AdminPanel from '@components/admin/AdminPanel'
import Card from '@components/common/Card'
import { TableSkeleton } from '@components/common/Skeleton'
import {
  formatDate,
  formatCurrency,
  classNames,
} from '@utils/helpers'

import toast from 'react-hot-toast'

export default function Account() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()

  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const [selectedPurchase, setSelectedPurchase] = useState(null)

  const activeTab =
    searchParams.get('tab') || 'purchases'

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/user/purchases')
      setPurchases(response.data)
    } catch (error) {
      console.error(
        'Failed to fetch purchases:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)

    toast.success(t('account.copied'))
  }

  const tabs = [
    {
      id: 'purchases',
      label: t('account.tabs.purchases'),
      icon: Package,
    },
    {
      id: 'profile',
      label: t('account.tabs.profile'),
      icon: User,
    },
    {
      id: 'settings',
      label: t('account.tabs.settings'),
      icon: Settings,
    },
  ]

  const renderPurchaseModal = () => {
    if (!selectedPurchase) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Purchase Details
              </h2>

              <p className="text-sm text-slate-400">
                Full information about your purchase
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedPurchase(null)
              }
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-sm text-slate-400">
                Product
              </p>

              <h3 className="text-lg font-bold text-white">
                {selectedPurchase.order_item?.name ||
                  selectedPurchase.name ||
                  'Unknown Product'}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-slate-400">
                  Status
                </p>

                <p className="font-semibold capitalize text-green-400">
                  {selectedPurchase.status}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-slate-400">
                  Created At
                </p>

                <p className="text-white">
                  {formatDate(
                    selectedPurchase.created_at
                  )}
                </p>
              </div>

              {selectedPurchase.expires_at && (
                <div>
                  <p className="mb-1 text-sm text-slate-400">
                    Expiration
                  </p>

                  <p className="text-white">
                    {formatDate(
                      selectedPurchase.expires_at
                    )}
                  </p>
                </div>
              )}

              <div>
                <p className="mb-1 text-sm text-slate-400">
                  Product Type
                </p>

                <p className="text-white capitalize">
                  {selectedPurchase.product_type}
                </p>
              </div>
            </div>

            {/* Config */}
            <div>
              <p className="mb-3 text-sm text-slate-400">
                Configuration / Details
              </p>

              <pre className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-green-400">
{JSON.stringify(
  selectedPurchase.details || {},
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPurchases = () => {
    if (loading)
      return <TableSkeleton rows={3} />

    if (purchases.length === 0) {
      return (
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-slate-300 dark:text-slate-600" />

          <p className="text-slate-500">
            {t('account.noPurchases')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card
            key={purchase.id}
            className="p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              {/* Left */}
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={classNames(
                      'rounded-full px-3 py-1 text-xs font-bold',
                      purchase.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : purchase.status ===
                          'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {t(
                      `account.status.${purchase.status}`
                    )}
                  </span>

                  <span className="text-sm text-slate-500">
                    {purchase.product_type ===
                    'hosting'
                      ? '🖥️ Hosting'
                      : '💻 Developer'}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {purchase.order_item?.name ||
                    purchase.name ||
                    'Unknown Product'}
                </h3>

                {/* Price */}
                {purchase.order_item?.price && (
                  <p className="mb-3 text-lg font-bold text-primary-600">
                    {formatCurrency(
                      purchase.order_item.price
                    )}
                  </p>
                )}

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />

                    {formatDate(
                      purchase.created_at
                    )}
                  </span>

                  {purchase.expires_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />

                      {t('account.expiresOn')}{' '}
                      {formatDate(
                        purchase.expires_at
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="space-y-3 md:text-right">
                {/* Hosting */}
                {purchase.product_type ===
                  'hosting' &&
                  purchase.details && (
                    <div className="space-y-2">
                      {purchase.details
                        .panel_url && (
                        <a
                          href={
                            purchase.details
                              .panel_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                        >
                          {t(
                            'account.openPanel'
                          )}

                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      {purchase.details
                        .username && (
                        <p className="flex items-center justify-end gap-2 text-sm">
                          <span className="text-slate-500">
                            User:
                          </span>

                          <code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
                            {
                              purchase.details
                                .username
                            }
                          </code>

                          <button
                            onClick={() =>
                              copyToClipboard(
                                purchase.details
                                  .username
                              )
                            }
                            className="text-slate-400 hover:text-primary-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </p>
                      )}
                    </div>
                  )}

                {/* Developer */}
                {purchase.product_type ===
                  'developer' &&
                  purchase.details && (
                    <div className="space-y-2">
                      <a
                        href={
                          purchase.details
                            .contact_url || '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 text-primary-600 transition-colors hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                      >
                        <MessageCircle className="h-4 w-4" />

                        {t(
                          'account.contactDeveloper'
                        )}
                      </a>

                      {purchase.details
                        .progress && (
                        <p className="text-sm text-slate-500">
                          {t(
                            'account.progress'
                          )}
                          :{' '}
                          {
                            purchase.details
                              .progress
                          }
                          %
                        </p>
                      )}
                    </div>
                  )}

                {/* Details Button */}
                <button
                  onClick={() =>
                    setSelectedPurchase(
                      purchase
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  <Eye className="h-4 w-4" />

                  {purchase.product_type ===
                  'hosting'
                    ? 'Configure'
                    : 'View Details'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const renderProfile = () => (
    <Card className="p-8">
      <div className="mb-8 flex items-center gap-6">
        <img
          src={
            user?.avatar_url ||
            '/default-avatar.png'
          }
          alt={user?.name}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900"
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {user?.name}
          </h2>

          <p className="text-slate-500">
            {user?.email}
          </p>

          <span className="mt-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600 dark:bg-primary-900/30">
            {user?.provider === 'google'
              ? 'Google'
              : 'Discord'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-500">
            {t('account.memberSince')}
          </label>

          <p className="font-medium text-slate-900 dark:text-white">
            {formatDate(
              user?.created_at || new Date()
            )}
          </p>
        </div>
      </div>
    </Card>
  )

  const renderSettings = () => (
    <Card className="p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        {t('account.settingsTitle')}
      </h2>

      <p className="mb-6 text-slate-500">
        {t('account.settingsComingSoon')}
      </p>

      {Number(user?.admin) === 1 ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700 dark:border-primary-700 dark:bg-primary-950/20 dark:text-primary-300">
            You are an admin. Use the button
            below to open the admin panel and
            add products or categories.
          </div>

          <button
            type="button"
            onClick={() =>
              setShowAdminPanel(
                (prev) => !prev
              )
            }
            className="rounded-2xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            {showAdminPanel
              ? 'Hide Admin Panel'
              : 'Open Admin Panel'}
          </button>

          {showAdminPanel && <AdminPanel />}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Admin panel is available only for
          admin users.
        </div>
      )}
    </Card>
  )

  return (
    <div className="min-h-screen pb-12 pt-24">
      {renderPurchaseModal()}

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold">
            <span className="gradient-text">
              {t('account.title')}
            </span>
          </h1>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="lg:col-span-1"
          >
            <div className="glass-card sticky top-24 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setSearchParams({
                      tab: tab.id,
                    })
                  }
                  className={classNames(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <tab.icon className="h-5 w-5" />

                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="lg:col-span-3"
          >
            {activeTab === 'purchases' &&
              renderPurchases()}

            {activeTab === 'profile' &&
              renderProfile()}

            {activeTab === 'settings' &&
              renderSettings()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}