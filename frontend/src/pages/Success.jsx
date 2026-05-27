import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Home, ShoppingBag, Copy, Check } from 'lucide-react'
import Button from '@components/common/Button'
import toast from 'react-hot-toast'

export default function Success() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const [orderData] = useState(location.state || {})
  const [searchParams] = useSearchParams()

  const orderId = searchParams.get('orderId') || orderData?.orderId
  const testMode = orderData?.testMode

  useEffect(() => {
    if (!orderId) {
      navigate('/store')
    }
  }, [orderId, navigate])

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
      setCopied(true)
      toast.success(t('success.orderIdCopied') || 'Order ID copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!orderId) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="glass-card p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {testMode ? t('Gokil') : t('success.orderConfirmed')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mb-8"
          >
            {testMode
              ? t('Berhasil beli coy') || 'This is a test transaction'
              : t('success.orderPlacedMessage') ||
                'Thank you for your order! We have received your payment.'}
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-700/50 rounded-xl p-6 mb-8 border border-slate-600/50"
          >
            <p className="text-sm text-slate-400 mb-2">{t('Nomor Orderan')}</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-mono font-bold text-white break-all">{orderId}</p>
              <button
                onClick={handleCopyOrderId}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-white transition-colors"
                title="Copy order ID"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-8 text-left"
          >
            <p className="text-sm text-blue-200">
              {testMode
                ? '🧪 This is a test transaction. No actual payment was made.'
                : '✓ We will send a confirmation email to your registered email address.'}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button
              onClick={() => navigate('/store')}
              className="w-full flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('success.continueShopping')}
            </Button>

            <button
              onClick={() => navigate('/')}
              className="w-full rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-semibold px-5 py-3 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {t('Back to Home')}
            </button>
          </motion.div>

          {/* Support Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-slate-500 mt-6"
          >
            {t('Need Help')}?{' '}
            <a href="mailto:support@xalbador.com" className="text-primary-400 hover:text-primary-300">
              contact support
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
