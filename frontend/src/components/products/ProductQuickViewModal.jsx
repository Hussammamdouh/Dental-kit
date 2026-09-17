import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getFirstImageUrl } from '../../utils/imageUtils';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  BeakerIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const ProductQuickViewModal = ({ product, isOpen, onClose, inWishlist, onToggleWishlist }) => {
  const { addToCart } = useCart();
  const { isRTL } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'syllabus' | 'autoclave'

  // Reset image and quantity on modal open
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setActiveTab('specs');
    }
  }, [isOpen, product]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url || img.src))
    : [getFirstImageUrl(product.images)];

  const currentImage = images[selectedImageIndex] || images[0];

  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(product, quantity);
      toast.success(`Added ${quantity}x ${product.name} to cart!`);
      onClose();
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  // Metallurgical specs default
  const metallurgy = product.metallurgy || {
    alloy: product.specs?.alloy || 'AISI 420 Surgical Martensitic Steel',
    hardness: product.specs?.hardness || '54 - 58 HRC Rockwell Scale',
    coating: product.specs?.coating || 'Passivated Anti-Corrosion Oxide Layer',
    autoclave: '134°C (273°F) Class B Hospital Autoclave Safe',
    ergonomics: 'Hollow Lightweight 9.5mm Knurled Grip',
    syllabusFit: 'Year 2 - 4 BDS Practical Exam Standard',
    warranty: '2 Years Anti-Rust Guarantee'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 my-8 transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              CAD & Clinical Quick Inspect
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
              REF: {product.sku || product._id?.slice(-8).toUpperCase() || 'DK-SPEC-420'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close Quick View"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          
          {/* Left: Image Viewer (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="relative aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 p-6 flex items-center justify-center overflow-hidden group">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
              />

              {/* Discount Tag */}
              {discountPct && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white shadow-md">
                  -{discountPct}% Student Discount
                </span>
              )}

              {/* Verified Badge */}
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 text-teal-300 border border-teal-500/30 backdrop-blur-sm flex items-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-400" />
                ISO 13485 Certified
              </span>
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Specs & Cart Actions (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {product.category?.name || product.brand || 'Clinical Dental Instrument'}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <StarIconSolid className="w-4 h-4" />
                  <span>{product.rating || '4.9'}</span>
                  <span className="text-slate-400 font-normal">({product.numReviews || 48} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 p-3 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 mb-4">
                <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                  <span className="text-sm font-bold mr-1">EGP</span>
                  {product.price?.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm line-through text-slate-400">
                    EGP {product.originalPrice?.toLocaleString()}
                  </span>
                )}
                <span className="ml-auto text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  In Stock for Campus Delivery
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`text-xs font-bold pb-1 px-1 transition-colors border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Metallurgy & Alloy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('syllabus')}
                  className={`text-xs font-bold pb-1 px-1 transition-colors border-b-2 ${
                    activeTab === 'syllabus'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Faculty Syllabus Fit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('autoclave')}
                  className={`text-xs font-bold pb-1 px-1 transition-colors border-b-2 ${
                    activeTab === 'autoclave'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Sterilization Guide
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Alloy Grade</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{metallurgy.alloy}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hardness Standard</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{metallurgy.hardness}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tactile Ergonomics</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{metallurgy.ergonomics}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Anti-Rust Warranty</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{metallurgy.warranty}</span>
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold">
                    <AcademicCapIcon className="w-4 h-4" />
                    <span>Approved for BDS Practical Exams</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Compliant with course requirements for Kasr Al-Ainy, Ain Shams, Mansoura, Alexandria, and private dental faculties across Egypt.
                  </p>
                </div>
              )}

              {activeTab === 'autoclave' && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                    <BeakerIcon className="w-4 h-4" />
                    <span>Autoclave Compatibility: 134°C / 2.2 bar</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Resistant to ultrasonic cleaning solutions, enzymatic baths, and repeated high-pressure vacuum sterilization cycles without edge dulling.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity, Add to Cart & Full Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 font-bold transition-all"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 font-bold transition-all"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id || product._id)}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 transition-all"
                  aria-label="Toggle Wishlist"
                >
                  {inWishlist ? <HeartIconSolid className="w-5 h-5 text-rose-500" /> : <HeartIcon className="w-5 h-5" />}
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 py-3 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>{isAdding ? 'Adding to Cart...' : 'Add to Student Tray'}</span>
                </button>
              </div>

              {/* Link to Full Product Page */}
              <div className="text-center">
                <Link
                  to={`/products/${product.id || product._id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <span>View Full Clinical Specifications & Course Reviews</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductQuickViewModal;
