import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '@components/common/Button'

// ─── Starfield ────────────────────────────────────────────────────────────────
// @keyframes cannot be expressed in Tailwind without editing tailwind.config.js.
// This single <style> tag is the only non-Tailwind CSS in the file.
// To revert: delete <style> and STAR_KEYFRAMES — stars become static, no build error.
const STAR_KEYFRAMES = `
@keyframes twinkle {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.8); }
}
`

// Deterministic LCG so positions never change between renders (SSR-safe)
function generateStars(count = 90) {
  let seed = 137
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    return (seed >>> 0) / 0xffffffff
  }
  return Array.from({ length: count }, (_, id) => ({
    id,
    top:   `${(rand() * 100).toFixed(2)}%`,
    left:  `${(rand() * 100).toFixed(2)}%`,
    size:  rand() < 0.07 ? 3 : rand() < 0.28 ? 2 : 1,
    delay: `${(rand() * 7).toFixed(2)}s`,
    dur:   `${(2.5 + rand() * 4.5).toFixed(2)}s`,
    // ~12% carry the electric-blue accent tint from the inspiration
    color: rand() < 0.12 ? '#60a5fa' : '#ffffff',
  }))
}

const STARS = generateStars(90)
const CATEGORIES = ['AI', 'WEB3', 'UI', '3D', 'MOTION']

export default function Hero() {
  const { t } = useTranslation()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STAR_KEYFRAMES }} />

      <section
        aria-label="Hero"
        className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col"
      >
        {/* ── Starfield ── replaces video + blurred orb divs ───────────────── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {STARS.map((s) => (
            <span
              key={s.id}
              className="absolute rounded-full"
              style={{
                top:             s.top,
                left:            s.left,
                width:           `${s.size}px`,
                height:          `${s.size}px`,
                backgroundColor: s.color,
                animation:       `twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* ── Content ── bottom-anchored two-column layout ──────────────────── */}
        <div className="relative z-10 flex flex-1 flex-col lg:flex-row items-end px-6 sm:px-10 lg:px-16 pb-16 pt-28">

          {/* LEFT — headline + category strip */}
          <div className="flex flex-col justify-end flex-1 lg:pr-16">

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="display-hero text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)' }}
            >
              {/* Both lines white — inspiration has no accent-coloured second line */}
              <span className="block">{t('hero.titlePart1')}</span>
              <span className="block">{t('hero.titlePart2')}</span>
            </motion.h1>

            {/* Category strip — new element matching AI \ WEB3 \ UI \ 3D \ MOTION */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-x-3 mt-6"
              aria-label="Service categories"
            >
              {CATEGORIES.map((cat, i) => (
                <span key={cat} className="flex items-center gap-x-3">
                  <span className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-widest">
                    {cat}
                  </span>
                  {i < CATEGORIES.length - 1 && (
                    <span className="text-white/25 text-xs select-none" aria-hidden="true">\</span>
                  )}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — glass card with descriptor + CTAs */}
          {/* Kept glass-card class + border-white/6 from original right-side card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="mt-10 lg:mt-0 lg:max-w-xs w-full lg:w-auto"
          >
            <div className="glass-card p-8 rounded-2xl border border-white/6 text-right">
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {t('hero.rightBlurb', 'Crafting Awesome Stories and Killer Designs to Make Brands Stand Out.')}
              </p>

              <div className="flex items-center justify-end gap-3">
                {/* Secondary — existing Button ghost variant */}
                <Link to="/contact">
                  <Button variant="ghost" size="sm">
                    {t('hero.cta_contact', 'Contact Us')}
                  </Button>
                </Link>

                {/* Primary — filled blue pill with + badge matching the inspiration.
                    Uses a wrapper <span> styled as a pill because the existing Button
                    component doesn't expose a "filled blue pill" variant.
                    Safe Tailwind classes only: bg-blue-500, pl-5, pr-1.5, rounded-full */}
                <Link to="/auth" className="focus-visible:outline-none">
                  <span
                    className="
                      inline-flex items-center gap-2
                      pl-5 pr-1.5 py-1.5 rounded-full
                      bg-blue-500 hover:bg-blue-400 active:bg-blue-600
                      text-white text-sm font-medium
                      transition-colors duration-150 cursor-pointer
                      focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                    "
                    role="button"
                  >
                    {t('hero.getStarted', 'Get Started')}
                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white text-base font-light leading-none"
                    >
                      +
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  )
}