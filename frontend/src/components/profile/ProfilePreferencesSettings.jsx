import React, { useState } from 'react';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  LanguageIcon, 
  PaintBrushIcon, 
  BeakerIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const ProfilePreferencesSettings = ({ user }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { currentTheme, changeTheme } = useTheme();
  const isAr = currentLanguage === 'ar';

  const [prefs, setPrefs] = useState({
    emailNotif: true,
    smsLocker: true,
    whatsappBatch: true,
    curriculumAlerts: true,
    preferredAlloy: 'aisi420',
    autoclaveTemp: '134',
    language: currentLanguage || 'en',
    theme: currentTheme || 'light'
  });

  const handleSave = () => {
    if (prefs.language !== currentLanguage) {
      changeLanguage(prefs.language);
    }
    if (prefs.theme !== currentTheme) {
      changeTheme(prefs.theme);
    }
    toast.success(isAr ? 'تم حفظ تفضيلات الحساب والعيادات بنجاح!' : 'Clinical & UI Preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Notifications & Clinical Alerts */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <BellIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'تنبيهات الدفعة وتوفر الأدوات السريرية' : 'Clinical Alerts & Notification Channels'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'اختر القنوات التي ترغب في تلقي تنبيهات الشراء المجمع ووصول الشحنات عليها' : 'Configure how you receive campus locker PINs, cohort restock notices, and syllabus updates'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              key: 'whatsappBatch',
              titleEn: 'WhatsApp Campus Batch Alerts',
              titleAr: 'تنبيهات الواتساب لخصومات الدفعة',
              descEn: 'Instant messages when cohort hits 15% discount or campus lockers are loaded.',
              descAr: 'رسائل فورية عند اكتمال خصم الـ 15% للدفعة أو وصول الحقائب للكلية.'
            },
            {
              key: 'smsLocker',
              titleEn: 'SMS Smart Locker OTP Codes',
              titleAr: 'رسائل SMS لأكواد فتح خزائن الكلية',
              descEn: 'Direct text message with private PIN code for locker compartment.',
              descAr: 'رمز PIN فوري لفتح خزانة استلام الأدوات في مبنى الكلية.'
            },
            {
              key: 'curriculumAlerts',
              titleEn: 'Faculty Syllabus Restock Notices',
              titleAr: 'تنبيهات قوائم متطلبات الكلية (Syllabus)',
              descEn: 'Alerts when required instruments for your BDS academic year are in stock.',
              descAr: 'إشعار فوري عند توفر أدوات ومبارد مواد فرقتك الدراسية.'
            },
            {
              key: 'emailNotif',
              titleEn: 'Official Tax Invoices & Warranty Certs',
              titleAr: 'الفواتير الضريبية وشهادات الضمان عبر البريد',
              descEn: 'Receive digital metallurgy certificates and PDF receipts for dental taxes.',
              descAr: 'استلام شهادات الضمان المعتمدة والفواتير الرقمية.'
            }
          ].map((item) => (
            <div key={item.key} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {isAr ? item.titleAr : item.titleEn}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={prefs[item.key]}
                  onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Metallurgy & System Appearance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metallurgy Defaults */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BeakerIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isAr ? 'تفضيلات السبائك والتعقيم الافتراضية' : 'Preferred Metallurgy & Autoclave Protocol'}
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'نوع السبيكة المفضلة للأدوات الجراحية والحشو' : 'Default Steel Grade Preference'}
              </label>
              <select
                value={prefs.preferredAlloy}
                onChange={(e) => setPrefs({ ...prefs, preferredAlloy: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="aisi420">{isAr ? 'AISI 420 فولاذ مارتنسيتي ألماني (مقاوم للصدأ فائق)' : 'German AISI 420 Martensitic Steel (HRC 54-56)'}</option>
                <option value="tinGold">{isAr ? 'TiN طلاء ذهبي بالتيتانيوم نيتريد (مضاد للالتصاق بالكومبوزيت)' : 'TiN Titanium Nitride Gold Coating (Non-Stick Composite)'}</option>
                <option value="tungsten">{isAr ? 'Tungsten Carbide كربيد التنجستن (قواطع فائقة الصلابة HRC 70)' : 'Tungsten Carbide Inserts (Ultra-Sharp Cutters HRC 70)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'بروتوكول جهاز الأوتوكلاف المعتمد لديك' : 'Hospital Autoclave Standard'}
              </label>
              <select
                value={prefs.autoclaveTemp}
                onChange={(e) => setPrefs({ ...prefs, autoclaveTemp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="134">{isAr ? 'Class B Vacuum Autoclave (134°C / 2.1 bar - 5 min)' : 'Class B Vacuum Autoclave (134°C / 2.1 bar - 5 min)'}</option>
                <option value="121">{isAr ? 'Class N Gravity Autoclave (121°C / 1.1 bar - 20 min)' : 'Class N Gravity Autoclave (121°C / 1.1 bar - 20 min)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display & Language */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <PaintBrushIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isAr ? 'المظهر واللغة' : 'Interface Theme & Language'}
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'لغة المنصة' : 'Platform Language'}
              </label>
              <select
                value={prefs.language}
                onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="en">English (Clinical Terms & Specs)</option>
                <option value="ar">العربية (المصطلحات الطبية والدفع الجامعي)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'سمة الألوان' : 'Color Mode'}
              </label>
              <select
                value={prefs.theme}
                onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="light">{isAr ? 'الوضع النهاري الفاتح (Light Mode)' : 'Clinical Bright (Light Mode)'}</option>
                <option value="dark">{isAr ? 'الوضع الليلي المركز (Dark Mode)' : 'Surgical Dark (Dark Mode)'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Trigger Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors"
        >
          <CheckCircleIcon className="w-4 h-4" />
          {isAr ? 'حفظ كافة التفضيلات' : 'Save All Preferences'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePreferencesSettings;
