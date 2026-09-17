import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ShieldCheckIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';

const CheckoutNavigation = ({ 
  currentStep, 
  onNext, 
  onPrevious, 
  onPlaceOrder, 
  placingOrder 
}) => {
  const { t } = useTranslation('ecommerce');

  const getStepActionLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Proceed to Invoicing';
      case 2:
        return 'Proceed to Payment';
      case 3:
        return 'Review & Confirm Order';
      default:
        return t('checkout.steps.review', 'Continue');
    }
  };

  return (
    <div className="flex items-center justify-between pt-4">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onPrevious}
          disabled={placingOrder}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 font-bold text-sm transition-all shadow-xs disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
          {t('common.back', 'Back')}
        </button>
      ) : (
        <div />
      )}
      
      {currentStep < 4 ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-500/25 transition-all transform active:scale-95 ml-auto"
        >
          <span>{getStepActionLabel()}</span>
          <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={placingOrder}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-teal-500/30 transition-all transform active:scale-95 disabled:opacity-60 ml-auto"
        >
          {placingOrder ? (
            <>
              <LoadingSpinner size="sm" className="mr-1" />
              <span>{t('checkout.processing', 'Securing Dental Dispatch...')}</span>
            </>
          ) : (
            <>
              <ShieldCheckIcon className="w-5 h-5 stroke-[2.5]" />
              <span>{t('checkout.placeOrder', 'Confirm & Place Order')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CheckoutNavigation; 