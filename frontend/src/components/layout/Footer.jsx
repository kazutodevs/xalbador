import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Github, Twitter, MessageCircle } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: t('footer.hosting'), href: '/store?category=hosting-samp' },
      { label: t('footer.developer'), href: '/store?category=developer-bot' },
      { label: t('footer.minecraft'), href: '/store?category=hosting-minecraft' },
    ],
    company: [
      { label: t('footer.about'), href: '/about' },
      { label: t('footer.contact'), href: '/contact' },
      { label: t('footer.careers'), href: '/careers' },
    ],
    legal: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
      { label: t('footer.refund'), href: '/refund' },
    ],
  }

  const socials = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg', label: 'Discord' },
  ]

  return (
    <footer className="relative border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
                <img
                  src="https://kcdanyszvnympanrtjff.supabase.co/storage/v1/object/sign/xalbador/!xalbador.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mYzhmZjUxNC1lNmJiLTQzNDctYTM2YS1jMjdmZmI1MzY0MzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ4YWxiYWRvci8heGFsYmFkb3IucG5nIiwiaWF0IjoxNzc5MzczNzg3LCJleHAiOjE4NzM5ODE3ODd9.rviJlCkpex_r8AVCUAY-xW59dkE5CaNJi_9HeXbsEZ4"
                  alt="Xalbador"
                  className="w-10 h-10 object-cover rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold gradient-text">
                Xalbador
              </span>
            </Link>
            <p className="text-slate-300 mb-6 max-w-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-slate-200 hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-slate-200 mb-4 uppercase tracking-wider text-sm">
                {t(`footer.${category}`)}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} Xalbador. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">{t('footer.madeWith')}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[var(--accent)]"
              >
                Prince
              </motion.span>
              <span className="text-slate-400 text-sm">{t('footer.inIndonesia')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
