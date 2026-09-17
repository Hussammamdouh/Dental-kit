import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  TruckIcon, 
  BuildingLibraryIcon, 
  BoltIcon, 
  BuildingStorefrontIcon, 
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const CheckoutReviewForm = ({ 
  shippingMethod, 
  setShippingMethod, 
  customerNotes, 
  setCustomerNotes 
}) => {
  const { t } = useTranslation('ecommerce');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(price);
  };

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Campus Batch Dispatch',
      badge: 'Free Batch Delivery',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      cost: 0,
      deliveryTime: '2-3 Days (Campus Locker)',
      icon: BuildingLibraryIcon,
      description: 'Scheduled batch courier to your university faculty locker box.'
    },
    {
      id: 'express',
      name: 'Express Clinic / Door Courier',
      badge: 'Fast Doorstep',
      badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      cost: 25,
      deliveryTime: '24-48 Hours',
      icon: TruckIcon,
      description: 'Direct door-to-door delivery to your private dental clinic or home address.'
    },
    {
      id: 'overnight',
      name: 'Urgent OSCE / Practical Exam Rush',
      badge: 'Priority Same/Next Day',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      cost: 50,
      deliveryTime: 'Next Morning',
      icon: BoltIcon,
      description: 'Urgent priority dispatch for students needing equipment before practical exams.'
    },
    {
      id: 'pickup',
      name: 'DentalKit Hub Pickup (Cairo HQ)',
      badge: 'Immediate Collection',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
      cost: 0,
      deliveryTime: 'Same Day Ready',
      icon: BuildingStorefrontIcon,
      description: 'Pick up immediately from our central fulfillment center in Nasr City.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Shipping Method Selection */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 dark:border-slate-800 transition-all">
        <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <TruckIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('checkout.shippingMethod.title', '4. Dispatch Speed & Delivery Method')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t('checkout.shippingMethod.subtitle', 'Select standard university locker batch or urgent exam rush dispatch')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
          {shippingMethods.map((method) => {
            const isSelected = shippingMethod === method.id;
            const MethodIcon = method.icon;

            return (
              <button
                type="button"
                key={method.id}
                onClick={() => setShippingMethod(method.id)}
                className={`flex flex-col text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 relative ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 shadow-md ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700/90 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/40 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <MethodIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white block">
                      {method.cost === 0 ? 'FREE' : formatPrice(method.cost)}
                    </span>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${method.badgeColor} mt-0.5`}>
                      {method.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 mb-0.5">
                  {method.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  ⏱️ {method.deliveryTime}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
                  {method.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Notes / Locker Instructions */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 dark:border-slate-800 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('checkout.customerNotes', 'Clinical Station & Courier Instructions (Optional)')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide any instructions for your campus locker box, section rep, or clinic door access.
            </p>
          </div>
        </div>

        <textarea
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          placeholder="e.g. Please leave with Conservative Lab Section 4 leader if during clinic hours, or call 10 mins before arrival..."
          className="w-full p-3.5 sm:p-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none text-sm placeholder-slate-400 dark:placeholder-slate-500"
          rows="3"
        />

        {/* Quality assurance guarantee seal */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>Autoclave Sterility Seal & Anti-Tamper Packaging</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>14-Day Free Exchange for Clinical Defects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutReviewForm; 