import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import {
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  SparklesIcon,
  ScissorsIcon,
  GiftIcon,
  ArrowRightIcon,
  TagIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const NavCategoryDropdown = ({ onClose }) => {
  const { t } = useTranslation('ecommerce');

  const categories = [
    {
      name: t('nav.preclinicalKits') || 'Pre-Clinical Kits',
      description: 'Typodonts, tooth carving, waxing tools & anatomy models',
      href: '/products?category=pre-clinical',
      icon: AcademicCapIcon,
      badge: '1st & 2nd Year',
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      name: t('nav.clinicalKits') || 'Clinical Instruments',
      description: 'Diagnostic probes, mirrors, tweezers & tray setups',
      href: '/products?category=clinical',
      icon: WrenchScrewdriverIcon,
      badge: 'Essential',
      color: 'from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/20'
    },
    {
      name: t('nav.endoResto') || 'Endo & Restorative',
      description: 'Rubber dam kits, K-files, composite carvers & burs',
      href: '/products?category=endodontics',
      icon: BeakerIcon,
      badge: 'Top Choice',
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20'
    },
    {
      name: t('nav.surgicalPeriodontics') || 'Surgery & Periodontics',
      description: 'Extraction forceps, scalers, curettes & suture sets',
      href: '/products?category=surgery',
      icon: ScissorsIcon,
      badge: 'Clinical',
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 z-[60] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Categories Grid */}
        <div className="col-span-8">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('nav.studentKits') || 'Dental Student Kits'}
            </h3>
            <Link
              to="/categories"
              onClick={onClose}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 flex items-center gap-1 transition-colors"
            >
              {t('nav.viewAll') || 'View All'}
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className="group relative flex flex-col p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-teal-500/30 dark:hover:border-teal-400/30 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.color} border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                    <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Explore &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Student Promo Banner */}
        <div className="col-span-4 flex flex-col justify-between p-4 rounded-xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 border border-teal-500/20 dark:border-teal-500/30">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold mb-3">
              <GiftIcon className="w-3.5 h-3.5" />
              <span>Student Bundle</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1">
              Complete Pre-Clinical Kit
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Typodont, Waxing Set, 32 Cavity Teeth & Storage Case all-in-one.
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">Save 25%</span>
              <span className="text-xs text-slate-500 line-through">Retail price</span>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/packages"
              onClick={onClose}
              className="flex items-center justify-center w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <TagIcon className="w-3.5 h-3.5 mr-1.5" />
              {t('nav.packages') || 'View Packages'}
            </Link>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-500" />
              <span>University Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavCategoryDropdown;
