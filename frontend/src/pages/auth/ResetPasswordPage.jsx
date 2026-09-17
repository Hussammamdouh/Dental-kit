import React, { useState, useCallback, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSecurity } from '../../hooks/useSecurity';
import Seo from '../../components/seo/Seo';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  CheckCircleIcon,
  KeyIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const ResetPasswordPage = () => {
  const { t } = useTranslation('auth');
  const { resetPassword } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { sanitizeInput, validateInput, canProceed } = useSecurity({
    rateLimitWindow: 60 * 1000,
    maxRequestsPerWindow: 5
  });

  const schema = useMemo(() => yup.object().shape({
    password: yup
      .string()
      .required(t('validation.password.required') || 'Password is required')
      .min(8, t('validation.password.min') || 'Minimum 8 characters')
      .max(128),
    confirmPassword: yup
      .string()
      .required('Please confirm your new password')
      .oneOf([yup.ref('password'), null], 'Passwords do not match')
  }), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' }
  });

  const passwordValue = watch('password');

  React.useEffect(() => {
    if (!passwordValue) {
      setPasswordStrength({ score: 0, feedback: [] });
      return;
    }
    const { score, feedback } = calculatePasswordStrength(passwordValue);
    setPasswordStrength({ score, feedback });
  }, [passwordValue]);

  const onSubmit = useCallback(async (data) => {
    if (isSubmitting || !canProceed) return;
    setIsSubmitting(true);

    try {
      const sanitizedPassword = sanitizeInput(data.password, 'password');
      await resetPassword({
        token,
        email,
        password: sanitizedPassword
      });
      setIsSuccess(true);
      toast.success(t('resetPassword.success') || 'Password updated successfully!');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  }, [resetPassword, token, email, isSubmitting, canProceed, sanitizeInput, t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <Seo
        title="Set New Password - DentalKit"
        description="Create your new DentalKit student portal password."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

        {isSuccess ? (
          <div className="text-center space-y-4 py-4 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
              <CheckCircleIcon className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Password Updated!
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your academic credentials have been securely updated. You can now sign in to your student portal.
            </p>

            <Link
              to="/login"
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 block"
            >
              <span>Sign In to Student Portal</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto shadow-inner">
                <LockClosedIcon className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Set New Password
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please create a secure password for {email || 'your account'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" noValidate>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <LockClosedIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••••••"
                    className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} text-slate-400 p-1`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-[11px] text-rose-500">{errors.password.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <LockClosedIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="••••••••••••"
                    className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.confirmPassword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} text-slate-400 p-1`}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-[11px] text-rose-500">{errors.confirmPassword.message}</span>}
              </div>

              {passwordValue && (
                <PasswordStrengthIndicator strength={passwordStrength} />
              )}

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm New Password</span>
                    <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center relative z-10">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <ArrowLeftIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPasswordPage;
