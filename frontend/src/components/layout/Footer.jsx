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
    <footer className="bg-slate-50 dark:bg-dark-200 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <span className="text-2xl font-bold font-display gradient-text">
                Xalbador
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
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
                  className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-sm">
                {t(`footer.${category}`)}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              © {currentYear} Xalbador. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">{t('footer.madeWith')}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-red-500"
              >
                ❤️
              </motion.span>
              <span className="text-slate-500 text-sm">{t('footer.inIndonesia')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
