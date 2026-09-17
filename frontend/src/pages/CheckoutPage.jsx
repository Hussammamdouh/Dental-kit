import React, { useState, useEffect } from 'react';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  ShoppingCartIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import api, { endpoints } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Modular checkout components
import CheckoutHeader from '../components/checkout/CheckoutHeader';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';
import CheckoutNavigation from '../components/checkout/CheckoutNavigation';
import CheckoutShippingForm from '../components/checkout/CheckoutShippingForm';
import CheckoutBillingForm from '../components/checkout/CheckoutBillingForm';
import CheckoutPaymentForm from '../components/checkout/CheckoutPaymentForm';
import CheckoutReviewForm from '../components/checkout/CheckoutReviewForm';

const CheckoutPage = () => {
  const { t } = useTranslation('ecommerce');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    items: cartItems, 
    subtotal, 
    total, 
    totalItems, 
    clearCart, 
    tax: cartTax, 
    shipping: cartShipping, 
    discount: cartDiscount,
    appliedCoupon
  } = useCart();
  const { currentLanguage } = useLanguage();
  const { currentTheme } = useTheme();
  
  // State
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: 'Cairo',
    state: 'Cairo',
    country: 'EG',
    zipCode: '',
    phone: ''
  });
  
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: 'Cairo',
    state: 'Cairo',
    country: 'EG',
    zipCode: '',
    phone: ''
  });
  
  const [useDefaultAddresses, setUseDefaultAddresses] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [customerNotes, setCustomerNotes] = useState('');

  // Fetch user profile data to prefill
  const fetchUserProfile = async () => {
    try {
      const response = await api.get(endpoints.users.profile);
      setUserProfile(response.data);
      
      const userData = response.data;
      setShippingAddress(prev => ({
        ...prev,
        firstName: userData.firstName || userData.name?.split(' ')[0] || prev.firstName,
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || prev.lastName,
        company: userData.faculty || userData.company || prev.company,
        phone: userData.phone || prev.phone,
        address1: userData.address || prev.address1,
        city: userData.city || prev.city,
        state: userData.governorate || userData.state || prev.state,
        country: userData.country || 'EG'
      }));
      
      setBillingAddress(prev => ({
        ...prev,
        firstName: userData.firstName || userData.name?.split(' ')[0] || prev.firstName,
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || prev.lastName,
        company: userData.faculty || userData.company || prev.company,
        phone: userData.phone || prev.phone,
        address1: userData.address || prev.address1,
        city: userData.city || prev.city,
        state: userData.governorate || userData.state || prev.state,
        country: userData.country || 'EG'
      }));
      
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  // Shipping methods with costs and delivery times
  const shippingMethods = [
    { id: 'standard', cost: 0 },
    { id: 'express', cost: 25 },
    { id: 'overnight', cost: 50 },
    { id: 'pickup', cost: 0 }
  ];

  // Calculate order summary
  const calculateOrderSummary = () => {
    if (!cartItems) return null;
    
    const cartSubtotal = subtotal || 0;
    const selectedShipping = shippingMethods.find(m => m.id === shippingMethod);
    const shippingCost = selectedShipping ? selectedShipping.cost : (cartShipping || 0);
    const taxAmount = cartTax || (cartSubtotal * 0.14);
    const discountAmount = cartDiscount || 0;
    
    const recalculatedTotal = cartSubtotal + shippingCost + taxAmount - discountAmount;
    const finalTotal = selectedShipping && selectedShipping.cost !== cartShipping 
      ? recalculatedTotal 
      : (total || recalculatedTotal);
    
    return {
      subtotal: cartSubtotal,
      shipping: shippingCost,
      tax: taxAmount,
      discount: discountAmount,
      total: finalTotal,
      itemCount: totalItems || 0
    };
  };

  // Order summary calculation
  const orderSummary = calculateOrderSummary();

  // Handle form submission
  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      
      if (!cartItems || cartItems.length === 0) {
        toast.error('Cart is empty. Please add items to your cart.');
        return;
      }
      
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }
      
      if (!useDefaultAddresses) {
        if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address1 || !shippingAddress.city) {
          toast.error('Please fill in all required shipping information');
          return;
        }
      }
      
      if (!sameAsShipping && !useDefaultAddresses) {
        if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.address1 || !billingAddress.city) {
          toast.error('Please fill in all required billing information');
          return;
        }
      }
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          image: item.image,
          category: item.category,
          brand: item.brand,
          vendor: item.vendor || null
        })),
        shippingAddress: useDefaultAddresses ? {} : shippingAddress,
        billingAddress: (useDefaultAddresses || sameAsShipping) ? {} : billingAddress,
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod,
        customerNotes: customerNotes || '',
        useDefaultAddresses: useDefaultAddresses || false,
        sameAsShipping: sameAsShipping || false,
        orderSummary: orderSummary,
        couponCode: appliedCoupon?.code || (typeof appliedCoupon === 'string' ? appliedCoupon : null)
      };
      
      const response = await api.post(endpoints.orders.checkout, orderData);
      
      toast.success(t('checkout.orderPlaced', 'Dental dispatch order registered successfully!'));
      
      clearCart();
      
      const createdOrderId = response?.data?.order?.id 
        || response?.data?.order?._id 
        || response?.order?.id 
        || response?.order?._id 
        || response?.data?.id 
        || response?._id;

      if (paymentMethod === 'shakeout') {
        navigate(`/payment?orderId=${createdOrderId}`);
      } else {
        navigate(`/orders/${createdOrderId}`);
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('checkout.error.placingOrder', 'Error placing order');
      toast.error(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      if (!useDefaultAddresses) {
        if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address1 || !shippingAddress.city) {
          toast.error('Please complete destination details');
          return;
        }
      }
    } else if (currentStep === 2) {
      if (!sameAsShipping && !useDefaultAddresses) {
        if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.address1 || !billingAddress.city) {
          toast.error('Please complete billing details');
          return;
        }
      }
    } else if (currentStep === 3) {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <ExclamationTriangleIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t('checkout.error.title', 'Checkout Error')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <button 
            onClick={fetchUserProfile} 
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-md hover:bg-teal-700 transition-colors"
          >
            {t('cart.retry', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] py-20 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-6 border border-teal-500/20">
            <ShoppingCartIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Your Clinical Tray is Empty
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Please add dental instruments, burs, or academic stage packages before proceeding to checkout.
          </p>
          <button 
            onClick={() => navigate('/products')} 
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-500/25 hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            <span>Explore Dental Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <Seo
        title={t('seo.checkout.title', 'Secure Checkout | DentalKit Egypt')}
        description={t('seo.checkout.description', 'Securely complete your dental equipment purchase with university locker pickup and local gateways')}
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor={currentTheme === 'dark' ? '#0B1220' : '#FFFFFF'}
      />

      {/* Header */}
      <CheckoutHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back to Cart link */}
          <div className="mb-6 flex items-center justify-between">
            <Link 
              to="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Return to Cart / Review Items</span>
            </Link>

            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
              Verified Clinical Dispatch
            </span>
          </div>

          {/* Stepper Progress */}
          <CheckoutProgress currentStep={currentStep} />

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Steps Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping & Locker Destination */}
              {currentStep === 1 && (
                <CheckoutShippingForm
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  useDefaultAddresses={useDefaultAddresses}
                  setUseDefaultAddresses={setUseDefaultAddresses}
                  userProfile={userProfile}
                />
              )}

              {/* Step 2: Clinical Billing & Invoicing */}
              {currentStep === 2 && (
                <CheckoutBillingForm
                  billingAddress={billingAddress}
                  setBillingAddress={setBillingAddress}
                  sameAsShipping={sameAsShipping}
                  setSameAsShipping={setSameAsShipping}
                  userProfile={userProfile}
                />
              )}

              {/* Step 3: Payment Gateways */}
              {currentStep === 3 && (
                <CheckoutPaymentForm
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              )}

              {/* Step 4: Dispatch Speed & Review */}
              {currentStep === 4 && (
                <CheckoutReviewForm
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  customerNotes={customerNotes}
                  setCustomerNotes={setCustomerNotes}
                />
              )}

              {/* Navigation Bar */}
              <CheckoutNavigation
                currentStep={currentStep}
                onNext={nextStep}
                onPrevious={prevStep}
                onPlaceOrder={handlePlaceOrder}
                placingOrder={placingOrder}
              />
            </div>

            {/* Sticky Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <CheckoutOrderSummary
                cart={cartItems}
                orderSummary={orderSummary}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 