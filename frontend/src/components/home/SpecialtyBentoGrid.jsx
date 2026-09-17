import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  WrenchScrewdriverIcon,
  BeakerIcon,
  ScissorsIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowRightIcon,
  CubeTransparentIcon,
  EyeIcon,
  ShieldCheckIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const specialties = [
  {
    title: 'Pre-Clinical Phantom & Anatomy',
    subtitle: 'Nissin/Frasaco Compatible Jaws, 32 Cavity Teeth, Wax Blocks & PK Thomas Sets',
    href: '/products?category=pre-clinical',
    tag: 'Year 1 & 2 Essential',
    icon: AcademicCapIcon,
    span: 'lg:col-span-8',
    gradient: 'from-cyan-950/60 via-slate-900 to-slate-950',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    accentColor: 'text-cyan-400',
    image: '/cat-imaging.png'
  },
  {
    title: 'Endodontic Canal Systems',
    subtitle: 'K-Files ISO 15-40, Endo Blocks, Gutta Percha Gauges & Spreaders',
    href: '/products?category=endodontics',
    tag: 'Pre-Clinical & Clinical',
    icon: BeakerIcon,
    span: 'lg:col-span-4',
    gradient: 'from-blue-950/60 via-slate-900 to-slate-950',
    borderColor: 'border-blue-500/30 hover:border-blue-400',
    accentColor: 'text-blue-400',
    image: '/hero-tools.png'
  },
  {
    title: 'Exodontia & Surgical Forceps',
    subtitle: 'Drop-Forged #150, #151, Cryer Elevators, Suture Sets & Retractors',
    href: '/products?category=surgery',
    tag: 'Hospital Clinic Tier',
    icon: ScissorsIcon,
    span: 'lg:col-span-4',
    gradient: 'from-purple-950/60 via-slate-900 to-slate-950',
    borderColor: 'border-purple-500/30 hover:border-purple-400',
    accentColor: 'text-purple-400',
    image: '/hero-tools.png'
  },
  {
    title: 'Operative, Composite & Restorative',
    subtitle: 'Gold TiN Sculpting Carvers, Tofflemire Retainers, Ball Burnishers & Rubber Dam Kits',
    href: '/products?category=operative',
    tag: 'Department Choice',
    icon: WrenchScrewdriverIcon,
    span: 'lg:col-span-8',
    gradient: 'from-teal-950/60 via-slate-900 to-slate-950',
    borderColor: 'border-teal-500/30 hover:border-teal-400',
    accentColor: 'text-teal-400',
    image: '/cat-ortho.png'
  }
];

const SpecialtyBentoGrid = () => {
  const { t } = useTranslation('ecommerce');
  const { isRTL } = useLanguage();

  return (
    <section className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* Background Engineering Gradients */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3 shadow-inner">
            <CubeTransparentIcon className="w-4 h-4 text-teal-400" />
            <span>Dental Department Specialties</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            Specialized Department Suites
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Engineered precision kits calibrated to exact clinical specifications across all dental specialties.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {specialties.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.href}
                className={`group relative rounded-[32px] bg-gradient-to-br ${item.gradient} border ${item.borderColor} p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${item.span}`}
              >
                {/* Background Glow on hover */}
                <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                  <span className={`text-xs font-bold ${item.accentColor} flex items-center gap-1.5`}>
                    <span>Explore Department Instruments</span>
                    <ArrowRightIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    DEPT_SPEC_{index + 1}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SpecialtyBentoGrid;
