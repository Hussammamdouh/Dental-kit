import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedSection from '../components/animations/AnimatedSection';

// Modular Cart Components
import CartHeader from '../components/cart/CartHeader';
import CartBreadcrumb from '../components/cart/CartBreadcrumb';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItemsList from '../components/cart/CartItemsList';
import CartOrderSummary from '../components/cart/CartOrderSummary';
import CartBatchProgress from '../components/cart/CartBatchProgress';
import CartSecurityPerks from '../components/cart/CartSecurityPerks';

import { 
  ArrowLeftIcon, 
  TrashIcon, 
  ShoppingBagIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const CartPage = () => {
  const { t } = useTranslation('ecommerce');
  const navigate = useNavigate();
  const { currentLanguage, isRTL } = useLanguage();
  const { currentTheme } = useTheme();
  const isAr = currentLanguage === 'ar';

  const { 
    items = [], 
    subtotal = 0, 
    tax = 0, 
    shipping = 0, 
    discount = 0, 
    total = 0,
    totalItems = 0,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon
  } = useCart();
  
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingItemId(itemId);
      await updateQuantity(itemId, newQuantity);
    } catch {
      toast.error(isAr ? 'فشل تعديل الكمية' : 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch {
      toast.error(isAr ? 'فشل إزالة الأداة' : 'Failed to remove item');
    }
  };

  const handleApplyCoupon = async (promoCode) => {
    try {
      await applyCoupon(promoCode);
    } catch (err) {
      // Handled in CartContext
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-teal-600 dark:text-teal-400">
            {isAr ? 'جاري تحميل حقيبة الأدوات...' : 'Loading Clinical Tray...'}
          </p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <CartEmptyState />;
  }

  const effectiveItemCount = totalItems || items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Seo
        title={isAr ? 'حقيبة الأدوات والطلبيات | DentalKit' : 'Clinical Student Tray & Cart | DentalKit'}
        description={isAr ? 'معاينة الأدوات والمبارد المختارة، خصومات الدفعة الجامعية، وشحن الخزائن الذكية' : 'Review your dental student instruments, verify metallurgy certifications, and apply campus batch discounts'}
        type="website"
        locale={isAr ? 'ar_EG' : 'en_US'}
        themeColor={currentTheme === 'dark' ? '#0f172a' : '#00b1db'}
      />

      {/* Hero Header */}
      <CartHeader itemCount={effectiveItemCount} />

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Step Breadcrumb Bar */}
        <AnimatedSection animation="fadeInDown" delay={0}>
          <CartBreadcrumb currentStep={1} />
        </AnimatedSection>

        {/* Live Cohort & Delivery Progress Meter */}
        <AnimatedSection animation="fadeInUp" delay={50}>
          <CartBatchProgress 
            subtotal={subtotal} 
            itemCount={effectiveItemCount} 
            onApplyCode={handleApplyCoupon} 
          />
        </AnimatedSection>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tray Items List (8 cols on lg) */}
          <AnimatedSection animation="fadeInUp" delay={100} className="lg:col-span-8 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isAr ? 'الأدوات المسجلة في الحقيبة' : 'Selected Clinical Setup'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(isAr ? 'هل أنت متأكد من تفريغ كافة الأدوات من الحقيبة؟' : 'Are you sure you want to clear your entire tray?')) {
                      clearCart();
                    }
                  }}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تفريغ الحقيبة' : 'Clear Tray'}</span>
                </button>
              </div>

              {/* Items List */}
              <CartItemsList
                items={items}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                updatingItem={updatingItemId}
              />
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                <ArrowLeftIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                <span>{isAr ? 'إضافة المزيد من الأدوات من الكتالوج' : 'Continue Adding Instruments'}</span>
              </Link>

              <span className="text-slate-400 font-mono text-[11px]">
                {effectiveItemCount} {isAr ? 'قطعة مسجلة' : 'Units Configured'}
              </span>
            </div>

            {/* Quality & Payment Assurances */}
            <CartSecurityPerks />

          </AnimatedSection>

          {/* Right Column: Order Summary & Checkout CTA (4 cols on lg) */}
          <AnimatedSection animation="fadeInUp" delay={150} className="lg:col-span-4 sticky top-24">
            <CartOrderSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              discount={discount}
              total={total}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={removeCoupon}
              onProceedToCheckout={handleProceedToCheckout}
              disabled={!items || items.length === 0}
            />
          </AnimatedSection>

        </div>

      </div>
    </div>
  );
};

export default CartPage;