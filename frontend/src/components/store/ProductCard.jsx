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
      // Tambahkan flex dan h-full agar tinggi card sama rata di dalam grid
      className="group glass-card overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      {/* Gunakan aspect-square di mobile, kembali ke h-48 di desktop */}
      <div className="relative aspect-square md:aspect-auto md:h-48 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={product.image_url || '/placeholder-product.png'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.is_custom && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-0.5 md:px-3 md:py-1 bg-[rgba(255,255,255,0.06)] text-white text-[10px] md:text-xs font-semibold rounded-full flex items-center gap-1 md:gap-2 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            <span className="hidden xs:inline md:inline">{t('product.customizable')}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      {/* Kurangi padding di mobile (p-2), gunakan flex-grow agar mengisi ruang kosong */}
      <div className="p-2 md:p-6 flex flex-col flex-grow">
        {/* Judul: text-xs di mobile, 2 baris (line-clamp-2) */}
        <h3 className="text-xs md:text-lg font-medium md:font-bold text-white mb-1 md:mb-2 line-clamp-2 md:line-clamp-1 leading-snug">
          {name}
        </h3>
        
        {/* Deskripsi: Sembunyikan di mobile (hidden md:-webkit-box) */}
        <p className="hidden md:block text-sm text-slate-300 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-2 mb-3 md:mb-4">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Wrapper untuk Harga & Tombol didorong ke paling bawah menggunakan mt-auto */}
        <div className="mt-auto">
          {/* Price */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-4">
            <div>
              <span className="text-sm md:text-2xl font-bold text-white">
                {formatCurrency(product.price)}
              </span>
              {product.is_custom && (
                <span className="text-[10px] md:text-sm text-slate-400 md:text-slate-300 ml-1 block md:inline">
                  {t('product.startFrom')}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {product.is_custom ? (
              <Button onClick={handleCustomize} className="flex-1 flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-sm py-1.5 md:py-3 px-2 rounded-lg md:rounded-xl">
                <Settings className="w-3 h-3 md:w-4 md:h-4" />
                <span className="truncate">{t('product.customize')}</span>
              </Button>
            ) : (
              <Button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-sm py-1.5 md:py-3 px-2 rounded-lg md:rounded-xl">
                <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                <span className="truncate">{t('product.addToCart')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}