import { motion } from 'framer-motion'

export default function Loading({ fullScreen = false, size = 'default' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-500`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-500 dark:text-slate-400 font-medium"
      >
        Loading...
      </motion.p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-300 z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>
}
