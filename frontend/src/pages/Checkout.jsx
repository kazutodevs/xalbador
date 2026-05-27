import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react'
import { useCart } from '@context/CartContext'
import { createPayment } from '@services/payment'
import Button from '@components/common/Button'
import { formatCurrency } from '@utils/helpers'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart()

  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')

  const total = getTotal()

  const normalizedPhone = phone
    .replace(/\D/g, '')
    .replace(/^0/, '62')

  const isPhoneValid = normalizedPhone.length >= 10

  const handlePayment = async () => {
    if (items.length === 0) return

if (!isPhoneValid) {
  toast.error('Please enter a valid phone number')
  return
}

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

        if (result.testMode) {
          toast.success(t('checkout.paymentSuccess'))

          navigate('/success', {
            state: {
              orderId: result.orderId,
              testMode: true,
            },
          })
        } else if (result.redirectUrl) {
          window.location.href = result.redirectUrl
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(t('checkout.paymentError'))
    } finally {
      setLoading(false)
    }
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
            <span className="gradient-text">
              {t('checkout.title')}
            </span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                      {item.name}
                    </h3>

                    {item.config && (
                      <p className="text-sm text-slate-500 mb-2">
                        {item.type === 'custom' &&
                          t('checkout.customConfiguration')}
                      </p>
                    )}

                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1,
                          item.config
                        )
                      }
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.config
                        )
                      }
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.config)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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

              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[60%]">
                      {item.name} x {item.quantity}
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('checkout.total')}
                  </span>

                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Phone Number */}
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
                disabled={!isPhoneValid}
                className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                {t('checkout.payNow')}
              </Button>

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