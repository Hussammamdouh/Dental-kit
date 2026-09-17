import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  ShieldCheckIcon,
  SparklesIcon,
  FireIcon,
  WrenchIcon,
  CheckBadgeIcon,
  BeakerIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const MedicalGradeSpecs = () => {
  const { t } = useTranslation('ecommerce');

  const specs = [
    {
      code: 'AISI-420-M',
      title: t('home.specs.spec1Title') || 'AISI 420 Martensitic Steel',
      description: t('home.specs.spec1Desc') || 'Heat-treated to Rockwell 54-58 HRC for ultra-durable cutting edges that retain sharp bevels under heavy clinical load.',
      icon: ShieldCheckIcon,
      tag: 'Hardness: 54-58 HRC',
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      code: 'TiN-NANO-01',
      title: t('home.specs.spec2Title') || 'TiN Nano-Composite Coating',
      description: t('home.specs.spec2Desc') || 'Titanium Nitride coated tips prevent composite resin sticking and provide micro-tactile sensitivity for anatomy sculpting.',
      icon: SparklesIcon,
      tag: 'Non-Stick Sculpting',
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30'
    },
    {
      code: 'BEAK-SERR-X',
      title: t('home.specs.spec3Title') || 'Micro-Serrated Exodontia Beaks',
      description: t('home.specs.spec3Desc') || 'Laser-machined grip ridges provide positive non-slip tooth root engagement, minimizing apical fracture risk.',
      icon: WrenchIcon,
      tag: 'Laser Machined',
      color: 'from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/30'
    },
    {
      code: 'AUTO-134-MAX',
      title: t('home.specs.spec4Title') || '134°C Autoclave Resistance',
      description: t('home.specs.spec4Desc') || 'Certified passivated oxide barrier prevents pitting, oxidation, and corrosion across hospital autoclave autoclaving.',
      icon: FireIcon,
      tag: '1,000+ Cycles Certified',
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30'
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* Background Engineering Blueprint Matrix */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3 shadow-inner">
            <CpuChipIcon className="w-4 h-4 text-teal-400" />
            <span>{t('home.specs.badge') || 'Medical Grade Metallurgy'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            {t('home.specs.title') || 'Engineered for Clinical Ergonomics & Lifetime Autoclave Durability'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('home.specs.subtitle') || 'Dental instruments manufactured with German martensitic stainless steel to withstand 1,000+ sterilization cycles.'}
          </p>
        </div>

        {/* Technical Specs 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} border shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 group-hover:text-teal-400 transition-colors">
                      {item.code}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {item.tag}
                  </span>
                  <CheckBadgeIcon className="w-4 h-4 text-teal-500" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default MedicalGradeSpecs;
