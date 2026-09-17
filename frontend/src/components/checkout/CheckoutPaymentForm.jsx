import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  DevicePhoneMobileIcon, 
  BoltIcon, 
  BuildingStorefrontIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  LockClosedIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const CheckoutPaymentForm = ({ 
  paymentMethod, 
  setPaymentMethod
}) => {
  const { t } = useTranslation('ecommerce');

  const paymentMethods = [
    {
      id: 'cash_on_delivery',
      name: t('checkout.payment.cashOnDelivery', 'Cash on Delivery (COD)'),
      tag: 'Most Popular for Students',
      tagColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: BanknotesIcon,
      description: 'Pay cash upon inspecting your clinical kit and verifying autoclave seal at your campus locker or clinic.',
      details: 'No prepayment required. Please keep exact change ready upon batch arrival.'
    },
    {
      id: 'shakeout',
      name: 'Credit / Debit Card (Visa, Mastercard, Meeza)',
      tag: 'Instant 256-Bit SSL',
      tagColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: CreditCardIcon,
      description: 'Instant secure checkout via automated Egyptian banking gateway with 3D Secure OTP verification.',
      details: 'You will be redirected to the secure gateway to complete authentication.'
    },
    {
      id: 'instapay',
      name: 'InstaPay Egypt (IPN Transfer)',
      tag: '0% Fees • Instant',
      tagColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: BoltIcon,
      description: 'Transfer directly to our verified InstaPay account: dentalkit@instapay with zero transaction fees.',
      details: 'Instant order confirmation upon entering your reference number or screenshot.'
    },
    {
      id: 'vodafone_cash',
      name: 'Vodafone Cash & Smart Wallets',
      tag: 'Orange / WE / Etisalat',
      tagColor: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
      icon: DevicePhoneMobileIcon,
      description: 'Pay via any Egyptian mobile wallet. A verified 010 wallet reference number will be provided.',
      details: 'Fast SMS confirmation and batch dispatch synchronization.'
    },
    {
      id: 'fawry',
      name: 'Fawry Pay-at-Store',
      tag: '180,000+ Kiosks',
      tagColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: BuildingStorefrontIcon,
      description: 'Get an instant Fawry reference code valid for 48 hours at any grocery, pharmacy, or kiosk.',
      details: 'Order dispatches automatically as soon as payment is confirmed at the POS.'
    },
    {
      id: 'valu',
      name: 'ValU 0% Dental Installments',
      tag: 'Student Financing',
      tagColor: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20',
      icon: SparklesIcon,
      description: 'Split your full clinical kit or high-speed handpiece cost over 3 to 12 easy monthly installments.',
      details: '0% interest promotions available for enrolled Egyptian dental students.'
    }
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <CreditCardIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('checkout.payment.title', '3. Egyptian Payment Gateways')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('checkout.payment.subtitle', 'Select your preferred local payment method or campus cash settlement')}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
          <LockClosedIcon className="w-3.5 h-3.5 text-emerald-500" />
          PCI-DSS Compliant
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
        {paymentMethods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const MethodIcon = method.icon;

          return (
            <button
              type="button"
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`flex flex-col text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 relative ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 shadow-md ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-700/90 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/70'
              }`}
            >
              {/* Active check bubble */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <MethodIcon className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${method.tagColor}`}>
                    {method.tag}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'bg-teal-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}>
                    {isSelected && <CheckCircleIcon className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                {method.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {method.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Payment Guidance Banner */}
      <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 flex items-start gap-3">
        <InformationCircleIcon className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {paymentMethod === 'cash_on_delivery' && (
            <span><strong>Campus COD Policy:</strong> You may inspect all dental instruments, burs, and clinical packs upon pickup at your campus locker or clinic door before handing cash to the courier.</span>
          )}
          {paymentMethod === 'shakeout' && (
            <span><strong>Encrypted Card Gateway:</strong> You will be seamlessly redirected to our central bank-authorized payment terminal after placing the order to input your 3D Secure card credentials.</span>
          )}
          {paymentMethod === 'instapay' && (
            <span><strong>InstaPay Instructions:</strong> Complete your order, and you'll receive the DentalKit IPN address <code className="px-1.5 py-0.5 rounded bg-teal-200/50 dark:bg-teal-900/60 font-mono font-bold text-teal-800 dark:text-teal-200">dentalkit@instapay</code> to complete transfer with zero extra commission.</span>
          )}
          {paymentMethod === 'vodafone_cash' && (
            <span><strong>Wallet Instructions:</strong> Our automated wallet coordinator will send you the active merchant wallet number via SMS/WhatsApp immediately after clicking Place Order.</span>
          )}
          {paymentMethod === 'fawry' && (
            <span><strong>Fawry Reference:</strong> A 6-digit payment code will appear on your confirmation screen. Present it at any kiosk within 48 hours to initiate automated shipping.</span>
          )}
          {paymentMethod === 'valu' && (
            <span><strong>ValU Financing:</strong> You can select 3, 6, 9, or 12 months installment tenure on the final verification step with instant student eligibility verification.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm; 