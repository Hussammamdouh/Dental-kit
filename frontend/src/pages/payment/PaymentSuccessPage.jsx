import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  HomeIcon,
  ReceiptRefundIcon,
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import api, { endpoints } from '../../services/api';
import { toast } from 'react-hot-toast';

const PaymentSuccessPage = () => {
  const { t } = useTranslation('ecommerce');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  
  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch order data
  const fetchOrder = async () => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(endpoints.orders.get(orderId));
      const data = response?.data ?? response;
      setOrder(data.order ?? data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
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
      setError('Order ID is missing');
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <CheckCircleIconSolid className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto px-4">
              Your payment has been processed successfully. Thank you for your purchase!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-white/20 dark:border-gray-700/20">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-fadeIn">
              <CheckCircleIconSolid className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Confirmed
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Your payment has been successfully processed. {orderId && `Order #${orderId} has been confirmed.`}
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 max-w-md mx-auto border border-green-200/50 dark:border-green-700/30">
              <div className="flex items-center justify-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                  A confirmation email has been sent to your registered email address
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          {order && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl flex items-center justify-center mr-4">
                  <ReceiptRefundIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                {order.discount > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      Discount
                    </span>
                    <span className="text-green-600 font-bold">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t-2 border-green-200 dark:border-green-700 pt-4">
                  <span className="text-gray-900 dark:text-white">
                    Total Paid
                  </span>
                  <span className="text-green-600 dark:text-green-400">
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
                What's Next?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can track your order or continue shopping
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {orderId && (
                <Button
                  onClick={() => navigate(`/orders/${orderId}`)}
                  variant="primary"
                  className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 hover:from-green-600 hover:via-emerald-700 hover:to-teal-800"
                >
                  <ReceiptRefundIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  View Order
                </Button>
              )}
              
              <Button
                onClick={() => navigate('/orders')}
                variant="secondary"
                className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700"
              >
                <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                My Orders
              </Button>
              
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Continue Shopping
              </Button>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-700/30 animate-fadeIn">
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                  Your payment is secure and protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;







