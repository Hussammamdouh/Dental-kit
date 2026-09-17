import React from 'react';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  SparklesIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const ProfileActivityHistory = () => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';

  const stats = [
    {
      titleEn: 'Kits & Orders',
      titleAr: 'الحقائب والطلبيات',
      value: '14',
      subEn: '2 Pending Campus Locker Delivery',
      subAr: '٢ قيد التوصيل لخزائن الكلية',
      icon: ShoppingBagIcon,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/50'
    },
    {
      titleEn: 'Batch Savings',
      titleAr: 'وفر الشراء المجمع',
      value: '2,450 EGP',
      subEn: '15% Faculty Discount Applied',
      subAr: 'خصم الكلية ١٥٪ مفعل',
      icon: CurrencyDollarIcon,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50'
    },
    {
      titleEn: 'Saved Instruments',
      titleAr: 'قائمة الرغبات السريرية',
      value: '9',
      subEn: 'In Faculty Syllabus Watch',
      subAr: 'أدوات ضمن متطلبات الفرقة',
      icon: HeartIcon,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/50'
    },
    {
      titleEn: 'Clinical Star Points',
      titleAr: 'نقاط الولاء السريري',
      value: '820 Pts',
      subEn: 'Redeemable for Bur Sets',
      subAr: 'قابلة للاستبدال بأطقم سنابل',
      icon: SparklesIcon,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/50'
    }
  ];

  const activities = [
    {
      id: 1,
      titleEn: 'Purchased Phantom Head Operative Essentials (14 Pcs)',
      titleAr: 'تم شراء طقم معمل الفانتوم التمهيدي للحشو (١٤ قطعة)',
      timeEn: '2 hours ago',
      timeAr: 'منذ ساعتين',
      badge: 'Order #DK-9041',
      badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
    },
    {
      id: 2,
      titleEn: 'Logged Class B 134°C Autoclave Sterilization Cycle',
      titleAr: 'تسجيل دورة تعقيم أوتوكلاف 134°C لطقم علاج الجذور',
      timeEn: 'Yesterday at 4:15 PM',
      timeAr: 'أمس الساعة ٤:١٥ مساءً',
      badge: 'Autoclave #18',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300'
    },
    {
      id: 3,
      titleEn: 'Faculty Cohort unlocked 15% Campus Bulk Discount',
      titleAr: 'اكتمال نسبة الـ 15% للدفعة الجامعية بنجاح',
      timeEn: '3 days ago',
      timeAr: 'منذ ٣ أيام',
      badge: 'CU-DENT-2026',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 4,
      titleEn: 'Registered 5-Year Metallurgy Warranty for Gracey Curettes',
      titleAr: 'تفعيل شهادة الضمان ٥ سنوات لكوريتات جرايسي جراحة اللثة',
      timeEn: '1 week ago',
      timeAr: 'منذ أسبوع',
      badge: 'AISI 440A',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isAr ? st.titleAr : st.titleEn}
              </span>
              <div className={`w-8 h-8 rounded-xl ${st.bg} ${st.color} flex items-center justify-center`}>
                <st.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {st.value}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isAr ? st.subAr : st.subEn}
            </span>
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'سجل النشاط السريري والطلبيات' : 'Clinical & Order Activity Log'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'تتبع تاريخ تسجيل الأدوات ودورات التعقيم واستخدام أكواد الخصم' : 'Chronological overview of instrument purchases and clinical certifications'}
              </p>
            </div>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <span>{isAr ? 'عرض كافة الطلبات' : 'View Orders'}</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div 
              key={act.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? act.titleAr : act.titleEn}
                </span>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${act.badgeColor}`}>
                  {act.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isAr ? act.timeAr : act.timeEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileActivityHistory;
