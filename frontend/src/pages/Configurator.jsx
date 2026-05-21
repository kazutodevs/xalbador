import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@context/CartContext'
import CustomHosting from '@components/store/CustomHosting'
import CustomDeveloper from '@components/store/CustomDeveloper'
import Button from '@components/common/Button'
import toast from 'react-hot-toast'

export default function Configurator() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const [customConfig, setCustomConfig] = useState(null)

  const isHosting = type?.includes('hosting')
  const isDeveloper = type?.includes('developer') || type?.includes('bot')

  const handleConfigChange = (data) => {
    setCustomConfig(data)
  }

  const handleCheckout = () => {
    if (!customConfig) return

    addItem({
      id: `custom-${type}-${Date.now()}`,
      name: isHosting
        ? i18n.language === 'id'
          ? 'Custom Hosting'
          : 'Custom Hosting'
        : i18n.language === 'id'
        ? 'Custom Developer'
        : 'Custom Developer',
      price: customConfig.price,
      config: customConfig.config,
      type: 'custom',
      productType: isHosting ? 'hosting' : 'developer',
    })

    toast.success(t('cart.added'))
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    if (customConfig) {
      addItem({
        id: `custom-${type}-${Date.now()}`,
        name: isHosting ? 'Custom Hosting' : 'Custom Developer',
        price: customConfig.price,
        config: customConfig.config,
        type: 'custom',
        productType: isHosting ? 'hosting' : 'developer',
      })
      toast.success(t('cart.added'))
    }
    navigate('/store')
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{t('common.back')}</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
            <span className="gradient-text">
              {isHosting ? t('configurator.hosting.title') : t('configurator.developer.title')}
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isHosting
              ? t('configurator.hosting.subtitle')
              : t('configurator.developer.subtitle')}
          </p>
        </motion.div>

        {/* Configurator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          {isHosting ? (
            <CustomHosting onChange={handleConfigChange} />
          ) : isDeveloper ? (
            <CustomDeveloper onChange={handleConfigChange} />
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">{t('configurator.unsupported')}</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Button
            onClick={handleCheckout}
            disabled={!customConfig}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {t('configurator.checkout')}
          </Button>
          <Button
            variant="secondary"
            onClick={handleContinueShopping}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {t('configurator.continueShopping')}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
