import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import useDebounce from '@hooks/useDebounce'
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
  const [isMobile, setIsMobile] = useState(false)

  const selectedCategory = searchParams.get('category')

  const debouncedSearch = useDebounce(search, 350)

  const controllerRef = useRef(null)
  const lastParamsRef = useRef(null)

  useEffect(() => {
    // build key for params to avoid duplicate requests
    const key = `${selectedCategory || ''}::${debouncedSearch || ''}`
    if (lastParamsRef.current === key) {
      return
    }

    // abort previous
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    const doFetch = async () => {
      setLoading(true)
      try {
        const params = selectedCategory ? { category: selectedCategory } : {}
        if (debouncedSearch && debouncedSearch.trim() !== '') params.q = debouncedSearch
        // mark as requested to prevent duplicates
        lastParamsRef.current = key
        const response = await api.get('/products', { params, signal: controller.signal })
        setProducts(response.data)
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.error('Failed to fetch products:', error)
        }
        // on error reset lastParams so retrying is possible
        lastParamsRef.current = null
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    doFetch()

    return () => {
      controller.abort()
    }
  }, [selectedCategory, debouncedSearch])

  const immediateFetch = async (query = search) => {
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setLoading(true)
    try {
      const params = selectedCategory ? { category: selectedCategory } : {}
      if (query && query.trim() !== '') params.q = query
      const response = await api.get('/products', { params, signal: controller.signal })
      setProducts(response.data)
    } catch (error) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error('Failed to fetch products:', error)
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      product.name_en?.toLowerCase().includes(searchLower) ||
      product.name_id?.toLowerCase().includes(searchLower)
    )
  })

  const isDesktop = !isMobile
  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }
    : {}

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        {isDesktop ? (
          <motion.div
            {...motionProps}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('store.title')}
            </h1>

            <p className="text-lg text-slate-300">
              {t('store.subtitle')}
            </p>
          </motion.div>
        ) : (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-3 text-white">
              {t('store.title')}
            </h1>
            <p className="text-base text-slate-300">
              {t('store.subtitle')}
            </p>
          </div>
        )}

        {/* Search & Filters */}
        {isDesktop ? (
          <motion.div
            {...motionProps}
            transition={{ delay: 0.1 }}
            className="space-y-6 mb-12"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') immediateFetch() }}
                placeholder={t('store.search')}
                className="input-primary pl-12"
              />
            </div>

            <CategoryFilter
              selected={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </motion.div>
        ) : (
          <div className="space-y-4 mb-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') immediateFetch() }}
                placeholder={t('store.search')}
                className="input-primary pl-11 w-full"
              />
            </div>
            <CategoryFilter
              selected={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            {...motionProps}
            className="text-center py-20"
          >
            <p className="text-xl text-slate-500">
              {t('store.noProducts')}
            </p>
          </motion.div>
        ) : isDesktop ? (
          <motion.div
            {...motionProps}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} animated />
            ))}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} animated={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}