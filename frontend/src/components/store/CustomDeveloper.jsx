import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Clock, ListOrdered, Gauge } from 'lucide-react'
import { DEVELOPER_OPTIONS } from '@utils/constants'
import { formatCurrency, calculateDeveloperPrice } from '@utils/helpers'
import { classNames } from '@utils/helpers'

export default function CustomDeveloper({ onChange, initialConfig = null }) {
  const { t, i18n } = useTranslation()
  const [config, setConfig] = useState(
    initialConfig || {
      duration: DEVELOPER_OPTIONS.duration.options[1],
      requests: DEVELOPER_OPTIONS.requests.min,
      complexity: DEVELOPER_OPTIONS.complexity.options[0],
    }
  )

  const price = calculateDeveloperPrice(config)

  useEffect(() => {
    onChange({ config, price })
  }, [config])

  return (
    <div className="space-y-8">
      {/* Duration */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Clock className="w-5 h-5 text-primary-600" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {t('developer.duration')}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DEVELOPER_OPTIONS.duration.options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig((prev) => ({ ...prev, duration: option }))}
              className={classNames(
                'p-4 rounded-xl border-2 transition-all text-center',
                config.duration.value === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
              )}
            >
              <span className="font-bold text-slate-900 dark:text-white">
                {i18n.language === 'id' ? option.labelId : option.label}
              </span>
              {option.multiplier < 1 && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  {Math.round((1 - option.multiplier) * 100)}% OFF
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <ListOrdered className="w-5 h-5 text-primary-600" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {t('developer.requests')}
            </span>
          </div>
          <span className="text-lg font-bold text-primary-600">
            {config.requests} {t('developer.revisions')}
          </span>
        </div>
        <input
          type="range"
          min={DEVELOPER_OPTIONS.requests.min}
          max={DEVELOPER_OPTIONS.requests.max}
          value={config.requests}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, requests: parseInt(e.target.value) }))
          }
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>

      {/* Complexity */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Gauge className="w-5 h-5 text-primary-600" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {t('developer.complexity')}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DEVELOPER_OPTIONS.complexity.options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig((prev) => ({ ...prev, complexity: option }))}
              className={classNames(
                'p-4 rounded-xl border-2 transition-all',
                config.complexity.value === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
              )}
            >
              <span className="font-bold text-slate-900 dark:text-white">
                {i18n.language === 'id' ? option.labelId : option.label}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                x{option.multiplier} {t('developer.priceMultiplier')}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-2xl border border-primary-200 dark:border-primary-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {t('developer.estimatedPrice')}
            </p>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
              {formatCurrency(price)}
            </p>
          </div>
          <div className="text-right text-sm text-primary-600 dark:text-primary-400">
            <p>
              {i18n.language === 'id'
                ? config.duration.labelId
                : config.duration.label}
            </p>
            <p>
              {config.requests} {t('developer.revisions')}
            </p>
            <p>
              {i18n.language === 'id'
                ? config.complexity.labelId
                : config.complexity.label}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
