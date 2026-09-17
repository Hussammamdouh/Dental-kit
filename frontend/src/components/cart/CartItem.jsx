import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { getImageUrl } from '../../utils/imageUtils';

const CartItem = ({ 
  item, 
  onQuantityChange, 
  onRemoveItem, 
  updatingItem 
}) => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';

  const formatPrice = (price) => {
    return new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const discountPercentage = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const isUpdating = updatingItem === item.id;
  const itemTotalPrice = (Number(item.price) || 0) * (Number(item.quantity) || 1);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        
        {/* Product Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-2.5 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-500 text-white shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Product Details & Specs */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
              {item.brand || 'DentalKit'} • {item.category || 'Clinical'}
            </span>
            
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              {isAr ? 'متوفر للتسليم بالكلية' : 'Campus In Stock'}
            </span>
          </div>

          <Link
            to={`/products/${item.productId || item.id}`}
            className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-2"
          >
            {item.name}
          </Link>

          {/* Micro Clinical Spec Pill */}
          <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <ShieldCheckIcon className="w-3 h-3 text-teal-500" />
              AISI 420 • 134°C Autoclave
            </span>
            {item.sku && (
              <span className="hidden sm:inline-block">REF: {item.sku}</span>
            )}
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 gap-3">
          
          {/* Price */}
          <div className="text-left sm:text-right">
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {formatPrice(itemTotalPrice)}
            </div>
            {item.quantity > 1 && (
              <div className="text-[11px] text-slate-400 font-mono">
                {formatPrice(item.price)} {isAr ? 'للقطعة' : 'each'}
              </div>
            )}
          </div>

          {/* Quantity Controls & Trash Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-1">
              <button
                type="button"
                onClick={() => onQuantityChange(item.id, (item.quantity || 1) - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                title={isAr ? 'تقليل الكمية' : 'Decrease quantity'}
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              
              <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white font-mono">
                {isUpdating ? (
                  <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  item.quantity
                )}
              </span>

              <button
                type="button"
                onClick={() => onQuantityChange(item.id, (item.quantity || 1) + 1)}
                disabled={isUpdating || item.quantity >= (item.maxQuantity || 99)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                title={isAr ? 'زيادة الكمية' : 'Increase quantity'}
              >
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Remove Trash Button */}
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title={isAr ? 'حذف من الحقيبة' : 'Remove from tray'}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartItem;