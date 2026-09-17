import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  CheckIcon, 
  MapPinIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';

const CheckoutProgress = ({ currentStep }) => {
  const { t } = useTranslation('ecommerce');

  const steps = [
    { key: 'shipping', label: t('checkout.steps.shipping', 'Shipping & Delivery'), icon: MapPinIcon },
    { key: 'billing', label: t('checkout.steps.billing', 'Clinical Invoice'), icon: DocumentTextIcon },
    { key: 'payment', label: t('checkout.steps.payment', 'Payment Method'), icon: CreditCardIcon },
    { key: 'review', label: t('checkout.steps.review', 'Review & Confirm'), icon: ClipboardDocumentCheckIcon }
  ];

  return (
    <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between max-w-3xl mx-auto relative">
        {/* Background Connecting Bar */}
        <div className="absolute top-5 left-6 right-6 sm:left-12 sm:right-12 h-1 bg-slate-200 dark:bg-slate-800 -z-0 rounded-full" />
        {/* Active Filled Bar */}
        <div 
          className="absolute top-5 left-6 sm:left-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 -z-0 rounded-full transition-all duration-500"
          style={{ 
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${currentStep === 1 ? '0px' : '24px'})` 
          }}
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div 
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-teal-500/25 ring-2 ring-teal-500/30'
                    : isCurrent
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-teal-500/40 ring-4 ring-teal-500/20 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <StepIcon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                )}
              </div>

              {/* Step Label & Sub-badge */}
              <div className="mt-2 text-center">
                <span className={`block text-[11px] sm:text-xs font-bold tracking-tight transition-colors duration-200 ${
                  isCurrent 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : isCompleted 
                    ? 'text-slate-800 dark:text-slate-200' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {step.label}
                </span>
                <span className="hidden sm:inline-block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {isCompleted ? 'Completed' : isCurrent ? `Step ${stepNumber} of 4` : `Step ${stepNumber}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress; 