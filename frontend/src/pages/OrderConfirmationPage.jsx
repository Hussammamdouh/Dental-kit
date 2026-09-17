import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import {
  CheckIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  ShoppingBagIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  QrCodeIcon,
  PrinterIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import api, { endpoints } from '../services/api';
import { toast } from 'react-hot-toast';
import { PDFGenerator } from '../utils/pdfGenerator';
import { getImageUrl } from '../utils/imageUtils';

const OrderConfirmationPage = () => {
  const { t } = useTranslation('ecommerce');
  const { currentLanguage } = useLanguage();
  const { currentTheme } = useTheme();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  
  // Fetch order data
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.orders.get(orderId));
      const data = response?.data ?? response;
      setOrder(data.order ?? data);
    } catch (err) {
      console.error('Fetch order error:', err);
      setError(err.response?.data?.message || err.message || t('orderConfirmation.error.fetchingOrder', 'Failed to retrieve order receipt'));
    } finally {
      setLoading(false);
    }
  };

  // Download PDF Invoice
  const downloadInvoice = async () => {
    if (!order) return;
    try {
      setDownloadingInvoice(true);
      const pdfGenerator = new PDFGenerator();
      const pdfDoc = pdfGenerator.generateInvoice(order);
      const orderNum = order.orderNumber || order.id || order._id || 'receipt';
      pdfDoc.save(`DentalKit-Invoice-${orderNum}.pdf`);
      toast.success(t('orderConfirmation.invoiceDownloaded', 'Official clinical tax invoice downloaded successfully!'));
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error(t('orderConfirmation.error.downloadingInvoice', 'Error generating PDF invoice'));
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Calculate estimated delivery date
  const getEstimatedDelivery = () => {
    if (!order) return null;
    const orderDate = new Date(order.createdAt || Date.now());
    const deliveryDays = order.shippingMethod === 'overnight' ? 1 : 
                        order.shippingMethod === 'express' ? 2 : 
                        order.shippingMethod === 'pickup' ? 0 : 3;
    
    if (deliveryDays === 0) return 'Ready for Same-Day Campus Collection';
    
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Lifecycle steps
  const orderSteps = [
    { id: 'placed', label: 'Order Confirmed', time: 'Instant', icon: CheckIcon, status: 'completed' },
    { id: 'autoclave_check', label: 'Autoclave QC Seal', time: 'In Progress', icon: CheckBadgeIcon, status: 'current' },
    { id: 'tray_packaging', label: 'Tray Packaging', time: 'Pending', icon: ShoppingBagIcon, status: 'upcoming' },
    { id: 'dispatched', label: 'Campus Locker Transit', time: 'Pending', icon: TruckIcon, status: 'upcoming' },
    { id: 'delivered', label: 'Locker Ready (OTP)', time: 'Pending', icon: BuildingLibraryIcon, status: 'upcoming' }
  ];

  // Load order on mount
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" className="text-teal-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
            Verifying Clinical Dispatch Receipt...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <ExclamationTriangleIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {error ? 'Order Receipt Error' : t('orderConfirmation.orderNotFound', 'Order Not Found')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {error || 'We could not locate this order receipt. Please check your order history in your profile.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {error && (
              <Button onClick={fetchOrder} variant="primary" className="text-sm">
                Try Again
              </Button>
            )}
            <Button onClick={() => navigate('/orders')} variant="secondary" className="text-sm">
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const orderNumberDisplay = order.orderNumber || order.id || order._id || `ORD-${orderId}`;
  const orderDateDisplay = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const estimatedDelivery = getEstimatedDelivery();

  // Smart locker simulated OTP
  const lockerOtp = orderNumberDisplay.replace(/\D/g, '').slice(-4) || '8492';
  const isLockerDelivery = order.shippingAddress?.company?.toLowerCase().includes('university') || 
                           order.shippingAddress?.address1?.toLowerCase().includes('locker') ||
                           order.shippingMethod === 'standard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <Seo
        title={`Order ${orderNumberDisplay} Confirmed | DentalKit Egypt`}
        description="Your dental instruments order has been confirmed and scheduled for campus locker / clinical dispatch."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor={currentTheme === 'dark' ? '#0B1220' : '#FFFFFF'}
      />

      {/* Hero Success Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-12 sm:py-16 border-b border-teal-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Success Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-xl shadow-teal-500/30 ring-4 ring-teal-500/20 mb-6">
              <CheckIcon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 backdrop-blur-md mb-3">
              <CheckBadgeIcon className="w-4 h-4 text-emerald-400" />
              <span>MoH & Clinical Quality Inspection Approved</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              {t('orderConfirmation.thankYou', 'Dispatch Confirmed!')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
              Thank you for trusting DentalKit. Your clinical equipment order has been synchronized with our medical fulfillment center.
            </p>

            {/* Quick Order Meta Bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium">
              <div>
                <span className="text-slate-400 mr-1.5">Order Ref:</span>
                <span className="font-mono font-bold text-teal-300 tracking-wider">
                  {orderNumberDisplay}
                </span>
              </div>
              <div className="hidden sm:inline text-white/30">•</div>
              <div>
                <span className="text-slate-400 mr-1.5">Date:</span>
                <span className="text-white font-semibold">{orderDateDisplay}</span>
              </div>
              <div className="hidden sm:inline text-white/30">•</div>
              <div>
                <span className="text-slate-400 mr-1.5">Est. Arrival:</span>
                <span className="font-bold text-emerald-300">{estimatedDelivery}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-6xl">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-bold transition-all shadow-xs"
            >
              <PrinterIcon className="w-4 h-4 text-slate-500" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={downloadInvoice}
              disabled={downloadingInvoice}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
            >
              {downloadingInvoice ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Generating Tax PDF...</span>
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-4 h-4 stroke-2" />
                  <span>Download Official Tax Invoice (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5-Step Clinical Dispatch Tracker */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <TruckIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Live Clinical Fulfillment Lifecycle
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Active Dispatch Batch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {orderSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isDone = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <div key={step.id} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20' 
                      : isCurrent 
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/30 ring-4 ring-teal-500/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    <StepIcon className="w-5 h-5 stroke-2" />
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${
                      isDone || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {step.label}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {step.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column: Ordered Instruments Tray & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ordered Instruments Table */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <ShoppingBagIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Instruments & Clinical Tray Contents
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {order.items?.length || 0} Total Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 mb-6">
                {(order.items || []).map((item, idx) => {
                  const itemImg = item.image?.url || item.image || '/placeholder-product.svg';
                  return (
                    <div 
                      key={item.productId || item.id || idx}
                      className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 transition-colors"
                    >
                      <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-lg p-1 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={getImageUrl(itemImg)}
                          alt={item.name || 'Product'}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {item.name || 'Clinical Dental Instrument'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            German AISI 420 Steel
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Qty: <strong className="text-slate-700 dark:text-slate-300">{item.quantity || 1}</strong>
                          </span>
                          {item.sku && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {item.sku}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-black text-xs sm:text-sm text-teal-600 dark:text-teal-400 block">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400">
                            {formatPrice(item.price)} ea
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Cost Breakdown Matrix */}
              <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Equipment Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Campus Locker / Clinic Dispatch</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {order.shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE (Campus Locker)</span>
                    ) : (
                      formatPrice(order.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Egyptian Standard VAT (14%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.tax)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Student / Cohort Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Total Settled Amount
                  </span>
                  <div className="text-right">
                    <span className="text-lg sm:text-2xl font-black text-teal-600 dark:text-teal-400 tracking-tight block">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Includes all medical warranties & autoclave assurance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Verification & Invoicing Notice */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <CreditCardIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Payment Verification & Clinical Tax Invoicing
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">Payment Method:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {order.paymentMethod === 'cash_on_delivery' && '💵 Cash on Campus Delivery (COD)'}
                    {order.paymentMethod === 'shakeout' && '💳 Credit / Debit Card (Visa/Mastercard/Meeza)'}
                    {order.paymentMethod === 'instapay' && '⚡ InstaPay Egypt (IPN Transfer)'}
                    {order.paymentMethod === 'vodafone_cash' && '📱 Vodafone Cash & Mobile Wallet'}
                    {order.paymentMethod === 'fawry' && '🏪 Fawry Pay-at-Store'}
                    {order.paymentMethod === 'valu' && '✨ ValU 0% Student Installments'}
                    {!['cash_on_delivery', 'shakeout', 'instapay', 'vodafone_cash', 'fawry', 'valu'].includes(order.paymentMethod) && (order.paymentMethod || 'Standard')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">Payment Status:</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 inline-flex items-center gap-1.5">
                    <CheckCircleIcon className="w-4 h-4" />
                    {order.paymentStatus || 'Verified for Dispatch'}
                  </span>
                </div>
              </div>

              {order.paymentMethod === 'cash_on_delivery' && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <strong>COD Pickup Advice:</strong> Please inspect your instrument box seal and verify tool count at your campus smart locker or with the courier before completing cash handoff.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Destination Coordinates & Smart Locker OTP */}
          <div className="space-y-6">
            {/* Faculty Smart Locker / Address Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Dispatch Coordinates
                </h3>
              </div>

              {/* Campus Locker OTP Code Simulator */}
              {isLockerDelivery && (
                <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-teal-500/5 border border-teal-500/30 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-300 block mb-1">
                    Smart Locker Pickup Code (OTP)
                  </span>
                  <div className="font-mono text-2xl font-black text-teal-600 dark:text-teal-400 tracking-widest my-1">
                    {lockerOtp}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enter this PIN on your Faculty Smart Locker Touchscreen to unlock your batch box.
                  </p>
                </div>
              )}

              {/* Address Content */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-teal-500" />
                  <span>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                </div>

                {order.shippingAddress?.company && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <BuildingLibraryIcon className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span className="font-semibold">{order.shippingAddress.company}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 leading-relaxed text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{order.shippingAddress?.address1}</p>
                  {order.shippingAddress?.address2 && <p>{order.shippingAddress?.address2}</p>}
                  <p className="text-slate-500 mt-1">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                </div>

                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2 pt-2 text-xs">
                    <PhoneIcon className="w-4 h-4 text-teal-500" />
                    <span>WhatsApp / Mobile: <strong>{order.shippingAddress.phone}</strong></span>
                  </div>
                )}
              </div>

              {/* Delivery Notes */}
              {order.customerNotes && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Courier Notes:
                  </span>
                  <p className="text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    "{order.customerNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Medical Guarantee Seal */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white border border-teal-500/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
                <ShieldCheckIcon className="w-4 h-4 text-teal-400" />
                <span>Egyptian Dental Guarantee</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>14-Day Free Replacement for OSCE / Clinical Defects</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>5-Year Anti-Corrosion Passivation Guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>134°C Class B Hospital Autoclave Compatibility</span>
                </li>
              </ul>
            </div>

            {/* Campus Section Coordinator Support */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Need urgent batch coordination before your clinical session?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Contact Campus Section Coordinator</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Continue Shopping CTA */}
        <div className="text-center pt-4">
          <Button
            onClick={() => navigate('/products')}
            variant="primary"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25"
          >
            <ShoppingBagIcon className="w-4 h-4 stroke-2" />
            <span>Continue Exploring Dental Equipment</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper check icon
const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default OrderConfirmationPage; 