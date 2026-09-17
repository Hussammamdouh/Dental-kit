import React from 'react';
import { ShoppingBagIcon, SparklesIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const CartHeader = ({ itemCount = 0 }) => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border-b border-teal-500/20 py-8 sm:py-12">
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ShoppingBagIcon className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'حقيبة الأدوات والعيادات السريرية' : 'Clinical Instrument Tray & Cart'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isAr ? 'تجهيز حقيبة الأدوات التدريبية' : 'Review Your Clinical Student Tray'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'فحص الأدوات المسجلة، سبائك الفولاذ المعتمدة، وتطبيق خصومات الدفع المجمع للجامعات قبل التوجه للدفع.'
                : 'Inspect your selected medical-grade instruments, verify autoclave specs, and apply faculty cohort discounts.'}
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 text-center shrink-0">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">{isAr ? 'الأدوات بالحقيبة' : 'Tray Items'}</span>
              <span className="text-2xl font-black text-teal-300">{itemCount}</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-1" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">{isAr ? 'الضمان المعتمد' : 'Warranty'}</span>
              <span className="text-sm font-bold text-white flex items-center gap-1">
                <ShieldCheckIcon className="w-4 h-4 text-teal-400" />
                {isAr ? '٥ سنوات' : '5 Years'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;