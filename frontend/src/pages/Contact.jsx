// Contact.jsx — Contact page matching dark starfield / space aesthetic
//
// Follows the same visual system as Hero.jsx:
//   • bg-black full-bleed, same starfield background layer (shared STARS/STAR_KEYFRAMES)
//   • Space Grotesk-style display headline (display-hero class from globals)
//   • glass-card panels for the form and info blocks
//   • blue-500 accent for CTAs and highlights
//   • framer-motion entrance animations (same easing as Hero/Home)
//   • i18n via useTranslation — all strings have English fallbacks
//   • No new packages

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, MessageSquare, MapPin, Send, CheckCircle } from 'lucide-react'
import Button from '@components/common/Button'

// ─── Starfield (same system as Hero.jsx) ─────────────────────────────────────
const STAR_KEYFRAMES = `
@keyframes twinkle {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.8); }
}
`

function generateStars(count = 70) {
  let seed = 251            // different seed from Hero so star pattern differs
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
    color: rand() < 0.12 ? '#60a5fa' : '#ffffff',
  }))
}

const STARS = generateStars(70)

// ─── Contact info blocks ──────────────────────────────────────────────────────
function useContactInfo(t) {
  return [
    {
      icon: Mail,
      label: t('contact.info.email.label', 'Email'),
      value: t('contact.info.email.value', 'hello@xalbador.com'),
      href: 'mailto:hello@xalbador.com',
    },
    {
      icon: MessageSquare,
      label: t('contact.info.discord.label', 'Discord'),
      value: t('contact.info.discord.value', 'discord.gg/xalbador'),
      href: 'https://discord.gg/xalbador',
    },
    {
      icon: MapPin,
      label: t('contact.info.location.label', 'Location'),
      value: t('contact.info.location.value', 'Indonesia'),
      href: null,
    },
  ]
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  // Animate translate only; avoid animating opacity here so child
  // elements don't compound opacity changes (double-fade).
  initial: { y: 28 },
  animate: { y: 0 },
  transition: { duration: 0.65, delay, ease: 'easeOut' },
})

// ─── Component ────────────────────────────────────────────────────────────────
export default function Contact() {
  const { t } = useTranslation()
  const contactInfo = useContactInfo(t)

  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus]   = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const isValid = form.name.trim() && form.email.includes('@') && form.message.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) {
      setTouched({ name: true, email: true, subject: true, message: true })
      return
    }
    setStatus('sending')
    // ── Wire up your real endpoint here ──────────────────────────────────────
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
    // For now, simulates a 1.5 s network call:
    await new Promise((r) => setTimeout(r, 1500))
    setStatus('sent')
  }

  // ── Input base classes ────────────────────────────────────────────────────
  // Mirrors the existing glass aesthetic without importing a new component
  const inputBase = `
    w-full bg-white/5 border border-white/10
    rounded-xl px-4 py-3 text-white text-sm
    placeholder-white/30
    outline-none
    transition-colors duration-150
    focus:border-blue-500/70 focus:bg-white/8
    hover:border-white/20
  `
  const errorBorder = 'border-red-500/60'

  const fieldError = (key, msg) =>
    touched[key] && !form[key].trim() ? (
      <p className="mt-1 text-xs text-red-400">{msg}</p>
    ) : null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STAR_KEYFRAMES }} />

      <main className="relative min-h-screen w-full overflow-hidden bg-black">

        {/* ── Starfield ─────────────────────────────────────────────────────── */}
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

        {/* ── Page content ──────────────────────────────────────────────────── */}
        <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-24">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="mb-16 max-w-2xl">
            {/* Eyebrow — category-strip style from Hero */}
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              {t('contact.eyebrow', 'Get in touch')}
            </p>
            <h1
              className="display-hero text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
            >
              {t('contact.title', "Let's Build")}
              <br />
              <span className="text-white/80">{t('contact.titleLine2', 'Something Great')}</span>
            </h1>
            <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-lg">
              {t(
                'contact.subtitle',
                "Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you as soon as possible."
              )}
            </p>
          </motion.div>

          {/* Two-column layout — form left, info right (stacks on mobile) */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* ── Contact Form (3 cols) ──────────────────────────────────── */}
            <motion.div {...fadeUp(0.15)} className="lg:col-span-3">
              <div className="glass-card rounded-2xl border border-white/8 p-8">

                {status === 'sent' ? (
                  // Success state
                  // scale entrance only; parent already animates opacity
                  <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                    <CheckCircle className="w-14 h-14 text-blue-400 mb-5" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {t('contact.success.title', 'Message Sent!')}
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xs">
                      {t(
                        'contact.success.body',
                        "We've received your message and will get back to you within 24 hours."
                      )}
                    </p>
                    <button
                      onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); setTouched({}) }}
                      className="mt-8 text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                    >
                      {t('contact.success.again', 'Send another message')}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                          {t('contact.form.name', 'Name')}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t('contact.form.namePlaceholder', 'Your name')}
                          className={`${inputBase} ${touched.name && !form.name.trim() ? errorBorder : ''}`}
                          aria-required="true"
                        />
                        {fieldError('name', t('contact.form.nameError', 'Name is required'))}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                          {t('contact.form.email', 'Email')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t('contact.form.emailPlaceholder', 'you@example.com')}
                          className={`${inputBase} ${touched.email && !form.email.includes('@') ? errorBorder : ''}`}
                          aria-required="true"
                        />
                        {touched.email && !form.email.includes('@') && (
                          <p className="mt-1 text-xs text-red-400">
                            {t('contact.form.emailError', 'Valid email required')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                        {t('contact.form.subject', 'Subject')}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder={t('contact.form.subjectPlaceholder', 'What is this about?')}
                        className={inputBase}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                        {t('contact.form.message', 'Message')}
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={6}
                        placeholder={t('contact.form.messagePlaceholder', 'Tell us about your project...')}
                        className={`${inputBase} resize-none ${touched.message && !form.message.trim() ? errorBorder : ''}`}
                        aria-required="true"
                      />
                      {fieldError('message', t('contact.form.messageError', 'Message is required'))}
                    </div>

                    {/* Submit */}
                    <div className="pt-1">
                      {/* Primary CTA — same blue pill style as Hero */}
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="
                          inline-flex items-center justify-center gap-2
                          w-full sm:w-auto
                          pl-7 pr-3 py-2.5 rounded-full
                          bg-blue-500 hover:bg-blue-400 active:bg-blue-600
                          disabled:opacity-50 disabled:cursor-not-allowed
                          text-white text-sm font-medium
                          transition-colors duration-150
                          focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                        "
                      >
                        {status === 'sending'
                          ? t('contact.form.sending', 'Sending...')
                          : t('contact.form.send', 'Send Message')}
                        <span
                          aria-hidden="true"
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white leading-none"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Info Panel (2 cols) ────────────────────────────────────── */}
            <motion.div {...fadeUp(0.3)} className="lg:col-span-2 flex flex-col gap-5">

              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="glass-card rounded-2xl border border-white/8 p-6 flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Response time note */}
              <div className="glass-card rounded-2xl border border-white/8 p-6">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  {t('contact.info.response.label', 'Response Time')}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white leading-none">24h</span>
                  <span className="text-slate-400 text-sm">
                    {t('contact.info.response.sub', 'average reply time')}
                  </span>
                </div>
                <p className="mt-3 text-slate-500 text-xs leading-relaxed">
                  {t(
                    'contact.info.response.detail',
                    'We read every message personally and will respond within one business day.'
                  )}
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}