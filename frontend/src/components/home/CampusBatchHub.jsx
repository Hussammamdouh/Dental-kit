import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  UserGroupIcon,
  SparklesIcon,
  TagIcon,
  ClockIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const activeBatches = [
  {
    university: 'Cairo University (Kasr Al-Ainy)',
    batch: 'Class of 2026 • 4th Year BDS',
    kit: 'Clinical Surgery & Endo Toolkit',
    joined: 44,
    target: 50,
    discount: '25% OFF',
    status: 'Tier 3 Unlocked',
    daysLeft: 4
  },
  {
    university: 'Ain Shams Dental Faculty',
    batch: 'Class of 2027 • 3rd Year BDS',
    kit: 'Comprehensive Restorative & Rubber Dam Box',
    joined: 38,
    target: 40,
    discount: '22% OFF',
    status: 'Almost Full',
    daysLeft: 6
  },
  {
    university: 'Mansoura University Dental Faculty',
    batch: 'Class of 2028 • 2nd Year BDS',
    kit: 'Pre-Clinical Typodont & Waxing Station',
    joined: 50,
    target: 50,
    discount: '30% OFF',
    status: 'Max Discount Unlocked',
    daysLeft: 2
  }
];

const CampusBatchHub = () => {
  const { t } = useTranslation('ecommerce');
  const { isRTL } = useLanguage();

  return (
    <section className="py-20 sm:py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-3 shadow-inner">
            <UserGroupIcon className="w-4 h-4 text-cyan-400" />
            <span>{t('home.batchHub.badge') || 'University Group Buy & Batch Discount'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            {t('home.batchHub.title') || 'Faculty Batch Group-Buy Hub'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('home.batchHub.subtitle') || 'Join your university batch order to unlock tiered bulk discounts and direct campus bulk delivery.'}
          </p>
        </div>

        {/* Batch Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeBatches.map((item, index) => {
            const percentage = Math.min(100, Math.round((item.joined / item.target) * 100));
            return (
              <div
                key={index}
                className="rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <BuildingLibraryIcon className="w-4 h-4" />
                      <span>{item.university}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.discount}
                    </span>
                  </div>

                  {/* Batch Title */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {item.kit}
                    </h3>
                    <p className="text-xs text-slate-400">{item.batch}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {t('home.batchHub.studentsJoined') || 'Students Joined'}: <strong className="text-white">{item.joined}/{item.target}</strong>
                      </span>
                      <span className="text-cyan-400 font-mono font-bold">{percentage}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Status & Deadline */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>{item.status}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.daysLeft} {t('home.batchHub.daysLeft') || 'Days Left'}</span>
                    </span>
                  </div>

                </div>

                {/* Join CTA */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <Link
                    to="/packages"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-cyan-600/20 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-500 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{t('home.batchHub.joinBatch') || 'Join Batch Order'}</span>
                    <ArrowRightIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CampusBatchHub;
