import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@context/CartContext'
import { useAuth } from '@context/AuthContext'
import api from '@services/api'
import { generateOrderNumber } from '@utils/helpers'
import { createPayment } from '@services/payment'
import Button from '@components/common/Button'
import { formatCurrency } from '@utils/helpers'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const inFlightRef = useRef(false)
  const updateTimerRef = useRef(null)

  // FIX: getTotal() dipanggil langsung saat render, otomatis reactive karena
  // items berubah → komponen re-render → getTotal() dihitung ulang
  const total = getTotal()

  const normalizedPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  const isPhoneValid = normalizedPhone.length >= 10

  const handlePayment = async () => {
    if (items.length === 0) return
    if (!isPhoneValid) {
      toast.error('Please enter a valid phone number')
      return
    }

    // Prevent double submission: synchronous ref prevents race between clicks and state updates
    if (inFlightRef.current) return
    inFlightRef.current = true
    setLoading(true)
    try {
      const result = await createPayment({
        items,
        total,
        currency: 'IDR',
        phone: normalizedPhone,
      })

      if (result.success) {
        clearCart()
        if (result.testMode || result.adminBypass) {
          toast.success(t('checkout.paymentSuccess'))
          navigate('/success', { state: { orderId: result.orderId, testMode: !!result.testMode, adminBypass: !!result.adminBypass } })
        } else if (result.redirectUrl) {
          window.location.href = result.redirectUrl
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(t('checkout.paymentError'))
    } finally {
      setLoading(false)
      inFlightRef.current = false
    }
  }

  const handleAdminDummyPay = async () => {
    // Only for admin users
    if (!(Number(user?.admin) === 1)) return

    if (items.length === 0) return

    if (inFlightRef.current) return
    inFlightRef.current = true
    setLoading(true)
    try {
      const orderNumber = generateOrderNumber()
      const body = {
        orderNumber,
        items,
        total,
        currency: 'IDR',
      }

      const resp = await api.post('/payment/create', body)
      const result = resp.data

      if (result?.success) {
        clearCart()
        toast.success(t('checkout.paymentSuccess'))
        navigate('/success', { state: { orderId: result.orderId || orderNumber, adminBypass: !!result.adminBypass } })
      } else {
        toast.error(t('checkout.paymentError'))
      }
    } catch (error) {
      console.error('Admin dummy pay error:', error)
      toast.error(t('checkout.paymentError'))
    } finally {
      setLoading(false)
      inFlightRef.current = false
    }
  }

  // cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current)
    }
  }, [])

  const scheduleUpdateClear = () => {
    setIsUpdating(true)
    if (updateTimerRef.current) clearTimeout(updateTimerRef.current)
    updateTimerRef.current = setTimeout(() => {
      setIsUpdating(false)
      updateTimerRef.current = null
    }, 500)
  }

  const handleDecrease = (item) => {
    const newQty = Number(item.quantity) - 1
    updateQuantity(item.id, newQty, item.config)
    scheduleUpdateClear()
  }

  const handleIncrease = (item) => {
    const newQty = Number(item.quantity) + 1
    updateQuantity(item.id, newQty, item.config)
    scheduleUpdateClear()
  }

  const handleRemove = (item) => {
    removeItem(item.id, item.config)
    scheduleUpdateClear()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {t('checkout.emptyCart')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t('checkout.emptyCartSubtitle')}
          </p>
          <Button onClick={() => navigate('/store')}>
            {t('checkout.browseProducts')}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold font-display">
            <span className="gradient-text">{t('checkout.title')}</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${JSON.stringify(item.config)}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    {item.config && item.type === 'custom' && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t('checkout.customConfiguration')}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {formatCurrency(item.price)} / item
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Decrease quantity"
                      disabled={isUpdating}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-8 text-center font-semibold text-slate-900 dark:text-white tabular-nums">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Increase quantity"
                      disabled={isUpdating}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <div className="ml-auto text-right">
                      <p className="font-bold text-primary-600">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Remove item"
                      disabled={isUpdating}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {t('checkout.orderSummary')}
              </h2>

              {/* Line items */}
              <div className="space-y-3 mb-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[60%]">
                      {item.name}
                      <span className="ml-1 text-slate-400">×{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total — reactive karena total = getTotal() dipanggil ulang setiap render */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('checkout.total')}
                  </span>
                  <span className="text-2xl font-bold text-primary-600 tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                {!isPhoneValid && phone.length > 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    Please enter a valid phone number
                  </p>
                )}
              </div>

              <Button
                onClick={handlePayment}
                loading={loading}
                disabled={!isPhoneValid || loading || isUpdating}
                className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                {t('checkout.payNow')}
              </Button>

              {Number(user?.admin) === 1 && (
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    onClick={handleAdminDummyPay}
                    loading={loading}
                    disabled={items.length === 0 || loading || isUpdating}
                    className="w-full"
                  >
                    Dummy pay for admin only
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    Admins: phone number not required for dummy payments.
                  </p>
                </div>
              )}

              <p className="text-xs text-center text-slate-500 mt-4">
                {t('checkout.securePayment')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}