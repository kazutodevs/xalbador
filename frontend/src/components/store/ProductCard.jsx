import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Settings, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@context/CartContext'
import Button from '@components/common/Button'
import { formatCurrency } from '@utils/helpers'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const name = i18n.language === 'id' ? product.name_id : product.name_en
  const description = i18n.language === 'id' ? product.description_id : product.description_en

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name,
      price: product.price,
      image: product.image_url,
      type: product.is_custom ? 'custom' : 'preset',
    })
    toast.success(t('cart.added'))
  }

  const handleCustomize = () => {
    navigate(`/configure/${product.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group glass-card overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img
          src={product.image_url || '/placeholder-product.png'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.is_custom && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-[rgba(255,255,255,0.06)] text-white text-xs font-semibold rounded-full flex items-center gap-2 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            {t('product.customizable')}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-slate-300 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-white">
              {formatCurrency(product.price)}
            </span>
            {product.is_custom && (
              <span className="text-sm text-slate-300 ml-1">{t('product.startFrom')}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {product.is_custom ? (
            <Button onClick={handleCustomize} className="flex-1 flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              {t('product.customize')}
            </Button>
          ) : (
            <Button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t('product.addToCart')}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
