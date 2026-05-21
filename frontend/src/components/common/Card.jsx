import { motion } from 'framer-motion'
import { classNames } from '@utils/helpers'

export default function Card({
  children,
  className = '',
  hover = true,
  glass = false,
  padding = 'p-6',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={classNames(
        'rounded-2xl',
        glass ? 'glass-card' : 'bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50',
        hover && 'card-hover',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
