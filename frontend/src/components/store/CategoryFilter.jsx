import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '@services/api'
import { classNames } from '@utils/helpers'

export default function CategoryFilter({ selected, onSelect }) {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(null)}
        className={classNames(
          'px-4 py-2 rounded-xl font-medium transition-all',
          !selected
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        )}
      >
        {t('store.all')}
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(category.slug)}
          className={classNames(
            'px-4 py-2 rounded-xl font-medium transition-all',
            selected === category.slug
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  )
}
