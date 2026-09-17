import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  MapPinIcon, 
  BuildingLibraryIcon, 
  HomeModernIcon, 
  UserCircleIcon, 
  CheckCircleIcon,
  SparklesIcon,
  PhoneIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import Input from '../ui/Input';

const EGYPTIAN_UNIVERSITIES = [
  { id: 'cu', name: 'Cairo University (Kasr Al-Ainy)', locker: 'Gate 3 - Dental Main Lobby Locker #A4' },
  { id: 'asu', name: 'Ain Shams University', locker: 'Demerdash Hospital Dental Dept - Floor 2 Box #B2' },
  { id: 'alexu', name: 'Alexandria University', locker: 'Azarita Faculty of Dentistry Locker #C1' },
  { id: 'mansu', name: 'Mansoura University', locker: 'Clinical Dental Building - Ground Locker #D7' },
  { id: 'miu', name: 'Misr International University (MIU)', locker: 'KM 28 Cairo-Ismailia Dental Wing #M1' },
  { id: 'must', name: 'Misr University for Science & Tech (MUST)', locker: 'Al-Motamayez Campus Dental Pavilion #S3' },
  { id: 'fue', name: 'Future University in Egypt (FUE)', locker: 'New Cairo Campus Dental Clinic Bay #F5' },
  { id: 'bue', name: 'British University in Egypt (BUE)', locker: 'El Sherouk Campus Faculty of Dentistry #B8' },
  { id: 'guc', name: 'German University in Cairo (GUC)', locker: 'New Cairo Med Annex Locker #G2' },
  { id: 'o6u', name: 'October 6 University (O6U)', locker: 'Central Hospital Dental Section #O9' },
  { id: 'tanta', name: 'Tanta University', locker: 'Faculty of Dentistry Medical Complex #T1' },
  { id: 'zag', name: 'Zagazig University', locker: 'Dental Hospital Reception Locker #Z3' }
];

const EGYPTIAN_GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 
  'Gharbia', 'Monufia', 'Beheira', 'Kafr El Sheikh', 'Damietta', 
  'Port Said', 'Ismailia', 'Suez', 'Fayoum', 'Beni Suef', 
  'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor', 'Aswan', 
  'Red Sea', 'Matrouh', 'North Sinai', 'South Sinai', 'New Valley'
];

const CheckoutShippingForm = ({ 
  shippingAddress, 
  setShippingAddress, 
  useDefaultAddresses, 
  setUseDefaultAddresses,
  userProfile = null
}) => {
  const { t } = useTranslation('ecommerce');
  const [deliveryType, setDeliveryType] = useState('locker'); // 'locker' | 'doorstep'

  const handleLockerSelect = (univ) => {
    setShippingAddress(prev => ({
      ...prev,
      company: univ.name,
      address1: univ.locker,
      city: univ.name.includes('Alexandria') ? 'Alexandria' : univ.name.includes('Mansoura') ? 'Mansoura' : univ.name.includes('Tanta') ? 'Tanta' : univ.name.includes('Zagazig') ? 'Zagazig' : 'Cairo',
      state: univ.name.includes('Alexandria') ? 'Alexandria' : univ.name.includes('Mansoura') ? 'Dakahlia' : univ.name.includes('Tanta') ? 'Gharbia' : univ.name.includes('Zagazig') ? 'Sharqia' : 'Cairo'
    }));
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <MapPinIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('checkout.shipping.title', '1. Shipping & Dispatch Destination')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('checkout.shipping.subtitle', 'Select your university campus locker box or enter clinic/home coordinates')}
            </p>
          </div>
        </div>

        {userProfile && (
          <button
            type="button"
            onClick={() => {
              setUseDefaultAddresses(!useDefaultAddresses);
              if (!useDefaultAddresses && userProfile) {
                setShippingAddress(prev => ({
                  ...prev,
                  firstName: userProfile.firstName || userProfile.name?.split(' ')[0] || prev.firstName,
                  lastName: userProfile.lastName || userProfile.name?.split(' ').slice(1).join(' ') || prev.lastName,
                  phone: userProfile.phone || prev.phone,
                  company: userProfile.faculty || userProfile.company || prev.company,
                  address1: userProfile.address || prev.address1,
                  city: userProfile.city || prev.city,
                  state: userProfile.governorate || userProfile.state || prev.state
                }));
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
          >
            <UserCircleIcon className="w-4 h-4" />
            {useDefaultAddresses ? 'Editing Custom Address' : 'Sync Profile ID'}
          </button>
        )}
      </div>

      {/* Delivery Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setDeliveryType('locker')}
          className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            deliveryType === 'locker'
              ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-sm ring-1 ring-teal-500/30'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
          }`}
        >
          <div className={`p-2.5 rounded-lg flex-shrink-0 ${
            deliveryType === 'locker'
              ? 'bg-teal-500 text-white shadow-sm'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}>
            <BuildingLibraryIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Campus Smart Locker
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                0 EGP Batch Free
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pick up directly at your Egyptian dental faculty or clinic lobby locker.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryType('doorstep')}
          className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            deliveryType === 'doorstep'
              ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-sm ring-1 ring-teal-500/30'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
          }`}
        >
          <div className={`p-2.5 rounded-lg flex-shrink-0 ${
            deliveryType === 'doorstep'
              ? 'bg-teal-500 text-white shadow-sm'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}>
            <HomeModernIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Clinic / Home Courier
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                Door-to-Door
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct dispatch to your private dental clinic, hospital station, or residence.
            </p>
          </div>
        </button>
      </div>

      {/* University Campus Smart Locker Quick Picker */}
      {deliveryType === 'locker' && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select Your Egyptian Dental Faculty Locker:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {EGYPTIAN_UNIVERSITIES.map((univ) => {
              const isSelected = shippingAddress.company === univ.name;
              return (
                <button
                  type="button"
                  key={univ.id}
                  onClick={() => handleLockerSelect(univ)}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="truncate">{univ.name}</span>
                    {isSelected && <CheckCircleIcon className="w-4 h-4 text-teal-600 flex-shrink-0 ml-1" />}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    📍 {univ.locker}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('checkout.shipping.firstName', 'First Name / Title')}
            placeholder="e.g. Dr. Ahmed"
            value={shippingAddress.firstName}
            onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
            required
          />
          <Input
            label={t('checkout.shipping.lastName', 'Last Name')}
            placeholder="e.g. Mamdouh"
            value={shippingAddress.lastName}
            onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Egyptian Phone Number (WhatsApp Enabled) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 font-medium pointer-events-none">
                🇪🇬 +20
              </span>
              <input
                type="tel"
                placeholder="10 1234 5678"
                value={shippingAddress.phone.replace(/^\+20\s?/, '')}
                onChange={(e) => setShippingAddress({...shippingAddress, phone: `+20 ${e.target.value}`})}
                required
                className="w-full pl-16 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          <Input
            label={deliveryType === 'locker' ? 'Faculty / University Name' : 'Clinic / Hospital / Practice Name (Optional)'}
            placeholder={deliveryType === 'locker' ? 'Cairo University Faculty of Dentistry' : 'Al-Shifaa Dental Clinic'}
            value={shippingAddress.company}
            onChange={(e) => setShippingAddress({...shippingAddress, company: e.target.value})}
          />
        </div>

        <div className="space-y-1.5">
          <Input
            label={deliveryType === 'locker' ? 'Faculty Campus Locker Box / Hall' : 'Detailed Street Address & Clinic Suite *'}
            placeholder={deliveryType === 'locker' ? 'Main Dental Lobby Locker Box #A4 (Near Conservative Lab)' : '15 El-Tahrir St, 3rd Floor, Dental Suite 302'}
            value={shippingAddress.address1}
            onChange={(e) => setShippingAddress({...shippingAddress, address1: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Governorate *
            </label>
            <select
              value={shippingAddress.state || 'Cairo'}
              onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {EGYPTIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          <Input
            label={t('checkout.shipping.city', 'City / District *')}
            placeholder="e.g. Nasr City / Dokki"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
            required
          />

          <Input
            label={t('checkout.shipping.zipCode', 'Postal / Clinic Code')}
            placeholder="e.g. 11511"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutShippingForm; 