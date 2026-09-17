import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import ecommerceService from '../services/ecommerceService';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { getFirstImageUrl } from '../utils/imageUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Clinical Niche Components
import ProductQuickViewModal from '../components/products/ProductQuickViewModal';
import ProductCompareTray from '../components/products/ProductCompareTray';
import FacultyCourseTabs from '../components/products/FacultyCourseTabs';
import SemesterBatchBanner from '../components/products/SemesterBatchBanner';

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ShoppingCartIcon,
  XMarkIcon,
  Squares2X2Icon,
  Bars3BottomLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  TagIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  EyeIcon,
  ScaleIcon,
  BeakerIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const ProductsPage = () => {
  const { t } = useTranslation('ecommerce');
  const { addToCart } = useCart();
  const { currentLanguage, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Catalog State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedAcademicStage, setSelectedAcademicStage] = useState(searchParams.get('stage') || 'all');
  const [selectedMetallurgy, setSelectedMetallurgy] = useState('all');
  const [selectedCert, setSelectedCert] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Clinical Interactive Features State
  const [wishlistSet, setWishlistSet] = useState(new Set());
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [compareItems, setCompareItems] = useState([]);

  // Popular search recommendations
  const popularTags = [
    'Typodont',
    'Rubber Dam Kit',
    'K-Files 25mm',
    'Restorative Set',
    'Extraction Forceps #150',
    'Wax Carver PK Thomas',
    'Cryer Elevators'
  ];

  // Metallurgy Options
  const metallurgyOptions = [
    { id: 'all', label: 'All Metallurgy Alloys' },
    { id: 'aisi420', label: 'German AISI 420 Surgical Steel (HRC 54-58)' },
    { id: 'tinGold', label: 'TiN Nano-Gold Non-Stick Coating' },
    { id: 'tungsten', label: 'Tungsten Carbide Reinforced Inserts' },
    { id: 'diamond', label: 'Electroplated Diamond Grit' }
  ];

  // Certification Standards
  const certOptions = [
    { id: 'all', label: 'All Certifications' },
    { id: 'autoclave134', label: '134°C Class B Autoclavable' },
    { id: 'iso13485', label: 'ISO 13485 Medical Device Certified' },
    { id: 'ce', label: 'CE Surgical Standard' }
  ];

  // Fetch Wishlist on Mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await api.get('/wishlist');
        const items = response.data?.items || response.data?.wishlist?.items || [];
        setWishlistSet(new Set(items.map((it) => it.productId || it._id)));
      } catch (_) {
        // Silently ignore
      }
    };
    loadWishlist();
  }, []);

  // Sync state when URL searchParams change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setSelectedCategory(urlCategory);

    const urlSearch = searchParams.get('search') || searchParams.get('q');
    if (urlSearch) setSearchTerm(urlSearch);

    const urlSort = searchParams.get('sort');
    if (urlSort) setSortBy(urlSort);

    const urlStage = searchParams.get('stage');
    if (urlStage) setSelectedAcademicStage(urlStage);
  }, [searchParams]);

  // Fetch Categories & Brands on Mount
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          ecommerceService.getCategories().catch(() => ({ categories: [] })),
          ecommerceService.getBrands().catch(() => ({ brands: [] }))
        ]);
        setCategories(catRes.categories || []);
        setBrands(brandRes.brands || []);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    loadMeta();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        inStock: availability === 'inStock' ? true : undefined,
        sortBy: sortBy === 'discount' ? 'discount' : sortBy !== 'popularity' ? sortBy.split('-')[0] : undefined,
        sortOrder: sortBy !== 'popularity' && sortBy !== 'discount' ? sortBy.split('-')[1] : undefined
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      );

      const result = await ecommerceService.getProducts(cleanParams);

      if (result && result.products) {
        let list = result.products;

        // Apply local academic stage filter if selected
        if (selectedAcademicStage !== 'all') {
          list = list.filter((p) => {
            const name = (p.name || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            const cat = (p.category?.name || p.category?.slug || '').toLowerCase();
            if (selectedAcademicStage === 'pre-clinical') {
              return name.includes('typodont') || name.includes('wax') || name.includes('carver') || name.includes('model') || cat.includes('pre-clinical') || desc.includes('pre-clinical');
            }
            if (selectedAcademicStage === 'operative') {
              return name.includes('dam') || name.includes('endo') || name.includes('file') || name.includes('composite') || name.includes('matrix') || cat.includes('restorative');
            }
            if (selectedAcademicStage === 'surgery') {
              return name.includes('forceps') || name.includes('elevator') || name.includes('perio') || name.includes('scaler') || name.includes('suture') || cat.includes('surgery');
            }
            if (selectedAcademicStage === 'bundles') {
              return name.includes('kit') || name.includes('set') || name.includes('bundle') || name.includes('box');
            }
            return true;
          });
        }

        setProducts(list);
        setTotalProducts(result.total || result.totalProducts || list.length);
        setTotalPages(result.totalPages || Math.ceil((result.total || list.length) / 12) || 1);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, selectedAcademicStage, priceRange, availability, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    try {
      const pId = product.id || product._id;
      setAddingToCartId(pId);
      await addToCart(product, 1);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAddingToCartId(null);
    }
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = async (productId) => {
    try {
      const { data } = await api.post('/wishlist/toggle', { productId });
      setWishlistSet((prev) => {
        const next = new Set(prev);
        if (data?.inWishlist) next.add(productId);
        else next.delete(productId);
        return next;
      });
      toast.success(data?.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  // Handle Quick View Modal Open
  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Handle Compare Toggle (max 4)
  const handleToggleCompare = (product) => {
    const pId = product.id || product._id;
    const exists = compareItems.some((item) => (item.id || item._id) === pId);

    if (exists) {
      setCompareItems((prev) => prev.filter((item) => (item.id || item._id) !== pId));
      toast.success(`Removed ${product.name} from comparison tray`);
    } else {
      if (compareItems.length >= 4) {
        toast.error('Comparison tray is limited to 4 instruments at once');
        return;
      }
      setCompareItems((prev) => [...prev, product]);
      toast.success(`Added ${product.name} to comparison tray`);
    }
  };

  const handleRemoveCompareItem = (productId) => {
    setCompareItems((prev) => prev.filter((item) => (item.id || item._id) !== productId));
  };

  const handleClearCompareAll = () => {
    setCompareItems([]);
    toast.success('Cleared comparison tray');
  };

  // Clear All Filters
  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedAcademicStage('all');
    setSelectedMetallurgy('all');
    setSelectedCert('all');
    setPriceRange({ min: '', max: '' });
    setAvailability('all');
    setSortBy('popularity');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Check active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedAcademicStage !== 'all') count++;
    if (selectedMetallurgy !== 'all') count++;
    if (selectedCert !== 'all') count++;
    if (priceRange.min || priceRange.max) count++;
    if (availability !== 'all') count++;
    if (sortBy !== 'popularity') count++;
    return count;
  }, [searchTerm, selectedCategory, selectedAcademicStage, selectedMetallurgy, selectedCert, priceRange, availability, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pb-28">
      <Seo
        title="Dental Equipment, Kits & Metallurgy Catalog - DentalKit"
        description="Browse university-approved dental student kits, pre-clinical typodonts, and German-grade surgical instruments."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      {/* 1. Header & Live Search Hub */}
      <div className="bg-gradient-to-b from-teal-950/40 via-slate-900 to-slate-950 text-white border-b border-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold shadow-inner">
              <AcademicCapIcon className="w-4 h-4 text-teal-400" />
              <span>{t('products.title') || 'Clinical Dental Equipment & Syllabus Storefront'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Student Toolkits & Medical Instruments
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore professor-verified clinical kits, 32-tooth typodonts, and German AISI 420 instruments with direct university campus delivery.
            </p>

            {/* Live Search Input */}
            <div className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <MagnifyingGlassIcon className={`absolute ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-teal-400 pointer-events-none`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('products.search.placeholder') || 'Search instruments, typodonts, forceps, rubber dam, K-files...'}
                  className={`w-full ${isRTL ? 'pr-12 pl-24' : 'pl-12 pr-24'} py-3.5 text-sm sm:text-base rounded-2xl bg-slate-900 text-white placeholder-slate-400 border border-slate-700/80 shadow-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all`}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors`}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Popular Tags */}
              <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs">
                <span className="text-slate-400 font-medium">Popular:</span>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchTerm(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-slate-700/60 hover:border-teal-500/30 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Container with Course Tabs & Batch Deal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Semester Batch Discount Bar */}
        <SemesterBatchBanner />

        {/* Academic Stage / Course Level Requirement Tabs */}
        <FacultyCourseTabs
          selectedStage={selectedAcademicStage}
          onSelectStage={(stage) => setSelectedAcademicStage(stage)}
        />

        {/* Top Control Bar: Total Count, Active Filters & View Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Left: Mobile Filter Button & Results Count */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{totalProducts}</strong> verified dental instruments
            </span>
          </div>

          {/* Right: Sort & View Mode Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                {t('products.filters.sortBy') || 'Sort by'}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer"
              >
                <option value="popularity">Most Popular</option>
                <option value="discount">Highest Student Discount</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label="Grid View"
                title="Grid View"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label="List View"
                title="List View"
              >
                <Bars3BottomLeftIcon className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Active Filter Badges Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-6 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Filters:</span>
            
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Search: "{searchTerm}"
                <XMarkIcon className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSearchTerm('')} />
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Category: {selectedCategory}
                <XMarkIcon className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedCategory('all')} />
              </span>
            )}

            {selectedAcademicStage !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Stage: {selectedAcademicStage}
                <XMarkIcon className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedAcademicStage('all')} />
              </span>
            )}

            {selectedMetallurgy !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Alloy: {selectedMetallurgy}
                <XMarkIcon className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedMetallurgy('all')} />
              </span>
            )}

            {availability !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                In Stock Only
                <XMarkIcon className="w-3.5 h-3.5 cursor-pointer" onClick={() => setAvailability('all')} />
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-red-500 hover:text-red-600 underline ml-auto cursor-pointer"
            >
              Clear All ({activeFiltersCount})
            </button>
          </div>
        )}

        {/* 3. Main Grid Layout (Multi-Facet Sidebar + Products) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sticky top-24 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-teal-500" />
                <span>Clinical Filters</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Department / Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Department Specialty
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs sm:text-sm">
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className={selectedCategory === 'all' ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}>
                    All Departments
                  </span>
                </label>

                {categories.map((cat) => {
                  const catId = cat.id || cat._id || cat.slug || cat.name;
                  const isChecked = selectedCategory === catId || selectedCategory === cat.slug;
                  return (
                    <label key={catId} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={isChecked}
                        onChange={() => setSelectedCategory(cat.slug || catId)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className={isChecked ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}>
                        {cat.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Metallurgy & Alloy Filter */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <WrenchScrewdriverIcon className="w-3.5 h-3.5 text-teal-500" />
                <span>Steel Alloy / Metallurgy</span>
              </h4>
              <div className="space-y-1 text-xs">
                {metallurgyOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="metallurgy"
                      checked={selectedMetallurgy === opt.id}
                      onChange={() => setSelectedMetallurgy(opt.id)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className={selectedMetallurgy === opt.id ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Price Range (EGP)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Quick presets */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { label: '< 500', min: '', max: '500' },
                  { label: '500 - 1.5k', min: '500', max: '1500' },
                  { label: '1.5k - 3k', min: '1500', max: '3000' },
                  { label: '3,000+', min: '3000', max: '' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPriceRange({ min: preset.min, max: preset.max })}
                    className="text-[11px] py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-500/10 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-center cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Campus Delivery & Stock
              </h4>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability === 'inStock'}
                  onChange={(e) => setAvailability(e.target.checked ? 'inStock' : 'all')}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>In Stock for Fast Delivery</span>
              </label>
            </div>

          </aside>

          {/* Products Grid / List Display (9 cols on lg) */}
          <main className="lg:col-span-9">
            
            {isLoading ? (
              <div className="py-24 text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Loading dental instruments & clinical kits...
                </p>
              </div>
            ) : error ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-500/20 text-center space-y-4 shadow-sm">
                <p className="text-red-500 font-bold">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition-all cursor-pointer"
                >
                  Retry Loading
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-sm">
                <AcademicCapIcon className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No matching dental instruments found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Try adjusting your search terms, changing the academic stage tab, or resetting active filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View (3 Cols on lg) */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const pId = product.id || product._id;
                  const inWishlist = wishlistSet.has(pId);
                  const isCompared = compareItems.some((it) => (it.id || it._id) === pId);
                  const discountPct = product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                  return (
                    <div
                      key={pId}
                      className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800/60 p-6 flex items-center justify-center overflow-hidden">
                        <img
                          src={getFirstImageUrl(product.images)}
                          alt={product.name}
                          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Action Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                          {/* Quick View Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenQuickView(product)}
                            className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200/60 dark:border-slate-700/60 shadow-sm backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                            title="Inspect CAD Specs"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(pId)}
                            className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-rose-500 border border-slate-200/60 dark:border-slate-700/60 shadow-sm backdrop-blur-md transition-all"
                            aria-label="Toggle wishlist"
                          >
                            {inWishlist ? (
                              <HeartIconSolid className="w-4 h-4 text-rose-500" />
                            ) : (
                              <HeartIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Discount Badge */}
                        {discountPct && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-md shadow-rose-500/20">
                            -{discountPct}%
                          </span>
                        )}

                        {/* Micro Metallurgy Spec Tag */}
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-900/80 text-teal-300 border border-teal-500/25 backdrop-blur-sm">
                          AISI 420 • 134°C Autoclave
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mb-1.5">
                            <span>{product.brand || 'Student Edition'}</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <StarIconSolid className="w-3.5 h-3.5" />
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">{product.rating || '4.9'}</span>
                            </div>
                          </div>

                          <Link
                            to={`/products/${pId}`}
                            className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors leading-snug mb-3"
                          >
                            {product.name}
                          </Link>
                        </div>

                        {/* Quick Spec Tags */}
                        <div className="flex items-center gap-1.5 mb-3 flex-wrap text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                            54-58 HRC
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                            ISO 13485
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleCompare(product)}
                            className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                              isCompared
                                ? 'bg-teal-500 text-slate-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600'
                            }`}
                          >
                            <ScaleIcon className="w-3 h-3" />
                            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                          </button>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
                          <div>
                            <div className="text-lg font-black text-slate-900 dark:text-white">
                              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 mr-1">EGP</span>
                              {product.price?.toLocaleString()}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-[11px] line-through text-slate-400">
                                EGP {product.originalPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={addingToCartId === pId || (product.stock !== undefined && product.stock === 0 && !product.inStock)}
                            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px]"
                            aria-label="Add to cart"
                          >
                            {addingToCartId === pId ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <ShoppingCartIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View (1 Col Row) */
              <div className="space-y-4">
                {products.map((product) => {
                  const pId = product.id || product._id;
                  const inWishlist = wishlistSet.has(pId);
                  const isCompared = compareItems.some((it) => (it.id || it._id) === pId);
                  const discountPct = product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                  return (
                    <div
                      key={pId}
                      className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-center gap-6"
                    >
                      <div className="relative w-full sm:w-44 aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-4 flex items-center justify-center shrink-0">
                        <img
                          src={getFirstImageUrl(product.images)}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                        {discountPct && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                            -{discountPct}%
                          </span>
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-teal-300 border border-teal-500/30">
                          AISI 420 Steel
                        </span>
                      </div>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-between">
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                            {product.brand || 'Student Edition'}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 text-xs">
                            <StarIconSolid className="w-3.5 h-3.5" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{product.rating || '4.9'}</span>
                          </div>
                        </div>

                        <Link
                          to={`/products/${pId}`}
                          className="text-base font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors block"
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {product.description || 'German-spec precision dental instrument engineered for clinical exams.'}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <button
                            type="button"
                            onClick={() => handleOpenQuickView(product)}
                            className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>Quick Inspect Specs</span>
                          </button>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <button
                            type="button"
                            onClick={() => handleToggleCompare(product)}
                            className={`font-semibold hover:underline flex items-center gap-1 cursor-pointer ${
                              isCompared ? 'text-teal-500 font-bold' : 'text-slate-500'
                            }`}
                          >
                            <ScaleIcon className="w-3.5 h-3.5" />
                            <span>{isCompared ? 'In Compare Tray' : 'Add to Compare'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-6 flex sm:flex-col items-center justify-between gap-4 shrink-0 w-full sm:w-auto">
                        <div className="text-center sm:text-right">
                          <div className="text-xl font-black text-slate-900 dark:text-white">
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 mr-1">EGP</span>
                            {product.price?.toLocaleString()}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs line-through text-slate-400">
                              EGP {product.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(pId)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            {inWishlist ? <HeartIconSolid className="w-4 h-4 text-rose-500" /> : <HeartIcon className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={addingToCartId === pId || (product.stock !== undefined && product.stock === 0 && !product.inStock)}
                            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[38px]"
                          >
                            {addingToCartId === pId ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <ShoppingCartIcon className="w-4 h-4" />
                            )}
                            <span>{addingToCartId === pId ? 'Adding...' : 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Smart Truncated Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left: Page count summary */}
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 order-2 sm:order-1">
                  Showing page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of{' '}
                  <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({totalProducts} instruments)
                </div>

                {/* Center / Right: Truncated Pagination Controls */}
                <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-teal-500/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous Page"
                  >
                    <ChevronLeftIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Page Numbers with Ellipses */}
                  {(() => {
                    const pages = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else if (currentPage <= 4) {
                      pages.push(1, 2, 3, 4, 5, '...', totalPages);
                    } else if (currentPage >= totalPages - 3) {
                      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                    }

                    return pages.map((page, idx) => {
                      if (page === '...') {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
                          >
                            •••
                          </span>
                        );
                      }

                      const isCurrent = page === currentPage;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105'
                              : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-teal-500/40'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-teal-500/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRightIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

      {/* 4. Interactive Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        inWishlist={quickViewProduct ? wishlistSet.has(quickViewProduct.id || quickViewProduct._id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 5. Sticky Floating Compare Tray & Matrix */}
      <ProductCompareTray
        compareItems={compareItems}
        onRemoveItem={handleRemoveCompareItem}
        onClearAll={handleClearCompareAll}
      />

      {/* 6. Mobile Slide-Over Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />

          <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-[320px] max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-300`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-teal-500" />
                  <span>Clinical Filters</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Department Categories in Drawer */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Department Specialty</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 p-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="m-cat"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="text-teal-600"
                    />
                    <span>All Departments</span>
                  </label>
                  {categories.map((cat) => {
                    const catId = cat.id || cat._id || cat.slug || cat.name;
                    return (
                      <label key={catId} className="flex items-center gap-2 p-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="m-cat"
                          checked={selectedCategory === cat.slug || selectedCategory === catId}
                          onChange={() => setSelectedCategory(cat.slug || catId)}
                          className="text-teal-600"
                        />
                        <span>{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Metallurgy in Drawer */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Alloy & Metallurgy</h4>
                <div className="space-y-1">
                  {metallurgyOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 p-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="m-metal"
                        checked={selectedMetallurgy === opt.id}
                        onChange={() => setSelectedMetallurgy(opt.id)}
                        className="text-teal-600"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Price (EGP)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="w-full py-2 rounded-xl text-slate-500 text-xs font-semibold cursor-pointer"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsPage;
