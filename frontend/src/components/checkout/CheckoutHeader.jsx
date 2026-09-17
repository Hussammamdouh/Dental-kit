import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { ShieldCheckIcon, AcademicCapIcon, TruckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const CheckoutHeader = () => {
  const { t } = useTranslation('ecommerce');

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-10 sm:py-14 border-b border-teal-500/20">
      {/* Background glow accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 border border-teal-500/30 text-teal-300 backdrop-blur-md">
              <LockClosedIcon className="w-3.5 h-3.5 text-teal-400" />
              256-Bit SSL Encrypted Checkout
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 backdrop-blur-md">
              <AcademicCapIcon className="w-3.5 h-3.5 text-emerald-400" />
              Campus Locker & Clinic Express Delivery
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            {t('checkout.title', 'Secure Dental Checkout')}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('checkout.subtitle', 'Complete your order with official Egyptian faculty lockers, direct clinical dispatch, and flexible local payment gateways.')}
          </p>

          {/* Quick trust metrics */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto text-center text-xs sm:text-sm text-slate-400">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>MoH Certified</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <TruckIcon className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Door & Locker Dispatch</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>14-Day Autoclave Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader; 