import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const CheckoutPaymentForm = ({ 
  paymentMethod, 
  setPaymentMethod
}) => {
  const { t } = useTranslation('ecommerce');

  const paymentMethods = [
    {
      id: 'cash_on_delivery',
      name: t('checkout.payment.cashOnDelivery'),
      icon: BanknotesIcon,
      description: t('checkout.payment.payWhenReceive', 'Pay when you receive your order')
    },
    {
      id: 'shakeout',
      name: t('checkout.payment.creditDebitCard', 'Credit/Debit Card'),
      icon: CreditCardIcon,
      description: t('checkout.payment.securePayment', 'Secure payment via payment gateway')
    }
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20">
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <CreditCardIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t('checkout.payment.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {t('checkout.payment.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === method.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="flex flex-col items-center text-center">
                <method.icon className={`w-8 h-8 sm:w-10 sm:h-10 mb-3 ${
                  paymentMethod === method.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1">
                  {method.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Message for Credit/Debit Card */}
        {paymentMethod === 'shakeout' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t('checkout.payment.gatewayRedirect', 'You will be redirected to our secure payment gateway to complete your payment.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPaymentForm; 