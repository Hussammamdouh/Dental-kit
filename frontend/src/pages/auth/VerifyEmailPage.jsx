import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/seo/Seo';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const { t } = useTranslation('auth');
  const { currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success' | 'error' | 'expired'

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const verifyEmail = useCallback(async () => {
    if (!token || !email) {
      setVerificationStatus('error');
      return;
    }

    setIsVerifying(true);
    try {
      await api.get('/auth/verify-email', {
        params: { token, email }
      });
      setVerificationStatus('success');
      toast.success('University student account verified successfully!');
    } catch (error) {
      const errorType = error.response?.data?.errorType;
      if (errorType === 'TOKEN_EXPIRED') {
        setVerificationStatus('expired');
      } else {
        setVerificationStatus('error');
      }
    } finally {
      setIsVerifying(false);
    }
  }, [token, email]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const handleResend = async () => {
    if (!email) {
      toast.error('No email address specified');
      return;
    }
    setIsResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('New activation link sent to your email!');
    } catch (error) {
      toast.error('Failed to resend verification link');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <Seo
        title="Email Verification - DentalKit"
        description="Verify your DentalKit student portal account."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

        {isVerifying ? (
          <div className="py-8 space-y-4 relative z-10">
            <LoadingSpinner size="lg" className="mx-auto text-teal-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Verifying University Account...
            </h3>
            <p className="text-xs text-slate-400">
              Validating academic activation token for {email}
            </p>
          </div>
        ) : verificationStatus === 'success' ? (
          <div className="space-y-4 py-2 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
              <CheckCircleIcon className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Account Activated!
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your student email has been verified. You now have full access to university package discounts and campus locker delivery.
            </p>

            <Link
              to="/login"
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 block"
            >
              <span>Sign In to Student Portal</span>
              <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        ) : verificationStatus === 'expired' ? (
          <div className="space-y-4 py-2 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto shadow-inner">
              <ExclamationTriangleIcon className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Activation Link Expired
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This verification token has expired for your security. Please request a new activation email.
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>{isResending ? 'Sending...' : 'Resend Activation Link'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-2 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto shadow-inner">
              <ExclamationTriangleIcon className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Verification Failed
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We could not verify your email token. It may have already been used or the link is invalid.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={verifyEmail}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Retry
              </button>
              <Link
                to="/login"
                className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;
