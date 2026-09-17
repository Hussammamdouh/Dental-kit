import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/seo/Seo';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const VerifyEmailSentPage = () => {
  const { t } = useTranslation('auth');
  const { currentLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const email = location.state?.email || 'your student email';

  const handleResendEmail = useCallback(async () => {
    if (!email) {
      toast.error('No email specified');
      return;
    }

    setIsResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success(t('verifyEmailSent.resendSuccess') || 'Activation email resent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend activation link');
    } finally {
      setIsResending(false);
    }
  }, [email, t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <Seo
        title="Activation Email Sent - DentalKit"
        description="Verify your university student email to complete registration."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto shadow-inner animate-in zoom-in-90 duration-300">
            <EnvelopeIcon className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Verify University Email
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We have sent a student portal verification link to:
          </p>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs text-teal-600 dark:text-teal-400 break-all border border-slate-200 dark:border-slate-700">
            {email}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Please check your inbox and click the activation button to start shopping with your 25% academic discount.
          </p>
        </div>

        <div className="space-y-3 pt-2 relative z-10">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>{isResending ? 'Sending...' : 'Resend Verification Link'}</span>
          </button>

          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors inline-block"
          >
            Already verified? Sign In →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmailSentPage;
