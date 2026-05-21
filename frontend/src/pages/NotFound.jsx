import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '@components/common/Button'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="text-9xl font-bold font-display gradient-text mb-8"
        >
          404
        </motion.div>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {t('notFound.title')}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {t('notFound.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {t('notFound.backHome')}
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('notFound.goBack')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
