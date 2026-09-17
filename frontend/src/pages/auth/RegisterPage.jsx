import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import { COUNTRIES, GOVERNORATES } from '../../utils/locations';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  TruckIcon,
  SparklesIcon,
  ArrowRightIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const { register: registerUser } = useAuth();
  const { isDark } = useTheme();
  const { currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Security hook
  const {
    isLocked: securityLocked,
    lockoutUntil: securityLockoutUntil,
    recordFailedAttempt,
    resetAttempts,
    validateInput,
    performSecurityCheck,
    canProceed,
    sanitizeInput
  } = useSecurity({
    maxAttempts: 4,
    lockoutDuration: 10 * 60 * 1000,
    rateLimitWindow: 60 * 1000,
    maxRequestsPerWindow: 6
  });

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  // Dental Faculties in Egypt
  const universityOptions = [
    'Cairo University (Kasr Al-Ainy)',
    'Ain Shams University',
    'Mansoura University',
    'Alexandria University',
    'Badr University in Cairo (BUC)',
    'Misr University for Science & Technology (MUST)',
    'Future University in Egypt (FUE)',
    'Misr International University (MIU)',
    'Al-Azhar University',
    'Tanta University',
    'Zagazig University',
    'Pharos University Alexandria (PUA)',
    'Other International / Private Faculty'
  ];

  // BDS Academic Years
  const academicYears = [
    '1st Year BDS (Pre-Clinical / Dental Anatomy)',
    '2nd Year BDS (Pre-Clinical Phantom & Carving)',
    '3rd Year BDS (Operative Dentistry & Endodontics)',
    '4th Year BDS (Oral Surgery & Clinical Hospital)',
    '5th Year BDS (Graduation Candidate)',
    'Dental Resident / Intern Doctor',
    'Postgraduate / Master Student',
    'Practicing Dentist / Clinic Owner'
  ];

  // Validation schema
  const schema = useMemo(() => yup.object().shape({
    firstName: yup.string().required(t('validation.firstName.required') || 'First name is required').min(2).max(50).trim(),
    lastName: yup.string().required(t('validation.lastName.required') || 'Last name is required').min(2).max(50).trim(),
    email: yup.string().required(t('validation.email.required') || 'Email is required').email(t('validation.email.invalid') || 'Invalid email format').max(254).trim(),
    phone: yup.string().required(t('validation.phone.required') || 'Phone number is required').matches(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format').trim(),
    university: yup.string().required('Please select your dental faculty').trim(),
    academicYear: yup.string().required('Please select your academic stage').trim(),
    governorate: yup.string().required(t('validation.governorate.required') || 'Governorate is required').trim(),
    password: yup.string().required(t('validation.password.required') || 'Password is required').min(8, 'Minimum 8 characters').max(128),
    confirmPassword: yup.string().required('Please confirm your password').oneOf([yup.ref('password'), null], 'Passwords do not match'),
    consentGiven: yup.boolean().oneOf([true], 'You must accept the terms of service')
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      university: 'Cairo University (Kasr Al-Ainy)',
      academicYear: '3rd Year BDS (Operative Dentistry & Endodontics)',
      governorate: 'Cairo',
      password: '',
      confirmPassword: '',
      consentGiven: false
    }
  });

  const passwordValue = watch('password');

  useEffect(() => {
    if (!passwordValue) {
      setPasswordStrength({ score: 0, feedback: [] });
      return;
    }
    const { score, feedback } = calculatePasswordStrength(passwordValue);
    setPasswordStrength({ score, feedback });
  }, [passwordValue]);

  const onSubmit = useCallback(async (data) => {
    if (isSubmitting || securityLocked || !canProceed) return;

    setIsSubmitting(true);
    clearErrors();

    try {
      const sanitizedData = {
        firstName: sanitizeInput(data.firstName, 'text'),
        lastName: sanitizeInput(data.lastName, 'text'),
        email: sanitizeInput(data.email, 'email'),
        phone: sanitizeInput(data.phone, 'phone'),
        university: sanitizeInput(data.university, 'text'),
        company: sanitizeInput(data.academicYear, 'text'),
        country: 'EG',
        governorate: sanitizeInput(data.governorate, 'text'),
        password: sanitizeInput(data.password, 'password'),
        consentGiven: data.consentGiven
      };

      const result = await registerUser(sanitizedData);
      if (result?.success) {
        resetAttempts();
        toast.success(t('register.success') || 'University account created successfully!');
        navigate('/verify-email-sent', { state: { email: sanitizedData.email } });
      } else {
        if (result?.status === 409) {
          setError('email', { type: 'manual', message: 'Email address is already registered' });
          toast.error('This email is already registered');
        } else {
          toast.error(result?.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      recordFailedAttempt();
      toast.error(error.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  }, [registerUser, navigate, isSubmitting, securityLocked, canProceed, setError, clearErrors, sanitizeInput, recordFailedAttempt, resetAttempts, t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <Seo
        title="Create Student University Account - DentalKit"
        description="Register for your DentalKit student portal to access syllabus-approved BDS toolkits, campus cohort discounts, and 134°C autoclave warranty registration."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      <div className="w-full max-w-6xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative my-6">
        
        {/* Left Pane: Branding & Student Perks (5 cols on lg) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner group-hover:scale-105 transition-transform">
                <AcademicCapIcon className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <span className="text-lg font-black text-white block tracking-tight">DentalKit</span>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">University Student Registration</span>
              </div>
            </Link>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Join 15,000+ Dental Students Across Egypt
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your verified student profile to unlock faculty package discounts, track clinical exam kits, and receive campus locker delivery.
              </p>
            </div>

            {/* Student Perks Card */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                  <SparklesIcon className="w-4 h-4 text-teal-400" />
                  <span>Student Welcome Benefits</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Instant 25% discount on BDS semester package boxes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Automatic syllabus checklist validation for your faculty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>2-Year Anti-Rust replacement warranty certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Free express delivery to your faculty hospital locker</span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs">
                <ShieldCheckIcon className="w-6 h-6 text-teal-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">100% Privacy & Security</span>
                  <span className="text-[11px] text-slate-400">Your student data is strictly encrypted and protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-400 hover:underline">
              Sign In Here →
            </Link>
          </div>
        </div>

        {/* Right Pane: Registration Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
              New Student Onboarding
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Create University Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill in your academic details to configure your syllabus tool checklists
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  First Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <input
                    type="text"
                    {...register('firstName')}
                    placeholder="Ahmed"
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.firstName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
                  />
                </div>
                {errors.firstName && <span className="text-[11px] text-rose-500">{errors.firstName.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Last Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <input
                    type="text"
                    {...register('lastName')}
                    placeholder="Mamdouh"
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.lastName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
                  />
                </div>
                {errors.lastName && <span className="text-[11px] text-rose-500">{errors.lastName.message}</span>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  University / Personal Email
                </label>
                <div className="relative flex items-center">
                  <EnvelopeIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="student@dentistry.cu.edu.eg"
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
                  />
                </div>
                {errors.email && <span className="text-[11px] text-rose-500">{errors.email.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <PhoneIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+20 100 000 0000"
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
                  />
                </div>
                {errors.phone && <span className="text-[11px] text-rose-500">{errors.phone.message}</span>}
              </div>
            </div>

            {/* University Faculty & Academic Stage Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dental Faculty
                </label>
                <div className="relative flex items-center">
                  <BuildingLibraryIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <select
                    {...register('university')}
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.university ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer`}
                  >
                    {universityOptions.map((uni, idx) => (
                      <option key={idx} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Academic Stage / Year
                </label>
                <div className="relative flex items-center">
                  <AcademicCapIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                  <select
                    {...register('academicYear')}
                    className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                      errors.academicYear ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer`}
                  >
                    {academicYears.map((yr, idx) => (
                      <option key={idx} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Governorate */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Governorate (Delivery Region)
              </label>
              <div className="relative flex items-center">
                <MapPinIcon className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
                <select
                  {...register('governorate')}
                  className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border ${
                    errors.governorate ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer`}
                >
                  {GOVERNORATES.map((gov, idx) => (
                    <option key={idx} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
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
                  Confirm Password
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
            </div>

            {/* Password Strength Indicator */}
            {passwordValue && (
              <PasswordStrengthIndicator strength={passwordStrength} />
            )}

            {/* Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('consentGiven')}
                  className="rounded text-teal-600 focus:ring-teal-500 mt-0.5"
                />
                <span>
                  I agree to the <Link to="/terms" className="text-teal-600 dark:text-teal-400 font-semibold underline">Terms of Service</Link> and <Link to="/privacy" className="text-teal-600 dark:text-teal-400 font-semibold underline">Privacy Policy</Link>, and verify my student status for educational pricing.
                </span>
              </label>
              {errors.consentGiven && (
                <span className="text-[11px] text-rose-500 block pt-1">{errors.consentGiven.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting || securityLocked}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creating University Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Unlock Discounts</span>
                  <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
