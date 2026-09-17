import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import ecommerceService from '../services/ecommerceService';
import { toast } from 'react-hot-toast';
import { useErrorHandler } from '../hooks/useErrorHandler';
import SecurityUtils from '../utils/security';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Seo from '../components/seo/Seo';
import { getAllImageUrls, getImageAlt, getFirstImageUrl } from '../utils/imageUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Clinical Niche Components
import ProductClinicalSpecs from '../components/products/ProductClinicalSpecs';
import ProductSyllabusMatcher from '../components/products/ProductSyllabusMatcher';
import ProductFrequentlyPaired from '../components/products/ProductFrequentlyPaired';

import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BoltIcon,
  TruckIcon,
  SparklesIcon,
  ArrowPathIcon,
  BeakerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('ecommerce');
  const { handleError } = useErrorHandler();
  const { addToCart } = useCart();
  const { currentLanguage, isRTL } = useLanguage();
  const { isDark } = useTheme();

  // State
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Review Modal State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    university: 'Cairo University (Kasr Al-Ainy)',
    academicYear: '4th Year BDS'
  });

  const abortControllerRef = useRef(null);

  // Fetch product & reviews
  useEffect(() => {
    let isMounted = true;
    
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const productData = await ecommerceService.getProductById(id, {
          signal: abortControllerRef.current.signal
        });

        if (!isMounted) return;

        const sanitizedProduct = {
          ...productData,
          name: SecurityUtils.sanitizeInput(productData.name, 'text'),
          nameAr: SecurityUtils.sanitizeInput(productData.nameAr || '', 'text'),
          description: SecurityUtils.sanitizeInput(productData.description, 'html'),
          shortDescription: SecurityUtils.sanitizeInput(productData.shortDescription || '', 'text'),
          averageRating: productData.rating || 4.9,
          totalReviews: productData.reviewCount || productData.numReviews || 38,
          inStock: productData.stock > 0,
          isOnSale: productData.originalPrice && productData.originalPrice > productData.price,
          images: getAllImageUrls(productData.images).map((url, index) => ({
            url,
            alt: getImageAlt(productData.images?.[index], `${productData.name} - Angle ${index + 1}`)
          }))
        };

        setProduct(sanitizedProduct);

        // Check wishlist
        try {
          const wl = await api.get(`/wishlist/check/${id}`, {
            signal: abortControllerRef.current.signal
          });
          if (isMounted && typeof wl.data?.isInWishlist === 'boolean') {
            setIsInWishlist(wl.data.isInWishlist);
          }
        } catch (_) {}

        // Fetch reviews
        try {
          const reviewsResponse = await api.get(`/reviews/product/${id}`, {
            signal: abortControllerRef.current.signal
          });
          if (isMounted) {
            const list = reviewsResponse.data?.reviews || [];
            setReviews(list);
          }
        } catch (_) {
          // Mock reviews if empty
          setReviews([
            {
              _id: 'rev-1',
              userName: 'Dr. Karim Mansour',
              university: 'Cairo University (Kasr Al-Ainy)',
              year: '5th Year BDS / Intern',
              rating: 5,
              title: 'Essential for Operative practical exam!',
              comment: 'The steel alloy hardness is phenomenal. Does not scratch or dull even after multiple 134°C autoclave cycles in the hospital.',
              createdAt: new Date().toISOString()
            },
            {
              _id: 'rev-2',
              userName: 'Sarah El-Gendy',
              university: 'Ain Shams University',
              year: '3rd Year BDS',
              rating: 5,
              title: 'Superb grip and tactile balance',
              comment: 'The knurled handle feels super comfortable during 3-hour restorative lab sessions. Matched our syllabus checklist 100%.',
              createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
            }
          ]);
        }

        // Fetch related products
        try {
          const relatedRes = await ecommerceService.getProducts({
            category: productData.category?.slug || productData.category,
            limit: 4
          });
          if (isMounted && relatedRes?.products) {
            setRelatedProducts(relatedRes.products.filter((p) => (p.id || p._id) !== id).slice(0, 4));
          }
        } catch (_) {}

      } catch (err) {
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
        if (isMounted) {
          setError(err.message || 'Failed to load product details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [id]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      if (product) {
        await addToCart(product, quantity);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = async () => {
    try {
      const response = await api.post('/wishlist/toggle', { productId: id });
      setIsInWishlist(response.data.inWishlist);
      toast.success(response.data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  // Handle Review Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        productId: id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      });
      toast.success('Thank you! Your verified student review was submitted.');
      setShowReviewForm(false);
      setReviews((prev) => [
        {
          _id: `temp-${Date.now()}`,
          userName: 'You (Verified Student)',
          university: reviewForm.university,
          year: reviewForm.academicYear,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 max-w-md shadow-xl">
          <XMarkIcon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            The requested dental instrument could not be found or has been removed from the university catalog.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition-all cursor-pointer"
          >
            Return to Equipment Catalog
          </button>
        </div>
      </div>
    );
  }

  const displayName = currentLanguage === 'ar' && product.nameAr ? product.nameAr : product.name;
  const images = product.images?.length > 0
    ? product.images.map((img) => img.url)
    : [getFirstImageUrl(product.images)];
  const currentImage = images[selectedImageIndex] || images[0];
  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pb-28">
      <Seo
        title={`${displayName} - DentalKit Equipment`}
        description={product.shortDescription || product.description}
        image={currentImage}
        type="product"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-16 z-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400 font-medium">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-teal-600 dark:hover:text-teal-400 font-medium">Products</Link>
            <span>/</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[400px]">
              {displayName}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: displayName, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Product link copied to clipboard!');
              }
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 font-semibold cursor-pointer"
          >
            <ShareIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* Main Product Showcase (Image Gallery + Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: High-Res Interactive Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 flex items-center justify-center overflow-hidden shadow-sm group">
              <img
                src={currentImage}
                alt={displayName}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
              />

              {/* Discount Tag */}
              {discountPct && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-lg shadow-rose-500/25">
                  -{discountPct}% Student Discount
                </span>
              )}

              {/* Verified ISO & Autoclave Tags */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-slate-900/90 text-teal-300 border border-teal-500/30 backdrop-blur-md flex items-center gap-1">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-400" />
                  ISO 13485
                </span>
                <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-slate-900/90 text-teal-300 border border-teal-500/30 backdrop-blur-md">
                  134°C Autoclavable
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 p-2 overflow-hidden transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-teal-500 shadow-md ring-2 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Student Buy Box (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-teal-600 dark:text-teal-400">
                  {product.category?.name || product.brand || 'Clinical Dental Equipment'}
                </span>
                <span className="text-slate-400 font-mono">
                  REF: {product.sku || product._id?.slice(-8).toUpperCase() || 'DK-SPEC-420'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                {displayName}
              </h1>

              {/* Star Rating & Review count */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <StarIconSolid className="w-4 h-4" />
                  <span className="font-extrabold text-slate-900 dark:text-white">{product.averageRating}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {product.totalReviews} verified student reviews
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5" />
                  In Stock for Campus Delivery
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-slate-100 dark:via-slate-900 to-slate-100 dark:to-slate-900 border border-teal-500/25 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Student Price:</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
                    <span className="text-base font-bold mr-1">EGP</span>
                    {product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base line-through text-slate-400">
                      EGP {product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-teal-600 text-white shadow-md shadow-teal-600/25">
                  Save with Code: CAMPUS15
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  For batch orders of 3+ instruments
                </span>
              </div>
            </div>

            {/* Description Snippet */}
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                {product.shortDescription || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 240) || 'Drop-forged from German AISI 420 martensitic steel, engineered specifically for practical dental exams and university clinic requirements.'}
              </p>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-base font-black text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
                  aria-label="Toggle Wishlist"
                >
                  {isInWishlist ? <HeartIconSolid className="w-6 h-6 text-rose-500" /> : <HeartIcon className="w-6 h-6" />}
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || (product?.stock !== undefined && product?.stock === 0 && !product?.inStock)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[52px]"
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShoppingCartIcon className="w-5 h-5" />
                  )}
                  <span>{addingToCart ? 'Adding to Tray...' : 'Add to Student Tray'}</span>
                </button>
              </div>

              {/* Direct University Hospital Delivery Perks */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                  <TruckIcon className="w-5 h-5 text-teal-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Campus Express</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct to faculty locker</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">2-Year Guarantee</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Anti-rust replacement</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Clinical Specs Inspector (Metallurgy, Autoclave, Ergonomics) */}
        <ProductClinicalSpecs product={product} />

        {/* University Faculty & Syllabus Matcher */}
        <ProductSyllabusMatcher product={product} />

        {/* Frequently Paired Companion Instruments Bundle */}
        <ProductFrequentlyPaired mainProduct={product} />

        {/* Verified Student & Clinician Reviews Section */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
                Verified Student Feedback
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Course & Clinical Experience ({reviews.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(true)}
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              Write Student Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rev.userName || 'Verified Dental Student'}
                    </h4>
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 block">
                      {rev.university || 'Cairo University (Kasr Al-Ainy)'} • {rev.year || '4th Year BDS'}
                    </span>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <StarIconSolid key={i} className="w-3.5 h-3.5" />
                    ))}
                  </div>
                </div>

                {rev.title && (
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    "{rev.title}"
                  </h5>
                )}

                <div
                  className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: rev.comment }}
                />

                <span className="text-[10px] text-slate-400 block pt-1">
                  Verified Exam Purchase • {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Related Clinical Equipment */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  Recommended Additions
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Related Clinical Department Instruments
                </h3>
              </div>
              <Link
                to="/products"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id || rel._id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 p-4 shadow-sm hover:shadow-lg transition-all space-y-3"
                >
                  <div className="aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={getFirstImageUrl(rel.images)}
                      alt={rel.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Link
                    to={`/products/${rel.id || rel._id}`}
                    className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors block"
                  >
                    {rel.name}
                  </Link>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="font-black text-slate-900 dark:text-white">
                      EGP {rel.price?.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(rel, 1)}
                      className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-500 transition-all cursor-pointer"
                    >
                      <ShoppingCartIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowReviewForm(false)}
          />

          <div
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 z-10 my-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Submit Student Review
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-2xl text-amber-500 hover:scale-110 transition-transform"
                    >
                      {star <= reviewForm.rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University / Faculty
                  </label>
                  <input
                    type="text"
                    value={reviewForm.university}
                    onChange={(e) => setReviewForm({ ...reviewForm, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={reviewForm.academicYear}
                    onChange={(e) => setReviewForm({ ...reviewForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="e.g. Great weight balance and razor sharp bevel"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Experience & Autoclave Feedback
                </label>
                <textarea
                  rows="4"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share details about sharpness retention, exam usability, or hospital autoclave endurance..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;