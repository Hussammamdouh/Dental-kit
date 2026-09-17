import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CreditCardIcon, 
  CheckCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const CartBreadcrumb = ({ currentStep = 1 }) => {
  const { currentLanguage, isRTL } = useLanguage();
  const isAr = currentLanguage === 'ar';

  const steps = [
    { id: 1, nameEn: '1. Clinical Tray', nameAr: '١. حقيبة الأدوات', icon: ShoppingBagIcon },
    { id: 2, nameEn: '2. Campus Locker', nameAr: '٢. خزائن الكلية', icon: TruckIcon },
    { id: 3, nameEn: '3. Secure Payment', nameAr: '٣. الدفع الآمن', icon: CreditCardIcon },
    { id: 4, nameEn: '4. Pass & Invoice', nameAr: '٤. الفاتورة والاعتماد', icon: CheckCircleIcon }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-500/20'
                      : isCompleted
                      ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <step.icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-300'
                      : isCompleted
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  {isAr ? step.nameAr : step.nameEn}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <ChevronRightIcon className={`w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CartBreadcrumb;