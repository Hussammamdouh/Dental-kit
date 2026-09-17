import React, { useEffect, useState, useMemo } from 'react';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate, Link } from 'react-router-dom';
import {
  DocumentArrowDownIcon,
  ArrowTopRightOnSquareIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  TruckIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import api, { endpoints } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import { PDFGenerator } from '../utils/pdfGenerator';
import { toast } from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';

const OrdersPage = () => {
  const { t } = useTranslation('ecommerce');
  const { currentLanguage } = useLanguage();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingInvoices, setDownloadingInvoices] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'delivered' | 'cancelled'
  const [reorderingId, setReorderingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(endpoints.orders.list);
      const data = res?.data?.orders || res?.orders || res?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Fetch orders error:', e);
      setError(t('orders.error.fetchingOrders', 'Failed to retrieve your order history'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Download PDF invoice
  const downloadInvoice = async (order) => {
    const orderId = order.id || order._id || order.orderNumber;
    try {
      setDownloadingInvoices(prev => ({ ...prev, [orderId]: true }));
      
      if (order.shakeoutInvoiceUrl) {
        window.open(order.shakeoutInvoiceUrl, '_blank');
        toast.success('Opening invoice in new tab');
        return;
      }

      const pdfGenerator = new PDFGenerator();
      const pdfDoc = pdfGenerator.generateInvoice(order);
      pdfDoc.save(`DentalKit-Invoice-${order.orderNumber || orderId}.pdf`);
      
      toast.success('Official clinical invoice downloaded!');
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error('Failed to generate PDF invoice');
    } finally {
      setDownloadingInvoices(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Re-order all items from a past order
  const handleReorder = async (order) => {
    const orderId = order.id || order._id;
    try {
      setReorderingId(orderId);
      if (!order.items || order.items.length === 0) {
        toast.error('No items found in this order');
        return;
      }

      for (const item of order.items) {
        if (item.productId || item.id) {
          await addToCart(item, item.quantity || 1);
        }
      }
      toast.success('Items added to your clinical tray!');
      navigate('/cart');
    } catch (err) {
      console.error('Re-order error:', err);
      toast.error('Failed to re-order items');
    } finally {
      setReorderingId(null);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Status styling map
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return {
          label: 'Delivered / Locker Released',
          className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500'
        };
      case 'shipped':
      case 'in_transit':
      case 'dispatched':
        return {
          label: 'In Campus Locker Transit',
          className: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-500 animate-pulse'
        };
      case 'processing':
      case 'confirmed':
      case 'pending':
        return {
          label: 'Autoclave QC & Packaging',
          className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500 animate-pulse'
        };
      case 'cancelled':
      case 'refunded':
        return {
          label: 'Cancelled',
          className: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500'
        };
      default:
        return {
          label: status || 'Confirmed',
          className: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
          dot: 'bg-teal-500'
        };
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderNum = (order.orderNumber || order.id || order._id || '').toLowerCase();
      const itemsMatch = (order.items || []).some(item => 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesSearch = orderNum.includes(searchQuery.toLowerCase()) || itemsMatch;

      if (!matchesSearch) return false;

      const status = (order.status || '').toLowerCase();
      if (statusFilter === 'active') {
        return ['pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'dispatched'].includes(status);
      }
      if (statusFilter === 'delivered') {
        return ['delivered', 'completed'].includes(status);
      }
      if (statusFilter === 'cancelled') {
        return ['cancelled', 'refunded'].includes(status);
      }
      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  // Metric stats
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const activeCount = useMemo(() => {
    return orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped', 'in_transit'].includes((o.status || '').toLowerCase())).length;
  }, [orders]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <Seo
        title={t('seo.orders.title', 'Clinical Order History | DentalKit Egypt')}
        description={t('seo.orders.description', 'Track and manage your dental equipment orders, faculty smart locker deliveries, and tax invoices')}
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor={currentTheme === 'dark' ? '#0B1220' : '#FFFFFF'}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-12 sm:py-16 border-b border-teal-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-500/15 border border-teal-500/30 text-teal-300 backdrop-blur-md mb-4">
              <BuildingLibraryIcon className="w-4 h-4 text-teal-400" />
              <span>Egyptian Dental Faculties Dispatch Hub</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              {t('orders.title', 'Clinical Orders & Locker Dispatches')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Track faculty smart locker deliveries, download official Egyptian tax invoices, and inspect instrument sterilization guarantees.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Total Orders</span>
                <span className="text-lg sm:text-xl font-black text-white">{orders.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Active Dispatches</span>
                <span className="text-lg sm:text-xl font-black text-teal-300">{activeCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Delivered Trays</span>
                <span className="text-lg sm:text-xl font-black text-emerald-300">
                  {orders.filter(o => ['delivered', 'completed'].includes((o.status || '').toLowerCase())).length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <span className="text-[11px] text-slate-400 block font-medium">Total Equipment</span>
                <span className="text-lg sm:text-xl font-black text-cyan-300">{formatPrice(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order # or Instrument..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-xs"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
            <LoadingSpinner size="lg" className="text-teal-500" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
              Loading Clinical Dispatch Records...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="primary" className="text-xs">
              <ArrowPathIcon className="w-4 h-4 mr-1.5 inline" />
              {t('orders.error.retry', 'Retry')}
            </Button>
          </div>
        )}

        {/* Empty Orders State */}
        {!loading && !error && orders.length === 0 && (
          <div className="max-w-lg mx-auto text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 sm:p-10">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Clinical Orders Registered
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              You haven't placed any dental instrument or semester package orders yet. Explore our verified syllabus kits to get started.
            </p>
            <Button onClick={() => navigate('/products')} variant="primary" className="text-xs font-bold px-6 py-3">
              Explore Dental Catalog
            </Button>
          </div>
        )}

        {/* No Search Filter Results */}
        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No orders matched your search query or filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Orders Cards Grid */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredOrders.map((order) => {
              const orderId = order.id || order._id || order.orderNumber;
              const orderNum = order.orderNumber || orderId;
              const statusBadge = getStatusBadge(order.status);
              const isDownloading = downloadingInvoices[orderId];
              const isReordering = reorderingId === (order.id || order._id);
              const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div 
                  key={orderId}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Order Reference
                        </span>
                        <Link 
                          to={`/orders/${orderId}`}
                          className="font-mono text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                        >
                          #{orderNum}
                        </Link>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.className}`}>
                        <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{orderDate}</span>
                      </div>
                      {order.shippingAddress?.company && (
                        <div className="flex items-center gap-1">
                          <BuildingLibraryIcon className="w-3.5 h-3.5 text-teal-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                            {order.shippingAddress.company}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items List Preview */}
                  <div className="p-5 sm:p-6 space-y-3 flex-1">
                    {(order.items || []).slice(0, 3).map((item, idx) => {
                      const itemImg = item.image?.url || item.image || '/placeholder-product.svg';
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg p-1 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                            <img
                              src={getImageUrl(itemImg)}
                              alt={item.name || 'Product'}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {item.name || 'Dental Equipment'}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              <span>Qty: <strong className="text-slate-700 dark:text-slate-300">{item.quantity || 1}</strong></span>
                              <span>•</span>
                              <span className="text-teal-600 dark:text-teal-400 font-semibold">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </div>
                        </div>
                      );
                    })}

                    {order.items?.length > 3 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1 font-medium">
                        +{order.items.length - 3} more clinical items
                      </p>
                    )}
                  </div>

                  {/* Total & Meta Footer */}
                  <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Settled</span>
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadInvoice(order)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <LoadingSpinner size="xs" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <DocumentArrowDownIcon className="w-4 h-4" />
                          <span>Tax Invoice (PDF)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      disabled={isReordering}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {isReordering ? <LoadingSpinner size="xs" /> : <ArrowPathIcon className="w-3.5 h-3.5" />}
                      <span>Re-Order Tray</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${orderId}`)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <span>Track & Details</span>
                      <ChevronRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 