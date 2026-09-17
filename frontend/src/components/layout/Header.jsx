import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Logo from '../common/Logo';
import NavCategoryDropdown from './NavCategoryDropdown';
import SearchBar from '../common/SearchBar';
import CartBadge from '../cart/CartBadge';
import LanguageSwitcher from '../common/LanguageSwitcher';
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  GiftIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { t } = useTranslation('ecommerce');
  const { isAuthenticated, user, logout } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchOverlayRef = useRef(null);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsCategoryOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Global click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (searchOverlayRef.current && searchOverlayRef.current === event.target) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsCategoryOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
      // Ctrl/Cmd + K shortcut for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.firstName) {
      return (user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'D';
  };

  const getRoleBadgeLabel = () => {
    if (user?.role === 'admin') return 'Admin';
    if (user?.role === 'vendor') return 'Vendor';
    return 'Dental Student';
  };

  const isNavActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Student Perks & Announcement Bar */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-cyan-950 text-slate-200 text-xs py-1.5 px-3 sm:px-4 border-b border-teal-500/20 relative z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto justify-center md:justify-start">
            <span className="hidden xs:flex h-2 w-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
            <p className="truncate font-medium text-[11px] sm:text-xs text-slate-200 text-center md:text-left">
              {t('nav.studentPerks') || '🎓 Special Dental Student Bundles & Fast Campus Delivery'}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs shrink-0">
            <Link 
              to="/help" 
              className="flex items-center gap-1 text-slate-300 hover:text-teal-400 transition-colors"
            >
              <QuestionMarkCircleIcon className="w-3.5 h-3.5" />
              <span>{t('nav.studentSupport') || 'Student Support'}</span>
            </Link>

            <span className="h-3 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <LanguageSwitcher 
                variant="dropdown" 
                size="sm" 
                className="scale-90 origin-right"
              />

              <button
                onClick={toggleTheme}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                aria-label="Toggle theme"
                title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {currentTheme === 'dark' ? (
                  <SunIcon className="w-4 h-4 text-amber-400" />
                ) : (
                  <MoonIcon className="w-4 h-4 text-cyan-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-slate-200/80 dark:border-white/10 py-2'
            : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <Logo className="h-7 sm:h-9 md:h-11 w-auto max-w-[130px] sm:max-w-none object-contain transition-transform duration-300 group-hover:scale-105" />
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (Hidden on mobile/tablet) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Dental Kits Mega Dropdown Trigger */}
              <div className="relative" ref={categoryMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isCategoryOpen || isNavActive('/categories')
                      ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <AcademicCapIcon className="w-4 h-4 text-teal-500" />
                  <span>{t('nav.studentKits') || 'Student Kits'}</span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryOpen && (
                  <div onMouseLeave={() => setIsCategoryOpen(false)}>
                    <NavCategoryDropdown onClose={() => setIsCategoryOpen(false)} />
                  </div>
                )}
              </div>

              {/* All Products */}
              <Link
                to="/products"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isNavActive('/products') && !location.search.includes('discount')
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                    : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.products') || 'Products'}
              </Link>

              {/* Packages & Bundles */}
              <Link
                to="/packages"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isNavActive('/packages')
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                    : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <GiftIcon className="w-4 h-4 text-teal-500" />
                <span>{t('nav.packages') || 'Packages'}</span>
              </Link>

              {/* Deals & Offers */}
              <Link
                to="/products?sort=discount"
                className="group relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
              >
                <TagIcon className="w-4 h-4 text-amber-500" />
                <span>{t('nav.deals') || 'Deals'}</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              </Link>
            </nav>

            {/* Right: Actions Cluster (Clean & Spacious across screen sizes) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 sm:bg-slate-100 sm:dark:bg-slate-800/80 border border-transparent sm:border-slate-200 sm:dark:border-white/10 transition-all duration-200 flex items-center gap-2 group"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5 sm:h-4 sm:w-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('nav.search') || 'Search...'}
                </span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-md">
                  ⌘K
                </kbd>
              </button>

              {/* Wishlist Link (Hidden on mobile, visible on sm+) */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="hidden sm:flex p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 group"
              >
                <HeartIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              </Link>

              {/* Cart Badge */}
              <CartBadge />

              {/* Divider (Hidden on mobile) */}
              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-white/10 mx-0.5" />

              {/* User Account / Auth Section */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 transition-all duration-200"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-teal-500/20">
                      {getUserInitials()}
                    </div>
                    <div className="hidden md:flex flex-col text-left text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
                        {user?.firstName || 'Student'}
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                        {getRoleBadgeLabel()}
                      </span>
                    </div>
                    <ChevronDownIcon className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                            {getUserInitials()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Dental Student'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Account Type</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                            {getRoleBadgeLabel()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>{t('nav.profile') || 'My Profile'}</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          <ClipboardDocumentListIcon className="w-4 h-4 text-slate-400" />
                          <span>{t('nav.orders') || 'My Orders'}</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          <HeartIcon className="w-4 h-4 text-slate-400" />
                          <span>{t('nav.wishlist') || 'Wishlist'}</span>
                        </Link>

                        {/* Admin Dashboard */}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors"
                          >
                            <ShieldCheckIcon className="w-4 h-4 text-teal-500" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        {/* Vendor Dashboard */}
                        {user?.role === 'vendor' && (
                          <Link
                            to="/vendor/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
                          >
                            <BuildingStorefrontIcon className="w-4 h-4 text-cyan-500" />
                            <span>Vendor Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>{t('nav.logout') || 'Log Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Sign In / Register Buttons (Hidden on mobile to keep navbar clean; easily accessible in mobile drawer) */
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  >
                    {t('nav.login') || 'Sign In'}
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-md shadow-teal-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    {t('nav.register') || 'Join Store'}
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal Overlay */}
      {isSearchOpen && (
        <div
          ref={searchOverlayRef}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-20 px-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-4 sm:p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
                <AcademicCapIcon className="w-5 h-5 text-teal-500" />
                <span>Search Dental Kits & Products</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close search"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <SearchBar
              onClose={() => setIsSearchOpen(false)}
              showQuickTags={true}
            />
          </div>
        </div>
      )}

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            ref={mobileMenuRef}
            className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-[320px] max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between p-5 sm:p-6 z-10 animate-in slide-in-from-right duration-300`}
          >
            {/* Top Drawer Section */}
            <div className="space-y-5 overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-8 w-auto" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Quick Search Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 text-sm"
              >
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-teal-500" />
                  <span>{t('nav.searchPlaceholder') || 'Search kits...'}</span>
                </div>
                <kbd className="text-[10px] font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">
                  Search
                </kbd>
              </button>

              {/* Navigation Links */}
              <div className="space-y-1">
                {/* Dental Kits Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <AcademicCapIcon className="w-5 h-5 text-teal-500" />
                      <span>{t('nav.studentKits') || 'Student Kits'}</span>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="pl-6 pr-2 py-2 space-y-1.5 border-l-2 border-teal-500/30 ml-4 my-1">
                      <Link
                        to="/products?category=pre-clinical"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-500 py-1"
                      >
                        {t('nav.preclinicalKits') || 'Pre-Clinical Kits'}
                      </Link>
                      <Link
                        to="/products?category=clinical"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-500 py-1"
                      >
                        {t('nav.clinicalKits') || 'Clinical Instruments'}
                      </Link>
                      <Link
                        to="/products?category=endodontics"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-500 py-1"
                      >
                        {t('nav.endoResto') || 'Endo & Restorative'}
                      </Link>
                      <Link
                        to="/products?category=surgery"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-500 py-1"
                      >
                        {t('nav.surgicalPeriodontics') || 'Surgery & Periodontics'}
                      </Link>
                      <Link
                        to="/categories"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs font-bold text-teal-600 dark:text-teal-400 pt-1"
                      >
                        {t('nav.allCategories') || 'All Categories'} &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <TagIcon className="w-5 h-5 text-cyan-500" />
                  <span>{t('nav.products') || 'Products'}</span>
                </Link>

                <Link
                  to="/packages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <GiftIcon className="w-5 h-5 text-teal-500" />
                  <span>{t('nav.packages') || 'Packages & Bundles'}</span>
                </Link>

                <Link
                  to="/products?sort=discount"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <SparklesIcon className="w-5 h-5 text-amber-500" />
                  <span>{t('nav.deals') || 'Deals & Offers'}</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <HeartIcon className="w-5 h-5 text-rose-500" />
                  <span>{t('nav.wishlist') || 'Wishlist'}</span>
                </Link>
              </div>

              {/* User Section in Mobile Menu */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                        {getUserInitials()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user?.firstName || 'Dental Student'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                    >
                      {t('nav.profile') || 'My Profile'}
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                    >
                      {t('nav.orders') || 'My Orders'}
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-white/5 rounded-xl"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
                    >
                      {t('nav.logout') || 'Log Out'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-2.5 text-center font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                    >
                      {t('nav.login') || 'Sign In'}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-2.5 text-center font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-md shadow-teal-500/20"
                    >
                      {t('nav.register') || 'Join Store'}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Utilities */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
              <LanguageSwitcher variant="dropdown" size="sm" className="w-full" />
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                {currentTheme === 'dark' ? (
                  <>
                    <SunIcon className="w-4 h-4 text-amber-400" />
                    <span>{t('nav.switchToLight') || 'Switch to Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-4 h-4 text-cyan-500" />
                    <span>{t('nav.switchToDark') || 'Switch to Dark Mode'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;