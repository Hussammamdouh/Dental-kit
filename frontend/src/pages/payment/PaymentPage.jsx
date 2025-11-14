import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ReceiptRefundIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CreditCardIcon as CreditCardIconSolid } from '@heroicons/react/24/solid';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import api, { endpoints } from '../../services/api';
import { toast } from 'react-hot-toast';
import Seo from '../../components/seo/Seo';

const PaymentPage = () => {
  const { t } = useTranslation('ecommerce');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  
  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  
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
      const orderData = data.order ?? data;
      setOrder(orderData);
      
      // Check if order already has an invoice URL
      if (orderData.shakeoutInvoiceUrl) {
        setInvoiceUrl(orderData.shakeoutInvoiceUrl);
        setInvoiceId(orderData.shakeoutInvoiceId);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  // Create payment invoice
  const createPaymentInvoice = async () => {
    if (!orderId) {
      toast.error('Order ID is missing');
      return;
    }

    try {
      setCreatingInvoice(true);
      const response = await api.post(endpoints.payments.createInvoice, { orderId });
      const data = response?.data ?? response;
      
      if (data.success && data.invoiceUrl) {
        setInvoiceUrl(data.invoiceUrl);
        setInvoiceId(data.invoiceId);
        toast.success('Payment invoice created successfully');
      } else {
        throw new Error(data.message || 'Failed to create payment invoice');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create payment invoice';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setCreatingInvoice(false);
    }
  };

  // Handle payment redirect
  const handlePayNow = () => {
    if (invoiceUrl) {
      // Redirect to Shakeout payment gateway
      window.location.href = invoiceUrl;
    } else {
      toast.error('Payment link is not available. Please try creating the invoice again.');
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

  // Auto-create invoice if order doesn't have one
  useEffect(() => {
    if (order && !invoiceUrl && !creatingInvoice && !loading) {
      // Check if order payment method is shakeout
      if (order.paymentMethod === 'shakeout' || order.paymentMethod === 'credit_card') {
        createPaymentInvoice();
      }
    }
  }, [order, invoiceUrl, creatingInvoice, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Error Loading Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <Button onClick={() => navigate('/orders')} variant="primary">
                Go to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Seo
        title="Complete Payment"
        description="Complete your payment securely using credit or debit card"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <CreditCardIconSolid className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Complete Your Payment
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto px-4">
              Secure payment processing via our trusted payment gateway
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Security Notice */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/30">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Secure Payment Processing
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your payment is processed securely through our payment gateway. We never store your credit card information.
                  All transactions are encrypted and protected by industry-standard security measures.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          {order && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 rounded-xl flex items-center justify-center mr-4">
                  <ReceiptRefundIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Order Summary
                </h3>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Quantity: {item.quantity || 1} × {formatPrice(item.price || 0)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                <div className="flex justify-between text-2xl font-bold border-t-2 border-blue-200 dark:border-blue-700 pt-4">
                  <span className="text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Action Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockClosedIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Pay
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click the button below to proceed to our secure payment gateway
              </p>
            </div>

            {/* Invoice Status */}
            {creatingInvoice && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Creating payment invoice...
                  </p>
                </div>
              </div>
            )}

            {error && !creatingInvoice && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                <div className="flex items-center justify-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                    {error}
                  </p>
                </div>
                <Button
                  onClick={createPaymentInvoice}
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                >
                  Retry Creating Invoice
                </Button>
              </div>
            )}

            {/* Pay Now Button */}
            <div className="space-y-4">
              {invoiceUrl ? (
                <Button
                  onClick={handlePayNow}
                  variant="primary"
                  className="w-full flex items-center justify-center p-6 text-lg font-semibold bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-800"
                >
                  <CreditCardIcon className="w-6 h-6 mr-3" />
                  Pay Now - {formatPrice(order?.total || 0)}
                  <ArrowRightIcon className="w-5 h-5 ml-3" />
                </Button>
              ) : (
                <Button
                  onClick={createPaymentInvoice}
                  variant="primary"
                  disabled={creatingInvoice}
                  className="w-full flex items-center justify-center p-6 text-lg font-semibold bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-800"
                >
                  {creatingInvoice ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-3" />
                      Creating Payment Link...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-6 h-6 mr-3" />
                      Create Payment Link
                    </>
                  )}
                </Button>
              )}

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-medium mb-1">Accepted Payment Methods:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Visa, Mastercard, American Express</li>
                      <li>Debit Cards</li>
                      <li>Secure 3D Secure authentication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                If you encounter any issues during payment, please contact our support team
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/orders')}
                variant="outline"
                className="w-full"
              >
                View My Orders
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;





