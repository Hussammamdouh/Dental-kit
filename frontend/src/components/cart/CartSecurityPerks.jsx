import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, TruckIcon, SparklesIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const CartSecurityPerks = () => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';

  const perks = [
    {
      icon: ShieldCheckIcon,
      titleEn: '5-Year Metallurgy Warranty',
      titleAr: 'ضمان ٥ سنوات ضد الصدأ',
      descEn: 'German AISI 420 steel anti-corrosion replacement coverage',
      descAr: 'استبدال فوري لسبائك الفولاذ المارتنسيتي الألماني'
    },
    {
      icon: CheckBadgeIcon,
      titleEn: '134°C Class B Autoclavable',
      titleAr: 'معتمد لتعقيم الأوتوكلاف 134°C',
      descEn: 'Hospital grade autoclave & ultrasonic cleaning safe',
      descAr: 'مطابق لمعايير التعقيم والعيادات الجامعية'
    },
    {
      icon: TruckIcon,
      titleEn: 'Campus Smart Lockers',
      titleAr: 'استلام فوري من خزائن الكلية',
      descEn: 'Pick up 24/7 with private OTP at Faculty gates',
      descAr: 'استلام آمن برمز PIN سري من بوابات ومعامل الكلية'
    },
    {
      icon: LockClosedIcon,
      titleEn: '256-Bit Encrypted Egyptian Pay',
      titleAr: 'دفع إلكتروني مشفر ومعتمد',
      descEn: 'InstaPay, Vodafone Cash, Fawry, ValU & Cards',
      descAr: 'إنستاباي، فودافون كاش، فوري، فاليو وتقسيط البنوك'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 pb-2 border-b border-slate-100 dark:border-slate-800">
        <SparklesIcon className="w-4 h-4" />
        <span>{isAr ? 'ضمانات وتراخيص دنتال كيت' : 'Clinical Quality & Payment Assurances'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {perks.map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
              <p.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {isAr ? p.titleAr : p.titleEn}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {isAr ? p.descAr : p.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment methods badges row */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{isAr ? 'طرق الدفع المعتمدة:' : 'Accepted Gateways:'}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['InstaPay', 'Vodafone Cash', 'Fawry', 'ValU (0%)', 'Visa / MC', 'Campus COD'].map((gw, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {gw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartSecurityPerks;
