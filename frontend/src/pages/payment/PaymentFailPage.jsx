import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { XCircleIcon as XCircleIconSolid } from '@heroicons/react/24/solid';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import api, { endpoints } from '../../services/api';
import { toast } from 'react-hot-toast';

const PaymentFailPage = () => {
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
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(endpoints.orders.get(orderId));
      const data = response?.data ?? response;
      setOrder(data.order ?? data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
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
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <XCircleIconSolid className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Payment Failed
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto px-4">
              Unfortunately, your payment could not be processed. Please try again or use a different payment method.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Error Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-white/20 dark:border-gray-700/20">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-800/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-fadeIn">
              <XCircleIconSolid className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Not Completed
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Your payment could not be processed. {orderId && `Order #${orderId} was not completed.`}
            </p>
            
            {/* Common Reasons */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl p-6 max-w-2xl mx-auto border border-red-200/50 dark:border-red-700/30 text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                Common Reasons:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  Insufficient funds in your account
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  Card expired or invalid card details
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  Network connectivity issues
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  Payment gateway timeout
                </li>
              </ul>
            </div>
          </div>

          {/* Order Details Card */}
          {order && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-800/30 rounded-xl flex items-center justify-center mr-4">
                  <ShoppingBagIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                <div className="flex justify-between text-xl font-bold border-t-2 border-red-200 dark:border-red-700 pt-4">
                  <span className="text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-red-600 dark:text-red-400">
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
                What Would You Like To Do?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can retry the payment or contact support for assistance
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {orderId && (
                <Button
                  onClick={() => navigate(`/checkout?orderId=${orderId}`)}
                  variant="primary"
                  className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold bg-gradient-to-r from-red-500 via-rose-600 to-pink-700 hover:from-red-600 hover:via-rose-700 hover:to-pink-800"
                >
                  <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Retry Payment
                </Button>
              )}
              
              <Button
                onClick={() => navigate('/contact')}
                variant="secondary"
                className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700"
              >
                <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Contact Support
              </Button>
              
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="flex items-center justify-center p-4 sm:p-6 h-auto text-base sm:text-lg font-semibold border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Continue Shopping
              </Button>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl border border-red-200/50 dark:border-red-700/30 animate-fadeIn">
              <div className="flex items-center justify-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  Your order has been saved. You can complete the payment later from your orders page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;




