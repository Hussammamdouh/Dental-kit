import React from 'react';
import { SparklesIcon, TruckIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const CartBatchProgress = ({ subtotal = 0, itemCount = 0, onApplyCode }) => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';

  const FREE_SHIPPING_THRESHOLD = 500;
  const BATCH_DISCOUNT_ITEMS = 3;

  const shippingDiff = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const itemsDiff = Math.max(0, BATCH_DISCOUNT_ITEMS - itemCount);
  const isBatchUnlocked = itemCount >= BATCH_DISCOUNT_ITEMS;

  return (
    <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/60 border border-teal-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-lg space-y-3">
      {/* Tier 1: Free Campus Locker Delivery */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-4 h-4 text-teal-400" />
            <span>
              {shippingDiff === 0
                ? (isAr ? '🎉 مبروك! حصلت على شحن مجاني مباشر لخزائن الكلية' : '🎉 You unlocked Free Express Campus Locker Delivery!')
                : (isAr
                    ? `أضف مشتريات بقيمة ${shippingDiff.toLocaleString()} ج.م للحصول على شحن مجاني`
                    : `Add ${shippingDiff.toLocaleString()} EGP more for Free Campus Delivery`)}
            </span>
          </div>
          <span className="font-mono text-teal-300 text-[11px]">{shippingPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${shippingPercent}%` }}
          />
        </div>
      </div>

      {/* Tier 2: Campus Batch 15% Discount */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <TagIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            {isBatchUnlocked
              ? (isAr ? 'خصم الكلية ١٥٪ مفعل! استخدم كود CAMPUS15' : '15% Faculty Cohort Discount Unlocked!')
              : (isAr
                  ? `أضف ${itemsDiff} أداة إضافية لتفعيل خصم الدفعة الجامعية ١٥٪`
                  : `Add ${itemsDiff} more instrument${itemsDiff > 1 ? 's' : ''} to unlock 15% Batch Code`)}
          </span>
        </div>

        {isBatchUnlocked && onApplyCode && (
          <button
            type="button"
            onClick={() => onApplyCode('CAMPUS15')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold hover:bg-teal-500/30 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>{isAr ? 'تطبيق CAMPUS15' : 'Apply CAMPUS15'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CartBatchProgress;
