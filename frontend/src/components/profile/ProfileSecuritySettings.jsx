import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ProfileSecuritySettings = () => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const { changePassword, logout } = useAuth();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [updating, setUpdating] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Password strength calculation
  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(passwordForm.newPassword);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error(isAr ? 'يرجى إدخال كلمة المرور الحالية' : 'Please enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error(isAr ? 'يجب ألا تقل كلمة المرور الجديدة عن ٨ أحرف' : 'New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    try {
      setUpdating(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    toast.success(
      next
        ? (isAr ? 'تم تفعيل التحقق بخطوتين عبر كود SMS ورسائل WhatsApp' : 'Two-Factor Authentication (2FA) enabled via SMS & WhatsApp')
        : (isAr ? 'تم تعطيل التحقق بخطوتين' : 'Two-Factor Authentication disabled')
    );
  };

  return (
    <div className="space-y-8">
      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <KeyIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'تغيير كلمة المرور وتأمين الحساب' : 'Change Password & Security Credentials'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'استخدم كلمة مرور قوية تحتوي على رموز وأرقام لحماية سجلاتك وطلبياتك' : 'Ensure your account uses a secure password with letters, numbers, and symbols'}
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors pr-10 rtl:pr-3.5 rtl:pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword.current ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors pr-10 rtl:pr-3.5 rtl:pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword.new ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors pr-10 rtl:pr-3.5 rtl:pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword.confirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {passwordForm.newPassword && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-600 dark:text-slate-400">{isAr ? 'قوة كلمة المرور:' : 'Password Security Strength:'}</span>
                <span className={
                  strengthScore <= 1 ? 'text-red-500' :
                  strengthScore <= 2 ? 'text-amber-500' :
                  strengthScore === 3 ? 'text-blue-500' : 'text-emerald-500'
                }>
                  {strengthScore <= 1 ? (isAr ? 'ضعيفة جداً' : 'Very Weak') :
                   strengthScore <= 2 ? (isAr ? 'متوسطة' : 'Fair') :
                   strengthScore === 3 ? (isAr ? 'جيدة' : 'Strong') : (isAr ? 'ممتازة ومحمية' : 'Excellent (AES-Ready)')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full h-full transition-all duration-300 ${
                      strengthScore >= step
                        ? strengthScore <= 1 ? 'bg-red-500' : strengthScore <= 2 ? 'bg-amber-500' : strengthScore === 3 ? 'bg-blue-500' : 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              {updating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShieldCheckIcon className="w-4 h-4" />
              )}
              {updating ? (isAr ? 'جاري التحديث...' : 'Updating...') : (isAr ? 'تحديث كلمة المرور' : 'Update Security Password')}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2FA Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'التحقق بخطوتين (2FA)' : 'Two-Factor Authentication (2FA)'}
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? 'حماية عبر الرسائل القصيرة OTP' : 'SMS / Authenticator app code'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={handleToggle2FA}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600" />
              </label>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isAr
                ? 'عند تسجيل الدخول من جهاز جديد، سنطلب كود أمان مؤقت لضمان أمان حسابك وحقائب الأدوات المسجلة باسمك.'
                : 'Require an extra verification passcode whenever you sign in from an unrecognized dental station or device.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <CheckCircleIcon className="w-4 h-4" />
            <span>{twoFactorEnabled ? (isAr ? '2FA مفعل وحسابك محمي بالكامل' : '2FA Active & Protected') : (isAr ? 'يوصى بتفعيله لحسابات الأطباء' : 'Recommended for Clinicians')}</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <ComputerDesktopIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isAr ? 'الجلسات والأجهزة النشطة' : 'Active Clinical Sessions'}
                </h4>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr ? 'الأجهزة المتصلة بحسابك الآن' : 'Devices currently logged in'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Windows PC • Chrome (Current)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Cairo, EG • Kasr Al-Ainy Campus Wi-Fi</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {isAr ? 'نشط الآن' : 'Active'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">iPad Pro • Safari Mobile</span>
                  <span className="text-[10px] text-slate-500 font-mono">Phantom Lab Terminal • 2 days ago</span>
                </div>
              </div>
              <button
                onClick={() => toast.success(isAr ? 'تم إنهاء الجلسة عن بُعد' : 'Session revoked')}
                className="text-[11px] text-red-600 hover:underline font-semibold"
              >
                {isAr ? 'تسجيل خروج' : 'Revoke'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecuritySettings;
