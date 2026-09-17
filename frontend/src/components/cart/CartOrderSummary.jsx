import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  CheckCircleIcon,
  XMarkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const POPULAR_PROMOS = [
  { code: 'CAMPUS15', labelEn: '15% Faculty Cohort Discount', labelAr: 'خصم الكلية ١٥٪ للدفعة' },
  { code: 'DENTAL10', labelEn: '10% First Order Welcome Pass', labelAr: 'خصم ١٠٪ للطلب الأول' }
];

const CartOrderSummary = ({
  subtotal = 0,
  tax = 0,
  shipping = 0,
  discount = 0,
  total = 0,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  disabled = false
}) => {
  const { currentLanguage, isRTL } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const [promoCode, setPromoCode] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const handleApplyPromoCode = async (codeToApply) => {
    const targetCode = (codeToApply || promoCode).trim();
    if (!targetCode) return;
    
    try {
      setApplyingPromo(true);
      await onApplyCoupon(targetCode);
      setPromoCode('');
    } catch {
      // Handled in CartContext
    } finally {
      setApplyingPromo(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-teal-500" />
          <span>{isAr ? 'ملخص حساب الحقيبة' : 'Order & Tray Summary'}</span>
        </h2>
        <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-500/20">
          EGP CURRENCY
        </span>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <span>{isAr ? 'إجمالي قيمة الأدوات (Subtotal)' : 'Tray Subtotal'}</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span>{isAr ? 'التوصيل لخزائن الكلية (Campus Delivery)' : 'Campus Locker Delivery'}</span>
          </div>
          <span className={`font-bold font-mono ${shipping === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
            {shipping === 0 ? (isAr ? 'مجاني (Free)' : 'FREE') : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <span>{isAr ? 'ضريبة القيمة المضافة التقديرية (14% VAT)' : 'Estimated VAT (14%)'}</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">
            {formatPrice(tax)}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold pt-1">
            <span className="flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'خصم الكود المطبق' : 'Coupon Discount'}</span>
            </span>
            <span className="font-mono">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      {/* Promo Code Input & Quick Tags */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {isAr ? 'كود خصم الدفعة الجامعية أو القسيمة' : 'Promo / Campus Batch Code'}
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder={isAr ? 'مثال: CAMPUS15' : 'e.g. CAMPUS15'}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono uppercase"
            disabled={applyingPromo}
          />
          <button
            type="button"
            onClick={() => handleApplyPromoCode()}
            disabled={!promoCode.trim() || applyingPromo}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
          >
            {applyingPromo ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              (isAr ? 'تطبيق' : 'Apply')
            )}
          </button>
        </div>

        {/* Applied Coupon Banner */}
        {appliedCoupon && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="font-bold font-mono">{appliedCoupon.code || 'COUPON'}</span>
              <span>(-{formatPrice(discount)})</span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 p-1 cursor-pointer"
              title={isAr ? 'إلغاء الكود' : 'Remove code'}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Clickable Promos */}
        {!appliedCoupon && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              {isAr ? 'أكواد متاحة لفرقتك:' : 'Available Campus Codes:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_PROMOS.map((pr) => (
                <button
                  key={pr.code}
                  type="button"
                  onClick={() => handleApplyPromoCode(pr.code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <TagIcon className="w-3 h-3 text-teal-500" />
                  <span className="font-mono">{pr.code}</span>
                  <span className="opacity-70 font-normal">({isAr ? pr.labelAr : pr.labelEn})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            {isAr ? 'المبلغ الإجمالي المستحق' : 'Total Investment'}
          </span>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
            {isAr ? 'شامل الضريبة والشحن' : 'Inc. VAT & Delivery'}
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
          {formatPrice(total)}
        </div>
      </div>

      {/* Proceed to Checkout CTA */}
      <button
        type="button"
        onClick={onProceedToCheckout}
        disabled={disabled}
        className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <LockClosedIcon className="w-5 h-5" />
        <span>{isAr ? 'متابعة الدفع وتأكيد الحجز' : 'Proceed to University Checkout'}</span>
        <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      {/* Safety & Encryption Guarantee */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 justify-center">
        <ShieldCheckIcon className="w-4 h-4 text-teal-500 flex-shrink-0" />
        <span>{isAr ? 'دفع آمن ومعتمد بنسبة 100% بتشفير SSL 256-Bit' : '100% Encrypted & Syndicate Approved Checkout'}</span>
      </div>

    </div>
  );
};

export default CartOrderSummary;