import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import Hero from '../components/common/Hero';
import FacultyKitMatcher from '../components/home/FacultyKitMatcher';
import InteractiveTrayExplorer from '../components/home/InteractiveTrayExplorer';
import SpecialtyBentoGrid from '../components/home/SpecialtyBentoGrid';
import MedicalGradeSpecs from '../components/home/MedicalGradeSpecs';
import CampusBatchHub from '../components/home/CampusBatchHub';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { getFirstImageUrl } from '../utils/imageUtils';
import {
  AcademicCapIcon,
  BeakerIcon,
  ScissorsIcon,
  GiftIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  HeartIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { FaWhatsapp } from 'react-icons/fa';

const HomePage = () => {
  const { t } = useTranslation('ecommerce');
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isRtl = currentLanguage === 'ar';

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistSet, setWishlistSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, wishlistResponse] = await Promise.all([
          api.get('/products?featured=true&limit=12').catch(() => ({ data: { products: [] } })),
          api.get('/wishlist').catch(() => ({ data: {} }))
        ]);

        setFeaturedProducts(productsResponse.data?.products || []);
        const items = wishlistResponse.data?.items || wishlistResponse.data?.wishlist?.items || [];
        setWishlistSet(new Set(items.map((it) => it.productId || it._id)));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCartId(productId);
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success(t('cart.added') || 'Item added to cart!');
    } catch {
      toast.error(t('cart.error.add') || 'Failed to add item to cart');
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleWishlist = async (productId) => {
    try {
      const { data } = await api.post('/wishlist/toggle', { productId });
      setWishlistSet((prev) => {
        const next = new Set(prev);
        if (data?.inWishlist) next.add(productId);
        else next.delete(productId);
        return next;
      });
      toast.success(data?.action === 'added' ? (t('wishlist.added') || 'Added to wishlist') : (t('wishlist.removed') || 'Removed from wishlist'));
    } catch {
      toast.error(t('wishlist.error.add') || 'Failed to update wishlist');
    }
  };

  // Academic Stages
  const academicStages = [
    {
      title: t('home.stages.year1_2') || 'Year 1 & 2 • Pre-Clinical',
      description: t('home.stages.year1_2Desc') || 'Tooth carving blocks, typodonts, waxing tools & anatomy sets',
      icon: AcademicCapIcon,
      href: '/products?category=pre-clinical',
      badge: 'Pre-Clinical',
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-500 border-cyan-500/30'
    },
    {
      title: t('home.stages.year3') || 'Year 3 • Operative & Endo',
      description: t('home.stages.year3Desc') || 'Rubber dam kits, K-files, cavity prep carvers & matrix sets',
      icon: BeakerIcon,
      href: '/products?category=endodontics',
      badge: 'Phantom Lab',
      color: 'from-teal-500/20 to-emerald-500/10 text-teal-500 border-teal-500/30'
    },
    {
      title: t('home.stages.year4_5') || 'Year 4 & 5 • Clinical & Surgery',
      description: t('home.stages.year4_5Desc') || 'Extraction forceps, perio scalers, elevators & impression trays',
      icon: ScissorsIcon,
      href: '/products?category=surgery',
      badge: 'Hospital Clinic',
      color: 'from-purple-500/20 to-pink-500/10 text-purple-500 border-purple-500/30'
    },
    {
      title: t('home.stages.bundles') || 'All-in-One Year Bundles',
      description: t('home.stages.bundlesDesc') || 'Complete semester boxes with up to 30% savings & faculty compliance',
      icon: GiftIcon,
      href: '/packages',
      badge: 'Save 30%',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/30'
    }
  ];

  // Why Choose Perks
  const whyChoosePerks = [
    {
      icon: CheckBadgeIcon,
      title: t('home.whyChoose.curriculum') || 'Faculty Syllabus Matched',
      desc: t('home.whyChoose.curriculumDesc') || 'Tools aligned with Cairo, Ain Shams, Mansoura, Alexandria & private universities.',
      color: 'bg-teal-500/10 text-teal-500'
    },
    {
      icon: ShieldCheckIcon,
      title: t('home.whyChoose.steel') || 'German Spec Stainless Steel',
      desc: t('home.whyChoose.steelDesc') || 'Autoclavable, rust-resistant instruments with precision grip balance.',
      color: 'bg-cyan-500/10 text-cyan-500'
    },
    {
      icon: TruckIcon,
      title: t('home.whyChoose.delivery') || 'Direct Campus & Dorm Delivery',
      desc: t('home.whyChoose.deliveryDesc') || 'Fast shipping directly to your university hospital or student residence.',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: t('home.whyChoose.support') || 'Student Advisory Support',
      desc: t('home.whyChoose.supportDesc') || 'Consult with senior dental clinicians on kit requirements anytime.',
      color: 'bg-emerald-500/10 text-emerald-500'
    }
  ];

  // Student Testimonials
  const testimonials = [
    {
      name: t('home.testimonials.student1.name') || 'Ahmed Mostafa',
      role: t('home.testimonials.student1.role') || '4th Year BDS, Cairo University',
      content: t('home.testimonials.student1.content') || 'The clinical surgery set was exactly what my professors required. Super high quality steel and the fastest delivery to Kasr Al-Ainy!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face'
    },
    {
      name: t('home.testimonials.student2.name') || 'Nouran El-Sayed',
      role: t('home.testimonials.student2.role') || '3rd Year Dental, Ain Shams University',
      content: t('home.testimonials.student2.content') || 'The Endo rubber dam kit and K-files made my pre-clinical exams so smooth. Highly recommend their student bundles!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face'
    },
    {
      name: t('home.testimonials.student3.name') || 'Omar Khaled',
      role: t('home.testimonials.student3.role') || '2nd Year BDS, Mansoura University',
      content: t('home.testimonials.student3.content') || 'Best typodont and waxing set I\'ve used. Saved over 25% compared to local campus stores.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'
    }
  ];

  return (
    <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Seo
        title="DentalKit - #1 Specialized Dental Student & Clinical Equipment Store"
        description="University-approved dental student kits, pre-clinical phantom models, and precision instruments."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. University Faculty & Syllabus Matcher */}
      <FacultyKitMatcher />

      {/* 3. Interactive Clinical Department Tray Explorer */}
      <InteractiveTrayExplorer />

      {/* 4. Specialized Department Suites Bento Grid */}
      <SpecialtyBentoGrid />

      {/* 5. Academic Stage & Year Selector Section */}
      <section id="academic-stages" className="py-16 sm:py-20 relative bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-3 border border-teal-500/20">
              <AcademicCapIcon className="w-3.5 h-3.5" />
              <span>Academic Curriculum</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              {t('home.stages.title') || 'Shop by Academic Stage'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t('home.stages.subtitle') || 'Select your dental college year to find exact required kit lists and tools'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <Link
                  key={index}
                  to={stage.href}
                  className="group relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${stage.color} border shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                        {stage.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                    <span>View Tools List</span>
                    <ArrowRightIcon className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Medical Metallurgy & Precision Engineering Specs */}
      <MedicalGradeSpecs />

      {/* 7. Featured Student Kits & Bestsellers */}
      <section className="py-20 sm:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-3 border border-teal-500/20">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>{t('home.featured.professionalChoice') || 'Student Bestsellers'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                {t('home.featured.title') || 'Featured Student Kits'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {t('home.featured.subtitle') || 'Top-rated instruments recommended by professors and senior students'}
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold shadow-sm transition-all hover:border-teal-500/40 shrink-0 self-start md:self-auto"
            >
              <span>{t('home.featured.viewAll') || 'View All Products'}</span>
              <ArrowRightIcon className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => {
              const inWishlist = wishlistSet.has(product._id || product.id);
              const discountPercentage = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <div
                  key={product._id || product.id}
                  className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 hover:border-teal-500/40 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800/60 p-6 flex items-center justify-center overflow-hidden">
                    <img
                      src={getFirstImageUrl(product.images)}
                      alt={product.name}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => handleWishlist(product._id || product.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-rose-500 border border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur-md transition-all z-10"
                      aria-label="Toggle wishlist"
                    >
                      {inWishlist ? (
                        <HeartIconSolid className="w-4 h-4 text-rose-500" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                    </button>

                    {/* Discount Pill */}
                    {discountPercentage && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-md shadow-rose-500/20">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
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
                        to={`/products/${product._id || product.id}`}
                        className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors leading-snug mb-3"
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 mt-auto">
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
                        onClick={() => handleAddToCart(product._id || product.id)}
                        disabled={addingToCartId === (product._id || product.id)}
                        className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        aria-label="Add to cart"
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Flagship Student Bundle Promo Showcase */}
      <section className="py-16 sm:py-20 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-[36px] bg-gradient-to-br from-teal-950 via-slate-900 to-cyan-950 text-white p-8 sm:p-14 border border-teal-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Left text */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  <TagIcon className="w-3.5 h-3.5" />
                  <span>{t('home.bundlePromo.badge') || 'Academic Bundle Special'}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {t('home.bundlePromo.title') || 'Complete BDS Clinical Toolkit Box'}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {t('home.bundlePromo.subtitle') || 'Everything required by Egyptian & International Dental Faculties in one heavy-duty autoclavable carrying case.'}
                </p>

                {/* Kit Checklist */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[
                    t('home.bundlePromo.item1') || '14-Piece German Spec Restorative Set',
                    t('home.bundlePromo.item2') || 'Complete Rubber Dam Kit with Ivory Clamps',
                    t('home.bundlePromo.item3') || 'Diagnostic Set with Front Surface Mirror',
                    t('home.bundlePromo.item4') || 'Autoclavable Medical Organizer Box'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                      <CheckCircleIcon className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    to="/packages"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-teal-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    {t('home.bundlePromo.orderNow') || 'Order Student Bundle'}
                  </Link>

                  <Link
                    to="/packages"
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/15 transition-all"
                  >
                    {t('home.bundlePromo.viewPackages') || 'Explore All Packages'}
                  </Link>
                </div>
              </div>

              {/* Right promo graphic */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative rounded-3xl overflow-hidden bg-slate-800/80 border border-white/10 p-4 shadow-2xl max-w-sm">
                  <img
                    src="/hero-tools.png"
                    alt="Clinical Toolkit Box"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                  <div className="mt-4 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center">
                    <p className="text-xs font-bold text-teal-300">
                      {t('home.bundlePromo.save') || 'Save 30% vs buying separately'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. University Batch & Campus Group Buy Hub */}
      <CampusBatchHub />

      {/* 10. Why Dental Students Choose DentalKit */}
      <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-3 border border-teal-500/20">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>University Compliance</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              {t('home.whyChoose.title') || 'Why Dental Students Rely On DentalKit'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t('home.whyChoose.subtitle') || 'Tailored specifically to match clinical exam checklists and university requirements'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChoosePerks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={index}
                  className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 hover:border-teal-500/30 transition-all duration-300 flex flex-col items-start"
                >
                  <div className={`p-3.5 rounded-2xl ${perk.color} mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Student Testimonials */}
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              {t('home.testimonials.title') || 'Trusted by Dental Students'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t('home.testimonials.subtitle') || 'Read verified feedback from dental students across top universities'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((review, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIconSolid key={i} className="w-4 h-4" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                    "{review.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-teal-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{review.name}</h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Faculty Checklist Consultation Banner */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-blue-500/10 border border-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
                {t('home.checklistBanner.title') || "Need Help Finding Your Faculty's Required Kit List?"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t('home.checklistBanner.subtitle') || 'Send us your department instrument checklist, and our clinical advisor will pack the exact tools for you.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="https://wa.me/201111194483"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>{t('home.checklistBanner.whatsapp') || 'Chat on WhatsApp'}</span>
              </a>

              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:text-teal-600 text-sm font-bold border border-slate-200 dark:border-white/10 shadow-sm transition-all"
              >
                {t('home.checklistBanner.cta') || 'Contact Student Support'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;