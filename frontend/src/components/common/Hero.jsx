import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  SparklesIcon,
  TruckIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const Hero = () => {
  const { t } = useTranslation('ecommerce');
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isRtl = currentLanguage === 'ar';

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-slate-50 via-teal-50/20 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 overflow-hidden pt-8 pb-16 lg:py-20 transition-colors duration-300">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] bg-teal-500/10 dark:bg-teal-500/15 pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full blur-[120px] bg-cyan-500/10 dark:bg-cyan-500/10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Content Column (7 cols on lg) */}
          <div className={`lg:col-span-7 ${isRtl ? 'text-right' : 'text-left'} space-y-6 sm:space-y-8`}>
            
            {/* Student Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-bold shadow-sm"
            >
              <SparklesIcon className="w-4 h-4 text-teal-500 animate-spin-slow" />
              <span>{t('home.hero.badge') || '🎓 The #1 Store for Dental Students & Clinical Kits'}</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]"
              >
                <span>{t('home.hero.mainTitle') || 'Precision Dental Kits for'}{' '}</span>
                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  {t('home.hero.mainTitleHighlight') || 'Future Dentists'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl"
              >
                {t('home.hero.subtitle') || 'University-approved phantom kits, German-grade stainless steel instruments, and complete academic bundles for dental medical students.'}
              </motion.p>
            </div>

            {/* Call To Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <Link
                to="/products"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <span>{t('home.hero.cta') || 'Shop Student Kits'}</span>
                <ArrowRightIcon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`} />
              </Link>

              <a
                href="#academic-stages"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm sm:text-base border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:border-teal-500/40"
              >
                {t('home.hero.exploreCatalog') || 'Browse by Year'}
              </a>
            </motion.div>

            {/* Live Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="pt-6 sm:pt-8 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            >
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-teal-600 dark:text-teal-400">15,000+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('home.hero.trust.students') || 'Students Equipped'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">40+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('home.hero.trust.universities') || 'Dental Faculties'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-teal-600 dark:text-teal-400">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('home.hero.trust.quality') || 'Medical Grade Steel'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">24/7</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('home.hero.trust.delivery') || 'Campus Shipping'}</p>
              </div>
            </motion.div>

          </div>

          {/* Right: Interactive Showcase Composition (5 cols on lg) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md lg:max-w-none"
            >
              {/* Backlight glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 rounded-[40px] blur-2xl -z-10 transform rotate-1" />

              {/* Main Card */}
              <div className="relative rounded-[36px] bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-4 sm:p-5">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center">
                  <img
                    src="/hero-tools.png"
                    alt="Dental Student Kit Tools"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Card Inlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                      <CheckBadgeIcon className="w-4 h-4 text-teal-400" />
                      <span className="font-semibold">Faculty Approved Kit</span>
                    </div>
                    <span className="font-bold text-teal-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-white/10">BDS Season</span>
                  </div>
                </div>

                {/* Floating Micro-Badge 1 (Top Right) */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className={`absolute -top-4 ${isRtl ? '-left-3 sm:-left-6' : '-right-3 sm:-right-6'} px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 shadow-xl flex items-center gap-2 z-20`}
                >
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
                    <AcademicCapIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Academic Tier</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">1st - 5th Year Kits</p>
                  </div>
                </motion.div>

                {/* Floating Micro-Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  className={`absolute -bottom-4 ${isRtl ? '-right-3 sm:-right-6' : '-left-3 sm:-left-6'} px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 shadow-xl flex items-center gap-2 z-20`}
                >
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                    <ShieldCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Standard</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">ISO 13485 Stainless Steel</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
