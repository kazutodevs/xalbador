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
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-dark-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              <span className="gradient-text">{t('features.title')}</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} glass className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              <span className="gradient-text">{t('services.title')}</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.href}>
                  <Card className="group flex items-start gap-6">
                    <div className="w-14 h-14 flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                      <service.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              {t('cta.subtitle')}
            </p>
            <Link to="/auth">
<Button
  size="lg"
  variant="secondary"
  className="bg-white text-primary-700 hover:bg-white/90 shadow-2xl"
>
  {t('cta.button')}
</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
