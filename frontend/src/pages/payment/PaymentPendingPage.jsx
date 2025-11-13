import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  HomeIcon,
  ReceiptRefundIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import api, { endpoints } from '../../services/api';
import { toast } from 'react-hot-toast';

const PaymentPendingPage = () => {
  const { t } = useTranslation('ecommerce');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  
  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  
  // Fetch order data
  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(endpoints.orders.get(orderId));
      const data = response?.data ?? response;
      setOrder(data.order ?? data);
      
      // Check payment status if Shakeout invoice exists
      if (data.order?.shakeoutInvoiceId || data?.shakeoutInvoiceId) {
        checkPaymentStatus();
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      setCheckingStatus(true);
      const response = await api.get(endpoints.payments.status(orderId));
      const data = response?.data ?? response;
      
      if (data.success) {
        setPaymentStatus(data.invoiceStatus || data.paymentStatus || 'pending');
        
        // If payment is successful, redirect to success page
        if (data.invoiceStatus === 'paid' || data.paymentStatus === 'paid') {
          setTimeout(() => {
            navigate(`/payment/success?orderId=${orderId}`);
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Failed to check payment status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(price);
  };

  // Load order on component mount
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  // Auto-refresh payment status every 5 seconds
  useEffect(() => {
    if (orderId && paymentStatus === 'pending') {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [orderId, paymentStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-150"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <ClockIconSolid className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Payment Pending
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto px-4">
              Your payment is being processed. Please wait while we confirm your transaction.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Pending Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-white/20 dark:border-gray-700/20">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-800/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
              <ClockIconSolid className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Processing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              {orderId && `Order #${orderId} is waiting for payment confirmation.`}
              <br />
              This usually takes a few moments. Please do not close this page.
            </p>
            
            {/* Status Indicator */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 max-w-md mx-auto border border-yellow-200/50 dark:border-yellow-700/30">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {checkingStatus ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 animate-spin" />
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                      Checking payment status...
                    </p>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                      Payment Status: {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </p>
                  </>
                )}
              </div>
              
              {paymentStatus === 'paid' && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      Payment confirmed! Redirecting...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Details Card */}
          {order && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-800/30 rounded-xl flex items-center justify-center mr-4">
                  <ReceiptRefundIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Subtotal
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatPrice(order.subtotal || 0)}
                  </span>
                </div>
                {order.shipping > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      Shipping
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatPrice(order.shipping)}
                    </span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      Tax
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t-2 border-yellow-200 dark:border-yellow-700 pt-4">
                  <span className="text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What's Happening?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're verifying your payment. This page will automatically update when the status changes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <Button
                onClick={checkPaymentStatus}
                disabled={checkingStatus}
                variant="primary"
                className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-700 hover:from-yellow-600 hover:via-amber-700 hover:to-orange-800"
              >
                {checkingStatus ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Refresh Status
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => navigate('/orders')}
                variant="secondary"
                className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700"
              >
                <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                View Orders
              </Button>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/30 animate-fadeIn">
              <div className="flex items-start justify-center space-x-2">
                <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-left">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
                    Important Information:
                  </p>
                  <ul className="text-yellow-700 dark:text-yellow-300 text-xs space-y-1">
                    <li>• Payment status is checked automatically every 5 seconds</li>
                    <li>• If payment is confirmed, you'll be redirected automatically</li>
                    <li>• Please keep this page open until payment is confirmed</li>
                    <li>• If payment takes longer than expected, check your orders page</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;




