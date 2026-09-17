import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  WrenchScrewdriverIcon, 
  ShieldCheckIcon, 
  FireIcon, 
  ArrowPathIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

const DEFAULT_KITS = [
  {
    id: 'kit-1',
    nameEn: 'Phantom Head Operative Essentials (14 Pcs)',
    nameAr: 'طقم معمل الفانتوم التمهيدي للحشو (١٤ قطعة)',
    category: 'Operative & Conservative',
    alloy: 'AISI 420 Martensitic Steel',
    hardness: 'Rockwell HRC 56',
    autoclaveCycles: 42,
    maxCycles: 200,
    warrantyYears: 5,
    purchaseDate: '2025-10-12',
    status: 'Certified Active',
    instruments: ['Hollow Handle Mirror #4', 'Explorer #23/17', 'College Plier', 'Excavator #131/132', 'Amalgam Carrier', 'Ball Burnisher #27/29', 'Hollenback Carver 1/2']
  },
  {
    id: 'kit-2',
    nameEn: 'Rotary Endo Crown-Down Access Kit (6 Files)',
    nameAr: 'طقم حشو العصب الروتاري والوصول للقنوات (٦ مبارد)',
    category: 'Endodontics',
    alloy: 'Heat-Treated Gold CM-Wire NiTi',
    hardness: 'Superelastic Flexibility',
    autoclaveCycles: 18,
    maxCycles: 50,
    warrantyYears: 2,
    purchaseDate: '2026-01-20',
    status: 'In Rotation',
    instruments: ['Orifice Opener 17/12', 'Glide Path File 15/04', 'Shaper Gold #20/04', 'Finisher Gold #25/06', 'Endo Ring Ruler', 'Sterilization Cassette']
  },
  {
    id: 'kit-3',
    nameEn: 'Gracey Periodontal Curettes Rigid Tray (7 Pcs)',
    nameAr: 'طقم كوريتات جرايسي لعلاج اللثة والجيوب (٧ قطع)',
    category: 'Periodontics & Surgery',
    alloy: 'Cryo-Treated AISI 440A Stainless',
    hardness: 'Rockwell HRC 58',
    autoclaveCycles: 65,
    maxCycles: 300,
    warrantyYears: 5,
    purchaseDate: '2025-08-04',
    status: 'Certified Active',
    instruments: ['Gracey #1/2 Anterior', 'Gracey #7/8 Premolar', 'Gracey #11/12 Mesial', 'Gracey #13/14 Distal', 'Williams Probe 1-10mm', 'Sharpening Stone Arkansas']
  }
];

const ClinicalEquipmentLocker = () => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const [kits, setKits] = useState(DEFAULT_KITS);
  const [selectedKit, setSelectedKit] = useState(DEFAULT_KITS[0]);

  const handleLogAutoclave = (kitId) => {
    setKits(prev => prev.map(k => {
      if (k.id === kitId) {
        const next = Math.min(k.autoclaveCycles + 1, k.maxCycles);
        return { ...k, autoclaveCycles: next };
      }
      return k;
    }));
    toast.success(isAr ? 'تم تسجيل دورة تعقيم أوتوكلاف 134°C بنجاح!' : 'Class B 134°C Sterilization Cycle logged successfully!');
  };

  const handleDownloadCert = (kitName) => {
    toast.success(isAr ? `جاري تحميل شهادة الضمان والسبائك الطبية لـ ${kitName}...` : `Downloading Medical Metallurgy Warranty Certificate for ${kitName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Metallurgy Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent border border-teal-500/20 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'خزانة الأدوات وحقائب التدريب السريري' : 'Clinical Instrument Vault & Locker'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isAr ? 'تتبع دورات تعقيم الأوتوكلاف، شهادات السبائك المعتمدة، وفترات الضمان للأدوات المسجلة' : 'Track Class B autoclave sterilization cycles, metallurgy certifications, and active instrument warranties'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm">
              <ShieldCheckIcon className="w-4 h-4" />
              {isAr ? 'ضمان ممتد ٥ سنوات' : '5-Yr Warranty Guard'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Kit Cards & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kit Selector Cards */}
        <div className="lg:col-span-1 space-y-3">
          {kits.map((kit) => {
            const isSelected = selectedKit.id === kit.id;
            const cyclePercent = Math.round((kit.autoclaveCycles / kit.maxCycles) * 100);

            return (
              <motion.div
                key={kit.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedKit(kit)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/50 dark:border-teal-800/50">
                    {kit.category}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    {kit.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {isAr ? kit.nameAr : kit.nameEn}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {kit.alloy} • {kit.hardness}
                </p>

                {/* Autoclave Cycle Progress */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <FireIcon className="w-3.5 h-3.5 text-amber-500" />
                      {isAr ? 'دورات التعقيم المسجلة' : 'Autoclave Cycles'}
                    </span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">{kit.autoclaveCycles} / {kit.maxCycles}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        cyclePercent > 80 ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${cyclePercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

          <button
            onClick={() => toast.success(isAr ? 'فتح نافذة إضافة رقم تسلسلي لأداة جديدة...' : 'Opening Instrument Serial Registration modal...')}
            className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 flex items-center justify-center gap-2 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            {isAr ? 'تسجيل رقم سيريال أداة / حقيبة جديدة' : 'Register New Serialized Kit / Tool'}
          </button>
        </div>

        {/* Kit Inspector & Instrument Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 uppercase tracking-wider font-semibold">
                  {isAr ? 'مواصفات الحقيبة والسبائك' : 'Metallurgy & Clinical Specs'}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {isAr ? selectedKit.nameAr : selectedKit.nameEn}
                </h3>
              </div>
              <button
                onClick={() => handleDownloadCert(isAr ? selectedKit.nameAr : selectedKit.nameEn)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                {isAr ? 'شهادة الضمان (PDF)' : 'Warranty Cert (PDF)'}
              </button>
            </div>

            {/* Spec Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">{isAr ? 'سبيكة المعدن' : 'Alloy Type'}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedKit.alloy}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">{isAr ? 'صلابة روكويل' : 'Hardness'}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedKit.hardness}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">{isAr ? 'تاريخ الشراء' : 'Registered'}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedKit.purchaseDate}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">{isAr ? 'فترة الضمان' : 'Warranty'}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedKit.warrantyYears} {isAr ? 'سنوات ضد الصدأ' : 'Years Coverage'}</span>
              </div>
            </div>

            {/* Included Clinical Instruments */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4 text-teal-500" />
                {isAr ? 'الأدوات والمبارد المضمنة داخل الحقيبة' : 'Instruments & Files in this Setup'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedKit.instruments.map((inst, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{inst}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action: Log Autoclave Cycle */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FireIcon className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'بروتوكول الأوتوكلاف الموصى به: 134°C لمدة ٥ دقائق' : 'Autoclave recommendation: 134°C Class B holding for 5 min'}</span>
            </div>
            <button
              onClick={() => handleLogAutoclave(selectedKit.id)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              {isAr ? 'تسجيل دورة تعقيم جديدة' : 'Log Sterilization Cycle (+1)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalEquipmentLocker;
