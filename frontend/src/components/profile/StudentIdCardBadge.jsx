import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  CheckBadgeIcon, 
  QrCodeIcon, 
  IdentificationIcon,
  SparklesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

const FACULTY_NAMES = {
  cairo: { en: 'Cairo University - Faculty of Oral & Dental Medicine', ar: 'جامعة القاهرة - كلية طب الفم والأسنان (قصر العيني)' },
  ainshams: { en: 'Ain Shams University - Faculty of Dentistry', ar: 'جامعة عين شمس - كلية طب الأسنان' },
  alexandria: { en: 'Alexandria University - Faculty of Dentistry', ar: 'جامعة الإسكندرية - كلية طب الأسنان' },
  mansoura: { en: 'Mansoura University - Faculty of Dentistry', ar: 'جامعة المنصورة - كلية طب الأسنان' },
  assiut: { en: 'Assiut University - Faculty of Dentistry', ar: 'جامعة أسيوط - كلية طب الأسنان' },
  alazhar: { en: 'Al-Azhar University - Faculty of Dental Medicine', ar: 'جامعة الأزهر - كلية طب وجراحة الفم والأسنان' },
  must: { en: 'Misr University for Science and Technology (MUST)', ar: 'جامعة مصر للعلوم والتكنولوجيا (MUST)' },
  msa: { en: 'October University for Modern Sciences and Arts (MSA)', ar: 'جامعة أكتوبر للعلوم الحديثة والآداب (MSA)' },
  buc: { en: 'Badr University in Cairo (BUC)', ar: 'جامعة بدر بالقاهرة (BUC)' },
  miu: { en: 'Misr International University (MIU)', ar: 'جامعة مصر الدولية (MIU)' },
  default: { en: 'Accredited Egyptian Dental Faculty', ar: 'كلية طب الأسنان المعتمدة' }
};

const STAGE_LABELS = {
  year1: { en: 'Year 1: Dental Anatomy & Biomaterials', ar: 'الفرقة الأولى: تشريح الأسنان والمواد الحيوية' },
  year2: { en: 'Year 2: Pre-Clinical Operative & Prostho', ar: 'الفرقة الثانية: حشو واستعاضة ما قبل العيادي' },
  year3: { en: 'Year 3: Phantom Lab & Endo Intro', ar: 'الفرقة الثالثة: معمل الفانتوم وعلاج الجذور' },
  year4: { en: 'Year 4: Clinical Patient Rotations', ar: 'الفرقة الرابعة: العيادات والتدريب السريري' },
  year5: { en: 'Year 5: Senior Comprehensive Clinics', ar: 'الفرقة الخامسة: الحالات الشاملة والامتياز' },
  intern: { en: 'BDS Intern / Post-Grad Resident', ar: 'طبيب امتياز / طبيب مقيم' },
  general: { en: 'General Dental Practitioner', ar: 'طبيب أسنان عام / أخصائي' }
};

const StudentIdCardBadge = ({ user, profileForm }) => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const [isFlipped, setIsFlipped] = useState(false);

  const rawFaculty = (profileForm?.university || user?.university || 'cairo').toLowerCase().replace(/[\s\-_]/g, '');
  const matchedFaculty = Object.keys(FACULTY_NAMES).find(k => rawFaculty.includes(k)) || 'cairo';
  const facultyName = FACULTY_NAMES[matchedFaculty] ? (isAr ? FACULTY_NAMES[matchedFaculty].ar : FACULTY_NAMES[matchedFaculty].en) : (profileForm?.university || 'Faculty of Dentistry');

  const stageKey = profileForm?.academicStage || user?.academicStage || 'year3';
  const stageLabel = STAGE_LABELS[stageKey] ? (isAr ? STAGE_LABELS[stageKey].ar : STAGE_LABELS[stageKey].en) : (isAr ? 'الفرقة الثالثة: معمل الفانتوم' : 'Year 3 Phantom Lab');

  const studentId = user?.studentId || (user?.id ? `DK-${user.id.substring(0, 6).toUpperCase()}` : 'DK-EG-88492');
  const fullName = `${profileForm?.firstName || user?.firstName || 'Dr. Dental'} ${profileForm?.lastName || user?.lastName || 'Scholar'}`.trim();

  const handleDownloadCard = () => {
    toast.success(isAr ? 'جاري تصدير بطاقة الاعتماد الرقمية بصيغة PDF...' : 'Exporting Digital Dental Accreditation Pass (PDF)...');
  };

  return (
    <div className="relative group mb-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <IdentificationIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {isAr ? 'بطاقة الاعتماد الأكاديمي والسريري' : 'Clinical & Academic ID Pass'}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1.5 transition-colors"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>{isFlipped ? (isAr ? 'الوجه الأمامي' : 'View Front') : (isAr ? 'الباركود وQR' : 'View Back & QR')}</span>
        </button>
      </div>

      {/* 3D Card Container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full rounded-2xl shadow-xl overflow-hidden cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border border-teal-500/30 rounded-2xl overflow-hidden flex flex-col justify-between min-h-[290px]">
            {/* Holographic Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-cyan-400/15 to-transparent pointer-events-none opacity-80" />
            <div className="absolute -right-16 -top-16 w-52 h-52 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar: Emblem, Verified Text, Batch Pill */}
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 backdrop-blur-md flex items-center justify-center text-teal-300 font-extrabold text-sm shadow-inner flex-shrink-0">
                    DK
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-teal-300">
                    <CheckBadgeIcon className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>{isAr ? 'عضوية معتمدة • BDS' : 'VERIFIED BDS SCHOLAR'}</span>
                  </div>
                </div>

                {/* Status Pill */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 border border-teal-400/40 text-teal-300 shadow-sm flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  {isAr ? 'خصم 15% فعال' : '15% Batch'}
                </span>
              </div>

              {/* Faculty Sub-header */}
              <div className="text-xs font-semibold text-slate-200/95 leading-snug pt-0.5">
                {facultyName}
              </div>
            </div>

            {/* Middle Section: Doctor / Student Details */}
            <div className="relative z-10 my-4 flex items-center justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'اسم الطبيب / الطالب' : 'Clinician / Student Name'}
                </span>
                <h4 className="text-xl font-black text-white tracking-wide truncate">
                  {fullName}
                </h4>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-[11px] text-cyan-300 font-medium shadow-sm">
                    <AcademicCapIcon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{stageLabel}</span>
                  </span>
                </div>
              </div>

              {/* Micro Smart Chip Hologram */}
              <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-400/90 via-yellow-200/95 to-amber-500 border border-amber-300/70 shadow-md flex items-center justify-center p-1 flex-shrink-0">
                <div className="w-full h-full border border-amber-700/30 rounded flex flex-col justify-around py-0.5">
                  <div className="h-0.5 bg-amber-800/40 w-full" />
                  <div className="h-0.5 bg-amber-800/40 w-full" />
                </div>
              </div>
            </div>

            {/* Bottom Bar: ID Number & Protocol */}
            <div className="relative z-10 pt-3.5 border-t border-slate-700/70 flex items-center justify-between gap-3 text-xs">
              <div className="font-mono">
                <span className="text-[9px] text-slate-400 block uppercase tracking-wider">{isAr ? 'رقم القيد الأكاديمي' : 'Accreditation Pass ID'}</span>
                <span className="text-teal-300 font-bold tracking-wider text-xs">{studentId}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase tracking-wider">{isAr ? 'العيادات المعتمدة' : 'Clinical Protocol'}</span>
                <span className="text-slate-200 font-semibold text-xs">{isAr ? 'أوتوكلاف فئة B - 134°C' : 'Class B Autoclave'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* BACK OF CARD */
          <div 
            style={{ transform: 'rotateY(180deg)' }}
            className="relative p-6 sm:p-7 bg-gradient-to-bl from-slate-900 via-slate-800 to-cyan-950 text-white border border-cyan-500/30 rounded-2xl overflow-hidden flex flex-col justify-between min-h-[290px]"
          >
            {/* Magnetic Stripe Simulator */}
            <div className="absolute top-4 left-0 right-0 h-8 bg-black/90 border-y border-slate-800" />

            <div className="relative z-10 pt-10 flex items-center justify-between gap-4">
              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-mono text-[11px] text-cyan-300 font-semibold leading-relaxed">
                  {isAr ? '• صالح للاستخدام في كافة المستشفيات والمعامل الجامعية' : '• Valid across Egyptian University Labs & Clinics'}
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {isAr ? '• يعتمد استلام حقائب الأدوات وضمان سبائك الفولاذ 5 سنوات' : '• Authorizes tray handoffs & 5-year AISI 420 warranty claims'}
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {isAr ? '• خصم فوري 15% عند الدفع المجمع داخل الجامعة' : '• Instant 15% discount on cohort bulk instrument deliveries'}
                </p>
              </div>

              {/* QR Simulator */}
              <div className="p-2.5 bg-white rounded-xl shadow-lg flex-shrink-0 text-slate-900 text-center">
                <QrCodeIcon className="w-14 h-14 text-slate-900" />
                <span className="text-[8px] font-mono font-bold block text-slate-600 mt-0.5">VERIFY-DK</span>
              </div>
            </div>

            <div className="relative z-10 pt-3.5 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
              <span>{isAr ? 'الدعم: support@dentalkit.eg' : 'Support: support@dentalkit.eg'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadCard();
                }}
                className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 font-semibold underline"
              >
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                {isAr ? 'تحميل البطاقة' : 'Download Pass'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentIdCardBadge;
