import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSecurity } from '../../hooks/useSecurity';
import Seo from '../../components/seo/Seo';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { sanitizeEmail, sanitizeString } from '../../utils/inputSanitizer';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  TruckIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  UserGroupIcon,
  BoltIcon,
  BeakerIcon,
  KeyIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const { login, isLocked, lockoutUntil } = useAuth();
  const { isDark } = useTheme();
  const { currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Security hook
  const {
    isLocked: securityLocked,
    lockoutUntil: securityLockoutUntil,
    recordFailedAttempt,
    resetAttempts,
    validateInput,
    performSecurityCheck,
    canProceed
  } = useSecurity({
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
    rateLimitWindow: 60 * 1000,
    maxRequestsPerWindow: 10
  });

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [accountType, setAccountType] = useState('student'); // 'student' | 'clinic' | 'vendor'
  const formRef = useRef(null);

  // Redirect path
  const from = location.state?.from?.pathname || '/';

  // Validation schema
  const schema = useMemo(() => yup.object().shape({
    email: yup
      .string()
      .required(t('validation.email.required') || 'Email is required')
      .email(t('validation.email.invalid') || 'Invalid email format')
      .max(254)
      .trim(),
    password: yup
      .string()
      .required(t('validation.password.required') || 'Password is required')
      .min(6, t('validation.password.min') || 'Password must be at least 6 characters')
      .max(128)
  }), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    setError,
    clearErrors,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const watchedValues = watch();
  const performSecurityCheckRef = useRef(performSecurityCheck);
  useEffect(() => { performSecurityCheckRef.current = performSecurityCheck; }, [performSecurityCheck]);

  // Security check effect
  useEffect(() => {
    if (watchedValues.email && watchedValues.password) {
      const timer = setTimeout(async () => {
        const result = await performSecurityCheckRef.current({
          email: watchedValues.email,
          password: watchedValues.password
        });
        setSecurityCheck(Boolean(result?.passed ?? result));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [watchedValues.email, watchedValues.password]);

  const isAccountLocked = isLocked || securityLocked;
  const lockoutTime = lockoutUntil || securityLockoutUntil;

  // Form submission
  const onSubmit = useCallback(async (data) => {
    if (!canProceed || isAccountLocked) return;

    setIsSubmitting(true);
    clearErrors();

    try {
      const sanitizedData = {
        email: sanitizeEmail(data.email),
        password: sanitizeString(data.password)
      };

      if (!validateInput(sanitizedData.email) || !validateInput(sanitizedData.password)) {
        throw new Error('Invalid characters detected');
      }

      const result = await login({ email: sanitizedData.email, password: sanitizedData.password });
      if (!result?.success) {
        throw new Error(result?.error || 'Login failed');
      }

      resetAttempts();
      toast.success(t('login.success') || 'Welcome back to DentalKit!');

      const role = result.user?.role || 'user';
      if (role === 'vendor') {
        navigate('/vendor/dashboard', { replace: true });
      } else if (['admin', 'super_admin', 'it_admin'].includes(role)) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/login' || from === '/register' ? '/' : from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      recordFailedAttempt();

      if (error.response?.status === 400 || error.message?.includes('credentials')) {
        const msg = t('login.invalidCredentials') || 'Invalid email or password';
        setError('root', { message: msg });
        toast.error(msg);
      } else if (error.response?.status === 423 || error.message?.includes('locked')) {
        const msg = t('login.accountLocked') || 'Account temporarily locked. Please try again later.';
        setError('root', { message: msg });
        toast.error(msg);
      } else {
        const msg = error.response?.data?.message || t('login.genericError') || 'Login failed. Please check your credentials.';
        setError('root', { message: msg });
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [login, navigate, from, clearErrors, setError, canProceed, isAccountLocked, recordFailedAttempt, resetAttempts, validateInput, t]);

  const formatLockoutTime = (time) => {
    const minutes = Math.ceil((time - Date.now()) / (1000 * 60));
    return minutes > 0 ? minutes : 0;
  };

  // Quick Demo Credential Autofill
  const handleAutofillDemo = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    toast.success('Loaded student demo credentials!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <Seo
        title="Student & Faculty Sign In - DentalKit"
        description="Sign in to your DentalKit portal to manage BDS course packages, track university hospital deliveries, and access faculty batch discounts."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Left Pane: Medical Clinical Branding Showcase (5 cols on lg) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Background CAD Matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Top Logo & Portal Title */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner group-hover:scale-105 transition-transform">
                <AcademicCapIcon className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <span className="text-lg font-black text-white block tracking-tight">DentalKit</span>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Student Clinical Portal</span>
              </div>
            </Link>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Empowering Dental Students & Medical Faculties
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Access professor-approved instrument sets, pre-clinical typodont packages, and campus cohort discounts.
              </p>
            </div>

            {/* Clinical Value Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <BuildingLibraryIcon className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Faculty Syllabus Aligned</span>
                  <span className="text-[11px] text-slate-400">Kasr Al-Ainy, Ain Shams, Mansoura & private BDS curricula</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <ShieldCheckIcon className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">German AISI 420 Steel</span>
                  <span className="text-[11px] text-slate-400">134°C Autoclavable with 2-year anti-rust guarantee</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <TruckIcon className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Campus Locker Delivery</span>
                  <span className="text-[11px] text-slate-400">Direct delivery to university clinic lockers & dorms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Stats */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="font-black text-white text-base block">15K+</span>
              <span className="text-[10px] text-slate-400">BDS Students</span>
            </div>
            <div>
              <span className="font-black text-teal-400 text-base block">8 Faculties</span>
              <span className="text-[10px] text-slate-400">Verified Syllabi</span>
            </div>
            <div>
              <span className="font-black text-white text-base block">100%</span>
              <span className="text-[10px] text-slate-400">Autoclave Safe</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Sign In Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            {/* Header & Role Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Sign In
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your academic credentials to access your student tray
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold hidden sm:inline-flex items-center gap-1">
                  <KeyIcon className="w-3.5 h-3.5" />
                  Secure Portal
                </span>
              </div>

              {/* Role Toggle Pills */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => setAccountType('student')}
                  className={`py-2 rounded-xl transition-all ${
                    accountType === 'student'
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎓 Dental Student
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('clinic')}
                  className={`py-2 rounded-xl transition-all ${
                    accountType === 'clinic'
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🏥 Clinic / Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('vendor')}
                  className={`py-2 rounded-xl transition-all ${
                    accountType === 'vendor'
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🏢 Faculty / Vendor
                </button>
              </div>
            </div>

            {/* Lockout Warning */}
            {isAccountLocked && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-xs">
                <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block">Account Temporarily Locked</span>
                  <span>Too many failed login attempts. Try again in {formatLockoutTime(lockoutTime)} minutes.</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('login.email') || 'University or Personal Email'}
                </label>
                <div className="relative flex items-center">
                  <EnvelopeIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-5 h-5 text-slate-400 pointer-events-none`} />
                  <input
                    type="email"
                    {...register('email')}
                    disabled={isAccountLocked || isSubmitting}
                    placeholder="student@dentistry.cu.edu.eg"
                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] font-semibold text-rose-500 block pt-0.5">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('login.password') || 'Password'}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <LockClosedIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-5 h-5 text-slate-400 pointer-events-none`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    disabled={isAccountLocked || isSubmitting}
                    placeholder="••••••••••••"
                    className={`w-full ${isRTL ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[11px] font-semibold text-rose-500 block pt-0.5">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember this campus device</span>
                </label>

                {securityCheck && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Security Verified
                  </span>
                )}
              </div>

              {/* Root Error */}
              {errors.root && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-semibold">
                  {errors.root.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isAccountLocked || isSubmitting || !canProceed}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Signing in to DentalKit...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="p-3 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-dashed border-teal-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Quick Demo Sign-In:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAutofillDemo('student@dentalkit.com', 'DentalStudent2026!')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-bold hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors cursor-pointer"
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofillDemo('admin@dentalkit.com', 'DentalAdmin2026!')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-bold hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors cursor-pointer"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Register CTA & Policy Links */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              New Dental Student or Faculty Member?{' '}
              <Link
                to="/register"
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Create University Account →
              </Link>
            </p>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-teal-500">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline hover:text-teal-500">Privacy Policy</Link>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;