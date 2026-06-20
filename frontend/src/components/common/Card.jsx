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
      // avoid animating opacity here to prevent multiplicative (double) fades
      // when a parent element also animates opacity. Keep motion for
      // translate (y) only so children/parents don't produce compounded
      // opacity effects.
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={classNames(
        'rounded-2xl',
        glass ? 'glass-card' : 'glass-card',
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
