import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  ReceiptPercentIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Input from '../ui/Input';

const EGYPTIAN_GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 
  'Gharbia', 'Monufia', 'Beheira', 'Kafr El Sheikh', 'Damietta', 
  'Port Said', 'Ismailia', 'Suez', 'Fayoum', 'Beni Suef', 
  'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor', 'Aswan', 
  'Red Sea', 'Matrouh', 'North Sinai', 'South Sinai', 'New Valley'
];

const CheckoutBillingForm = ({ 
  billingAddress, 
  setBillingAddress, 
  sameAsShipping, 
  setSameAsShipping,
  userProfile = null
}) => {
  const { t } = useTranslation('ecommerce');
  const [requestTaxInvoice, setRequestTaxInvoice] = useState(false);
  const [taxId, setTaxId] = useState('');

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('checkout.billing.title', '2. Clinical Billing & Invoicing')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('checkout.billing.subtitle', 'Provide invoice details for clinical tax deduction or warranty tracking')}
            </p>
          </div>
        </div>
      </div>

      {/* Same As Shipping Card */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setSameAsShipping(!sameAsShipping)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
            sameAsShipping 
              ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs ring-1 ring-teal-500/20' 
              : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
              sameAsShipping ? 'bg-teal-600 text-white' : 'border border-slate-300 dark:border-slate-600'
            }`}>
              {sameAsShipping && <CheckCircleIcon className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                {t('checkout.billing.sameAsShipping', 'Same as Shipping / Campus Destination')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Invoice will be addressed to the recipient in Step 1.
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            {sameAsShipping ? 'Active' : 'Custom'}
          </span>
        </button>
      </div>

      {/* Egyptian Tax & Clinical Invoice Add-on */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <ReceiptPercentIcon className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Official Egyptian Tax Invoice (فاتورة ضريبية إلكترونية)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Include your Clinic / Practice Tax Registration Number (الرقم الضريبي) for official expense deductions.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={requestTaxInvoice}
            onChange={(e) => setRequestTaxInvoice(e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-slate-300 dark:border-slate-600 mt-1 cursor-pointer"
          />
        </div>

        {requestTaxInvoice && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Clinic Tax Number / الرقم الضريبي"
              placeholder="e.g. 100-234-567"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />
            <Input
              label="Official Practice / Syndicate Name"
              placeholder="e.g. Cairo Dental Specialists LLC"
              value={billingAddress.company}
              onChange={(e) => setBillingAddress({...billingAddress, company: e.target.value})}
            />
          </div>
        )}
      </div>

      {/* Custom Billing Address if different */}
      {!sameAsShipping && (
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BuildingOfficeIcon className="w-4 h-4 text-teal-500" />
            Custom Billing Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('checkout.shipping.firstName', 'First Name')}
              value={billingAddress.firstName}
              onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
              required
            />
            <Input
              label={t('checkout.shipping.lastName', 'Last Name')}
              value={billingAddress.lastName}
              onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Egyptian Phone Number *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 font-medium pointer-events-none">
                  🇪🇬 +20
                </span>
                <input
                  type="tel"
                  placeholder="10 1234 5678"
                  value={billingAddress.phone.replace(/^\+20\s?/, '')}
                  onChange={(e) => setBillingAddress({...billingAddress, phone: `+20 ${e.target.value}`})}
                  required
                  className="w-full pl-16 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <Input
              label="Clinic / Company Name"
              value={billingAddress.company}
              onChange={(e) => setBillingAddress({...billingAddress, company: e.target.value})}
            />
          </div>

          <Input
            label={t('checkout.shipping.address1', 'Billing Street Address *')}
            value={billingAddress.address1}
            onChange={(e) => setBillingAddress({...billingAddress, address1: e.target.value})}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Governorate *
              </label>
              <select
                value={billingAddress.state || 'Cairo'}
                onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {EGYPTIAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <Input
              label={t('checkout.shipping.city', 'City / District *')}
              value={billingAddress.city}
              onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
              required
            />

            <Input
              label={t('checkout.shipping.zipCode', 'Postal Code')}
              value={billingAddress.zipCode}
              onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutBillingForm; 