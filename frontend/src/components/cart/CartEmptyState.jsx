import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  AcademicCapIcon, 
  SparklesIcon, 
  WrenchScrewdriverIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const CartEmptyState = () => {
  const { currentLanguage, isRTL } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const navigate = useNavigate();

  const recommendations = [
    {
      titleEn: 'Pre-Clinical & Phantom Trays',
      titleAr: 'أطقم معمل الفانتوم والأسنان',
      descEn: 'Typodonts, carvers & rubber dams',
      descAr: 'التايبودونت، نحت الشمع وحواجز المطاط',
      link: '/products?stage=pre-clinical',
      icon: AcademicCapIcon
    },
    {
      titleEn: 'Rotary Endo Starter Kits',
      titleAr: 'أطقم حشو العصب الروتاري',
      descEn: 'CM-Wire NiTi files & access burrs',
      descAr: 'مبارد النيكل تيتانيوم والوصول للقنوات',
      link: '/products?stage=operative',
      icon: WrenchScrewdriverIcon
    },
    {
      titleEn: 'Full Semester Trunks & Bundles',
      titleAr: 'حقائب الفصول الدراسية الشاملة',
      descEn: 'Save 15% on comprehensive BDS kits',
      descAr: 'وفر ١٥٪ على حقائب الدفعة الكاملة',
      link: '/packages',
      icon: SparklesIcon
    }
  ];

  return (
    <div className="min-h-[70vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 sm:py-16 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xl space-y-6">
        
        {/* Empty Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-teal-50 dark:bg-teal-950/50 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner">
          <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? 'حقيبة الأدوات فارغة حالياً' : 'Your Clinical Tray is Empty'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'لم تقم بإضافة أي أدوات أو حقائب تدريبية حتى الآن. تصفح كتالوج الأدوات المعتمدة لكليات طب الأسنان في مصر.'
              : 'You have not added any medical-grade dental instruments or faculty kits yet. Browse our BDS curriculum catalog below.'}
          </p>
        </div>

        {/* Primary CTA */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
          >
            <span>{isAr ? 'استعراض كتالوج الأدوات والمبارد' : 'Explore Clinical Catalog'}</span>
            <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Quick Recommendation Category Grid */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-left rtl:text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block text-center">
            {isAr ? 'أقسام مقترحة لفرقتك الدراسية:' : 'Recommended Clinical Categories:'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendations.map((rec, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(rec.link)}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/70 dark:border-slate-800/80 hover:border-teal-500/40 transition-all text-left rtl:text-right cursor-pointer group"
              >
                <rec.icon className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {isAr ? rec.titleAr : rec.titleEn}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {isAr ? rec.descAr : rec.descEn}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartEmptyState;