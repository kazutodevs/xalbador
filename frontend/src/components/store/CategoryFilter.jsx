import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import * as Icons from 'lucide-react'
import { CATEGORIES } from '@utils/constants'
import { classNames } from '@utils/helpers'

export default function CategoryFilter({ selected, onSelect }) {
  const { t, i18n } = useTranslation()

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null
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

      {CATEGORIES.map((category) => (
        <motion.button
          key={category.slug}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(category.slug)}
          className={classNames(
            'px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2',
            selected === category.slug
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          {getIcon(category.icon)}
          <span>{t(`categories.${category.slug}`)}</span>
        </motion.button>
      ))}
    </div>
  )
}
