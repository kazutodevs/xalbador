// Home.jsx — only the Hero slot changed; all three sections below are untouched.
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Server,
  Bot,
  Code,
  Shield,
  Zap,
  Clock,
  HeadphonesIcon,
  Globe,
} from 'lucide-react'
import Hero from '@components/home/Hero'
import Card from '@components/common/Card'
import Button from '@components/common/Button'

export default function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
    },
    {
      icon: Shield,
      title: t('features.secure.title'),
      description: t('features.secure.description'),
    },
    {
      icon: Clock,
      title: t('features.uptime.title'),
      description: t('features.uptime.description'),
    },
    {
      icon: HeadphonesIcon,
      title: t('features.support.title'),
      description: t('features.support.description'),
    },
  ]

  const services = [
    {
      icon: Server,
      title: t('services.hosting.title'),
      description: t('services.hosting.description'),
      href: '/store?category=hosting-samp',
    },
    {
      icon: Bot,
      title: t('services.bot.title'),
      description: t('services.bot.description'),
      href: '/store?category=developer-bot',
    },
    {
      icon: Code,
      title: t('services.development.title'),
      description: t('services.development.description'),
      href: '/store?category=custom-script',
    },
    {
      icon: Globe,
      title: t('services.minecraft.title'),
      description: t('services.minecraft.description'),
      href: '/store?category=hosting-minecraft',
    },
  ]

  return (
    <>
      {/* Hero — full-bleed black, no wrapper padding needed */}
      <Hero />

      {/* Features Section — UNCHANGED */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-12 max-w-4xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('features.title')}
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} glass className="text-left p-8">
                <div className="w-14 h-14 mb-4 bg-[rgba(255,255,255,0.04)] rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section — UNCHANGED */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-12 max-w-4xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('services.title')}
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl">
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link to={service.href}>
                  <Card className="group flex items-start gap-6 p-8">
                    <div className="w-14 h-14 flex-shrink-0 bg-[rgba(255,255,255,0.03)] rounded-xl flex items-center justify-center group-hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                      <service.icon className="w-7 h-7 text-[var(--accent)] group-hover:text-[var(--accent-2)] transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-slate-300">
                        {service.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — UNCHANGED */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-card p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-lg text-slate-300 mb-8">{t('cta.subtitle')}</p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg">{t('cta.button')}</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">Contact Us</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}