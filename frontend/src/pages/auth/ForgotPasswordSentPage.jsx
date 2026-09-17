import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/seo/Seo';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordSentPage = () => {
  const { t } = useTranslation('auth');
  const { currentLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const passedEmail = location.state?.email || 'your registered student email';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <Seo
        title="Password Reset Link Sent - DentalKit"
        description="Password recovery instructions sent to your inbox."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto shadow-inner animate-in zoom-in-90 duration-300">
            <CheckCircleIcon className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Check Your Inbox
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We have dispatched password recovery instructions and a secure reset link to:
          </p>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs text-teal-600 dark:text-teal-400 break-all border border-slate-200 dark:border-slate-700">
            {passedEmail}
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Next Steps:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Click the verification link inside the email within 60 minutes.</li>
              <li>Check your spam/junk folder if you don't see it in 2 minutes.</li>
              <li>Create a strong new password with at least 8 characters.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3 pt-2 relative z-10">
          <Link
            to="/login"
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 block"
          >
            <span>Return to Student Sign In</span>
          </Link>

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors inline-block"
          >
            Didn't receive email? Try again
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordSentPage;
