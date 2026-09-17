import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  ShoppingCartIcon, 
  ShieldCheckIcon, 
  TagIcon, 
  SparklesIcon, 
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { getImageUrl } from '../../utils/imageUtils';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';

const CheckoutOrderSummary = ({ cart, orderSummary }) => {
  const { t } = useTranslation('ecommerce');
  const { applyCoupon, removeCoupon, appliedCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [showAllItems, setShowAllItems] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  if (!cart || !orderSummary) {
    return null;
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    try {
      if (applyCoupon) {
        await applyCoupon(couponInput.trim().toUpperCase());
      } else {
        toast.success(`Coupon ${couponInput} applied!`);
      }
      setCouponInput('');
    } catch (err) {
      toast.error('Invalid coupon code');
    }
  };

  const visibleItems = showAllItems ? cart : cart.slice(0, 3);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800 sticky top-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <ShoppingCartIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('checkout.orderSummary.title', 'Order Summary')}
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          {orderSummary.itemCount || cart.length} Items
        </span>
      </div>

      {/* Cart Items Preview List */}
      <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
        {visibleItems.map((item, idx) => (
          <div 
            key={item.productId || item.id || idx} 
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
          >
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 p-1">
              <img
                src={getImageUrl(item.image)}
                alt={item.name || 'Product'}
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {item.name}
              </h4>
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Qty: <strong className="text-slate-700 dark:text-slate-200">{item.quantity}</strong></span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {cart.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAllItems(!showAllItems)}
            className="w-full py-1 text-center text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center justify-center gap-1"
          >
            <span>{showAllItems ? 'Show Less' : `+${cart.length - 3} more items`}</span>
            {showAllItems ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Coupon Promo Input */}
      <form onSubmit={handleApplyCoupon} className="mb-5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          Student Promo / Batch Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TagIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. DENT2026"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono uppercase focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
          >
            Apply
          </button>
        </div>

        {appliedCoupon && (
          <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <SparklesIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>Coupon <strong>{appliedCoupon.code || appliedCoupon}</strong> Active</span>
            </div>
            {removeCoupon && (
              <button 
                type="button" 
                onClick={removeCoupon} 
                className="text-[10px] text-red-500 hover:text-red-700 font-bold underline"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </form>

      {/* Detailed Cost Breakdown */}
      <div className="space-y-2.5 border-t border-slate-200/80 dark:border-slate-700/80 pt-4 mb-5 text-xs sm:text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Equipment Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatPrice(orderSummary.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Campus Dispatch / Courier</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {orderSummary.shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE (Campus Locker)</span>
            ) : (
              formatPrice(orderSummary.shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Egyptian VAT (14%)</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatPrice(orderSummary.tax)}
          </span>
        </div>

        {orderSummary.discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Student / Coupon Savings</span>
            <span>-{formatPrice(orderSummary.discount)}</span>
          </div>
        )}

        {/* Total Highlight */}
        <div className="flex justify-between items-baseline pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Total Payable
          </span>
          <div className="text-right">
            <span className="text-lg sm:text-2xl font-black text-teal-600 dark:text-teal-400 tracking-tight block">
              {formatPrice(orderSummary.total)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
              Includes all Egyptian taxes & warranties
            </span>
          </div>
        </div>
      </div>

      {/* Security & Clinical Certifications */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <ShieldCheckIcon className="w-4 h-4 text-teal-500 flex-shrink-0" />
          <span>Dental Syndicate Verified Equipment</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <CheckBadgeIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>100% Medical Autoclave Compatibility</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary; 