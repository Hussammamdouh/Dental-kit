import React, { useState } from 'react';
import { 
  BuildingLibraryIcon, 
  UserGroupIcon, 
  TagIcon, 
  QrCodeIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  MapPinIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

const CampusBatchPerksCard = ({ user, profileForm }) => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const [copied, setCopied] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState('gate3');

  const faculty = profileForm?.university || user?.university || 'Cairo University - Faculty of Oral & Dental Medicine';
  const batchCode = 'CU-DENT-2026';
  const currentCount = 86;
  const targetCount = 100;
  const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(batchCode);
    setCopied(true);
    toast.success(isAr ? 'تم نسخ كود الدفعة الجامعية بنجاح!' : 'Campus Batch Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Group Buy Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white rounded-2xl p-6 sm:p-7 border border-teal-500/30 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5" />
                {isAr ? 'برنامج الشراء المجمع للجامعات' : 'Campus Cohort Batch Hub'}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {isAr ? 'الفصل الدراسي الأول ٢٠٢٦' : 'Term 1 / 2026'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {faculty}
            </h3>

            <p className="text-sm text-slate-300 max-w-xl">
              {isAr 
                ? 'أنت مؤهل للحصول على خصم الكلية الفوري 15% مع توصيل مجاني مباشر إلى خزائن الأمان داخل الكلية.'
                : 'You are enrolled in the official university cohort discount program with free express delivery to campus smart lockers.'}
            </p>
          </div>

          {/* Batch Code Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex-shrink-0 text-center space-y-2">
            <span className="text-[11px] uppercase font-mono text-teal-300 tracking-wider block">
              {isAr ? 'كود خصم الدفعة الجامعية' : 'Your Cohort Promo Code'}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl font-extrabold tracking-widest text-white bg-black/40 px-3 py-1.5 rounded-xl border border-teal-400/40">
                {batchCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold transition-colors"
                title={isAr ? 'نسخ الكود' : 'Copy Code'}
              >
                {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
              </button>
            </div>
            <span className="text-[10px] text-teal-200 block font-medium">
              {isAr ? 'يمنحك خصم 15% إضافي عند إتمام الطلب' : 'Applies 15% OFF at Checkout'}
            </span>
          </div>
        </div>

        {/* Progress Bar towards next tier */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <UserGroupIcon className="w-4 h-4 text-teal-400" />
              {isAr ? `${currentCount} زميل انضموا للدفعة الحالية` : `${currentCount} Faculty Classmates Enrolled`}
            </span>
            <span className="text-teal-300 font-mono">{progressPercent}% {isAr ? 'مكتمل' : 'Unlocked'}</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-700" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>{isAr ? 'المستوى 1: شحن مجاني (50 طالب)' : 'Tier 1: Free Shipping (50)'}</span>
            <span className="text-teal-300 font-bold">{isAr ? 'المستوى 2: خصم 15% (مفعل الآن!)' : 'Tier 2: 15% Batch OFF (ACTIVE)'}</span>
            <span>{isAr ? 'المستوى 3: هدية فانتوم (100 طالب)' : 'Tier 3: Free Phantom Bur Set (100)'}</span>
          </div>
        </div>
      </div>

      {/* Campus Locker Delivery Pickup Point */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isAr ? 'نقطة الاستلام المفضلة داخل الكلية (خزائن Smart Lockers)' : 'Preferred On-Campus Smart Locker Hub'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'استلم حقيبتك فور وصولها برمز PIN سري بدون انتظار مندوب الشحن' : 'Pick up instrument packages 24/7 with your private OTP code'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'gate3', nameEn: 'Faculty Gate 3 - Central Dental Locker', nameAr: 'بوابة ٣ - خزائن مبنى الفانتوم المركزي' },
            { id: 'hospital', nameEn: 'Hospital Outpatient Clinics Hub', nameAr: 'مبنى العيادات الخارجية ومستشفى الأسنان' },
            { id: 'library', nameEn: 'Post-Grad Dental Library Booth', nameAr: 'استراحة ومعامل الدراسات العليا' }
          ].map((loc) => {
            const isSelected = selectedLocker === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  setSelectedLocker(loc.id);
                  toast.success(isAr ? `تم تعيين ${loc.nameAr} كنقطة الاستلام الافتراضية` : `Set ${loc.nameEn} as default pickup locker`);
                }}
                className={`p-3.5 rounded-xl border text-left rtl:text-right transition-all duration-200 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{isAr ? loc.nameAr : loc.nameEn}</span>
                  {isSelected && <CheckIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isAr ? 'تأمين بكود OTP فوري' : 'Automated PIN verification'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampusBatchPerksCard;
