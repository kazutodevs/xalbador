import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import api from '@services/api'
import ProductCard from '@components/store/ProductCard'
import CategoryFilter from '@components/store/CategoryFilter'
import { ProductCardSkeleton } from '@components/common/Skeleton'

export default function Store() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const selectedCategory = searchParams.get('category')

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = selectedCategory ? { category: selectedCategory } : {}
      const response = await api.get('/products', { params })
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category) => {
    if (category) {
      setSearchParams({ category })
    } else {
      setSearchParams({})
    }
  }

  const filteredProducts = products.filter((product) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      product.name_en.toLowerCase().includes(searchLower) ||
      product.name_id.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="gradient-text">{t('store.title')}</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {t('store.subtitle')}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mb-12"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('store.search')}
              className="input-primary pl-12"
            />
          </div>

          {/* Categories */}
          <CategoryFilter
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-slate-500">{t('store.noProducts')}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
