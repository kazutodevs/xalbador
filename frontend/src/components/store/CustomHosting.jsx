import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Cpu, MemoryStick, HardDrive } from 'lucide-react'
import { HOSTING_OPTIONS } from '@utils/constants'
import { formatCurrency, calculateHostingPrice } from '@utils/helpers'

export default function CustomHosting({ onChange, initialConfig = null }) {
  const { t } = useTranslation()
  const [config, setConfig] = useState(
    initialConfig || {
      cpu: HOSTING_OPTIONS.cpu.min,
      ram: HOSTING_OPTIONS.ram.min,
      storage: HOSTING_OPTIONS.storage.min,
    }
  )

  const price = calculateHostingPrice(config)

  useEffect(() => {
    onChange({ config, price })
  }, [config])

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const sliders = [
    {
      key: 'cpu',
      icon: Cpu,
      label: t('hosting.cpu'),
      options: HOSTING_OPTIONS.cpu,
      formatter: (v) => `${v} vCPU`,
    },
    {
      key: 'ram',
      icon: MemoryStick,
      label: t('hosting.ram'),
      options: HOSTING_OPTIONS.ram,
      formatter: (v) => (v >= 1024 ? `${v / 1024} GB` : `${v} MB`),
    },
    {
      key: 'storage',
      icon: HardDrive,
      label: t('hosting.storage'),
      options: HOSTING_OPTIONS.storage,
      formatter: (v) => `${v} GB SSD`,
    },
  ]

  return (
    <div className="space-y-8">
      {sliders.map((slider) => (
        <div key={slider.key} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <slider.icon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {slider.label}
              </span>
            </div>
            <span className="text-lg font-bold text-primary-600">
              {slider.formatter(config[slider.key])}
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min={slider.options.min}
              max={slider.options.max}
              step={slider.options.step}
              value={config[slider.key]}
              onChange={(e) => updateConfig(slider.key, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/30 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>{slider.formatter(slider.options.min)}</span>
              <span>{slider.formatter(slider.options.max)}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-2xl border border-primary-200 dark:border-primary-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {t('hosting.estimatedPrice')}
            </p>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
              {formatCurrency(price)}
              <span className="text-sm font-normal text-primary-500">/month</span>
            </p>
          </div>
          <div className="text-right text-sm text-primary-600 dark:text-primary-400">
            <p>{config.cpu} vCPU</p>
            <p>{config.ram >= 1024 ? `${config.ram / 1024} GB` : `${config.ram} MB`} RAM</p>
            <p>{config.storage} GB SSD</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
