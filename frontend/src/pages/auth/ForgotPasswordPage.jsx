import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSecurity } from '../../hooks/useSecurity';
import Seo from '../../components/seo/Seo';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  AcademicCapIcon,
  KeyIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordPage = () => {
  const { t } = useTranslation('auth');
  const { forgotPassword } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security hook
  const {
    sanitizeInput,
    validateInput,
    canProceed
  } = useSecurity({
    rateLimitWindow: 60 * 1000,
    maxRequestsPerWindow: 5
  });

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t('validation.email.required') || 'Email is required')
      .email(t('validation.email.invalid') || 'Invalid email format')
      .max(254)
      .trim()
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '' }
  });

  const onSubmit = useCallback(async (data) => {
    if (isSubmitting || !canProceed) return;

    setIsSubmitting(true);
    clearErrors();

    try {
      const sanitizedEmail = sanitizeInput(data.email, 'email');
      const emailValidation = validateInput(sanitizedEmail, {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      });

      if (!emailValidation.isValid) {
        setError('email', { type: 'manual', message: emailValidation.error });
        throw new Error(emailValidation.error);
      }

      await forgotPassword(sanitizedEmail);
      toast.success(t('forgotPassword.success') || 'Password reset link sent to your email!');
      navigate('/forgot-password/sent', { state: { email: sanitizedEmail }, replace: true });
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send password reset link');
    } finally {
      setIsSubmitting(false);
    }
  }, [forgotPassword, navigate, isSubmitting, canProceed, setError, clearErrors, sanitizeInput, validateInput, t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <Seo
        title="Reset University Account Password - DentalKit"
        description="Recover your DentalKit student portal password."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto shadow-inner">
            <KeyIcon className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Reset Password
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter the email address registered with your dental faculty account. We'll send you a secure link to reset your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" noValidate>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Registered Email
            </label>
            <div className="relative flex items-center">
              <EnvelopeIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-5 h-5 text-slate-400 pointer-events-none`} />
              <input
                type="email"
                {...register('email')}
                placeholder="student@dentistry.cu.edu.eg"
                className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-rose-500 block pt-0.5">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Sending Recovery Link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center relative z-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeftIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            <span>Return to Student Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
