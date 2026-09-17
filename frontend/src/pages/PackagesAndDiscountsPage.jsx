import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { apiHelpers, endpoints } from '../services/api';
import { toast } from 'react-hot-toast';
import Seo from '../components/seo/Seo';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PackageInspectModal from '../components/packages/PackageInspectModal';

import {
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  TagIcon,
  BoltIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  EyeIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const PackagesAndDiscountsPage = () => {
  const { t } = useTranslation('ecommerce');
  const { currentLanguage, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const [packages, setPackages] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [inspectPkg, setInspectPkg] = useState(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [addingId, setAddingId] = useState(null);

  // Default BDS Semester Kits
  const defaultSemesterPackages = useMemo(() => [
    {
      id: 'pkg-preclinical-y1-2',
      name: 'Year 1 & 2: Pre-Clinical Phantom & Carving Master Box',
      stage: 'pre-clinical',
      stageBadge: 'Year 1 & 2 • Pre-Clinical',
      description: 'Everything required for dental anatomy, tooth carving, and phantom head simulation labs with heavy-duty storage box.',
      price: 2850,
      originalPrice: 3800,
      discountPercentage: 25,
      rating: 4.9,
      reviewCount: 64,
      image: '/images/products/faculty-box.png',
      universities: ['Cairo University (Kasr Al-Ainy)', 'Ain Shams', 'Mansoura', 'Alexandria', 'BUC', 'MUST'],
      items: [
        { name: '32-Tooth Articulated Dental Typodont with Removable Gingiva', spec: 'Standard Screw-fit Phantom Jaw', qty: 1 },
        { name: 'PK Thomas Waxing Instrument Set (#1, #2, #3, #4, #5)', spec: 'Titanium-Coated Heat Resistant', qty: 1 },
        { name: 'Lecron & Beale Wax Carvers', spec: 'AISI 420 Martensitic Steel', qty: 2 },
        { name: 'Lab Alcohol / Bunsen Burner & Wax Spatula #7', spec: 'Leak-Proof Brass Burner', qty: 1 },
        { name: 'Tooth Carving Practice Wax Blocks (24-Block Box)', spec: 'Standard Blue & Ivory Carving Wax', qty: 1 },
        { name: 'Boley Millimeter Gauge & Precision Caliper', spec: 'Stainless Steel Graduation', qty: 1 },
        { name: 'Heavy-Duty Shockproof Organizer Carrying Case', spec: 'Custom Foam Compartments', qty: 1 }
      ]
    },
    {
      id: 'pkg-operative-y3',
      name: 'Year 3: Operative & Restorative Clinical Exam Bundle',
      stage: 'operative',
      stageBadge: 'Year 3 • Conservative BDS',
      description: 'Complete professor-approved restorative instrument suite and matrix systems for dental hospital patient clinics.',
      price: 4200,
      originalPrice: 5600,
      discountPercentage: 25,
      rating: 5.0,
      reviewCount: 92,
      image: '/images/products/faculty-box.png',
      universities: ['Cairo University (Kasr Al-Ainy)', 'Ain Shams', 'Mansoura', 'Alexandria', 'FUE'],
      items: [
        { name: '14-Piece German Restorative Instrument Set', spec: 'Hollenback #3S, Acorn Burnisher, Chisel, Hatchet', qty: 1 },
        { name: 'Complete Dental Rubber Dam Kit with Punch & Forceps', spec: 'Ivory #201, #202, #205 + 8 Winged Clamps', qty: 1 },
        { name: 'Tofflemire Matrix Retainer + 100 Assorted Metal Bands', spec: 'Stainless Steel Universal System', qty: 1 },
        { name: 'TiN Nano-Gold Non-Stick Composite Sculpting Instrument', spec: 'Non-Stick Aesthetic Contour Tip', qty: 1 },
        { name: 'Front Surface Rhodium Examination Mirror #5 + Handle', spec: 'Anti-Fog Distortion-Free', qty: 2 },
        { name: 'Surgical Stainless Autoclave Cassette Rack (10-Tool)', spec: '134°C Autoclavable Hospital Rack', qty: 1 }
      ]
    },
    {
      id: 'pkg-endo-y3-4',
      name: 'Year 3 & 4: Endodontic Root Canal Master Kit',
      stage: 'operative',
      stageBadge: 'Year 3 & 4 • Endodontics',
      description: 'Precision canal negotiation, instrumentation, and obturation set required for endodontic clinical requirements.',
      price: 3100,
      originalPrice: 4150,
      discountPercentage: 25,
      rating: 4.8,
      reviewCount: 51,
      image: '/images/products/faculty-box.png',
      universities: ['Cairo University (Kasr Al-Ainy)', 'Ain Shams', 'Mansoura', 'MIU', 'BUC'],
      items: [
        { name: 'DG-16 Double-Ended Endodontic Canal Explorer', spec: 'Ultra-Sharp High Tensile Steel', qty: 1 },
        { name: 'ISO Color-Coded K-Files 25mm (Sizes 15-40 Assorted)', spec: 'Flexible Stainless Steel, 6/pack', qty: 3 },
        { name: 'Endodontic Finger Spreaders & Pluggers (Set of 4)', spec: 'Color-Coded ISO Depth Markings', qty: 1 },
        { name: 'Endo Ring Ruler & Gutta-Percha Gauge', spec: 'Autoclavable Millimeter Gauge', qty: 1 },
        { name: 'Heavy-Duty Rubber Dam Clamps #9 & #2', spec: 'Anterior & Premolar Endodontic Clamps', qty: 2 }
      ]
    },
    {
      id: 'pkg-surgery-y4-5',
      name: 'Year 4 & 5: Oral Surgery & Exodontia Hospital Suite',
      stage: 'surgery',
      stageBadge: 'Year 4 & 5 • Oral Surgery',
      description: 'Drop-forged surgical extraction forceps and root elevators engineered for outpatient surgical dental clinics.',
      price: 5900,
      originalPrice: 8200,
      discountPercentage: 28,
      rating: 4.9,
      reviewCount: 78,
      image: '/images/products/faculty-box.png',
      universities: ['Cairo University (Kasr Al-Ainy)', 'Ain Shams', 'Mansoura', 'Alexandria', 'BUC', 'MUST'],
      items: [
        { name: 'Upper Universal Extraction Forceps #150', spec: 'Micro-Serrated Beaks, Drop-Forged 420', qty: 1 },
        { name: 'Lower Universal Extraction Forceps #151', spec: 'Micro-Serrated Beaks, Drop-Forged 420', qty: 1 },
        { name: 'Straight & Curved Cryer Root Elevators (Pair)', spec: 'Sharp Triangular Beaks, Knurled Grip', qty: 2 },
        { name: 'Minnesota Cheek & Flap Retractor', spec: 'High-Polish Surgical Stainless', qty: 1 },
        { name: 'Mathieu Needle Holder & Mosquito Hemostatic Forceps', spec: 'Tungsten Carbide Inserts', qty: 2 },
        { name: 'Surgical Scalpel Handle #3 + 10x Sterile Blades', spec: 'Graduated Ruler on Handle', qty: 1 }
      ]
    },
    {
      id: 'pkg-bds-career-trunk',
      name: 'The Ultimate 5-Year BDS Graduation Career Trunk',
      stage: 'bundles',
      stageBadge: 'All-in-One BDS Suite',
      description: 'The definitive all-inclusive clinic setup containing all 4 department suites in an armored aluminum flight case with custom laser engraving.',
      price: 14500,
      originalPrice: 21000,
      discountPercentage: 31,
      rating: 5.0,
      reviewCount: 35,
      image: '/images/products/faculty-box.png',
      universities: ['All Egyptian & International Dental Faculties'],
      items: [
        { name: 'Complete Pre-Clinical Phantom & Waxing Suite', spec: 'All 7 Modules Included', qty: 1 },
        { name: 'Complete Operative & Restorative 14-Piece Suite', spec: 'Cassette Rack & Rubber Dam Set', qty: 1 },
        { name: 'Complete Endodontic Master Preparation Suite', spec: 'Files, Pluggers, Spreaders & DG-16', qty: 1 },
        { name: 'Complete Oral Surgery & Exodontia 6-Piece Suite', spec: 'Drop-Forged Forceps & Elevators', qty: 1 },
        { name: 'Reinforced Aluminum Flight Transport Case with Combo Lock', spec: 'Custom Laser Name Engraving Included', qty: 1 }
      ]
    }
  ], []);

  // Flash Deals Data
  const defaultDiscounted = useMemo(() => [
    {
      id: 'flash-1',
      name: 'DG-16 Double-Ended Endo Explorer',
      price: 260,
      compareAtPrice: 350,
      discountPct: 26,
      image: '/images/products/dg16-explorer.png',
      tag: 'Endo Deal'
    },
    {
      id: 'flash-2',
      name: 'Tofflemire Matrix Band Retainer (Universal)',
      price: 320,
      compareAtPrice: 440,
      discountPct: 27,
      image: '/images/products/matrix-retainer.png',
      tag: 'Operative Deal'
    },
    {
      id: 'flash-3',
      name: 'Ivory Rubber Dam Clamp Punch Plier',
      price: 490,
      compareAtPrice: 650,
      discountPct: 25,
      image: '/images/products/clamp-punch.png',
      tag: 'Clinic Essential'
    },
    {
      id: 'flash-4',
      name: 'Cryer Root Elevator Pair (Left & Right)',
      price: 580,
      compareAtPrice: 800,
      discountPct: 28,
      image: '/images/products/cryer-elevator.png',
      tag: 'Surgery Deal'
    }
  ], []);

  // Fetch API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiHelpers.get(endpoints.packages.combined);
        setPackages(res.packages?.length > 0 ? res.packages : defaultSemesterPackages);
        setDiscounted(res.discountedProducts?.length > 0 ? res.discountedProducts : defaultDiscounted);
      } catch (_) {
        setPackages(defaultSemesterPackages);
        setDiscounted(defaultDiscounted);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [defaultSemesterPackages, defaultDiscounted]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (selectedStage !== 'all' && pkg.stage && pkg.stage !== selectedStage) {
        return false;
      }
      return true;
    });
  }, [packages, selectedStage]);

  // Handle Add Package to Cart
  const handleAddToCart = async (pkg) => {
    try {
      setAddingId(pkg.id || pkg._id);
      await addToCart(
        {
          _id: pkg.id || pkg._id,
          id: pkg.id || pkg._id,
          name: pkg.name,
          price: pkg.price || pkg.packagePrice,
          originalPrice: pkg.originalPrice || pkg.compareAtPrice,
          images: pkg.image ? [pkg.image] : pkg.images || ['/images/products/faculty-box.png']
        },
        1
      );
      toast.success(`Added ${pkg.name} to student tray!`);
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleOpenInspect = (pkg) => {
    setInspectPkg(pkg);
    setIsInspectOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pb-28">
      <Seo
        title="Dental Student Packages & Semester Bundles - DentalKit"
        description="Curriculum-approved dental student packages, pre-clinical toolboxes, and complete BDS clinical exam bundles with up to 35% savings."
        type="website"
        locale={currentLanguage === 'ar' ? 'ar_SA' : 'en_US'}
        themeColor="#00b1db"
      />

      {/* 1. High-Impact Hero Banner */}
      <div className="bg-gradient-to-b from-teal-950/50 via-slate-900 to-slate-950 text-white border-b border-slate-800 pt-10 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold shadow-inner">
            <AcademicCapIcon className="w-4 h-4 text-teal-400" />
            <span>Curriculum-Aligned BDS Exam Toolboxes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Faculty Packages & Semester Bundles
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Order your complete dental faculty semester box with guaranteed professor syllabus compliance, heavy-duty autoclavable cases, and up to 35% package savings.
          </p>

          {/* Group Cohort Discount Badge */}
          <div className="pt-2 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-black">
            <BoltIcon className="w-4 h-4 text-teal-400" />
            <span>Class Cohort Deal: Use code <strong>BATCH10</strong> for extra 10% off when 3+ students order together</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* 2. Academic Stage Filter Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Semester Packages', icon: CubeIcon },
            { id: 'pre-clinical', label: 'Year 1 & 2 • Pre-Clinical', icon: AcademicCapIcon },
            { id: 'operative', label: 'Year 3 & 4 • Operative & Endo', icon: WrenchScrewdriverIcon },
            { id: 'surgery', label: 'Year 4 & 5 • Oral Surgery', icon: BeakerIcon },
            { id: 'bundles', label: 'Complete BDS Graduation Trunks', icon: SparklesIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedStage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStage(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25 ring-2 ring-teal-500/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Packages Grid Showcase */}
        {loading ? (
          <div className="py-24 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-400">Loading university semester bundles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPackages.map((pkg) => {
              const discount = pkg.originalPrice && pkg.price
                ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                : pkg.discountPercentage || 25;

              return (
                <div
                  key={pkg.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 space-y-6"
                >
                  <div className="space-y-4">
                    {/* Top Row: Stage & Discount */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {pkg.stageBadge || 'BDS Clinical Package'}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <StarIconSolid className="w-4 h-4" />
                          <span>{pkg.rating || 4.9}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500 text-white shadow-sm">
                          Save {discount}%
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* University Tags */}
                    {pkg.universities && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <BuildingLibraryIcon className="w-3.5 h-3.5 text-teal-500" />
                        <span>Verified For:</span>
                        {pkg.universities.slice(0, 4).map((uni, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                            {uni}
                          </span>
                        ))}
                        {pkg.universities.length > 4 && (
                          <span className="text-teal-600 dark:text-teal-400 font-bold">
                            +{pkg.universities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Included Items Checklist Preview */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Included Clinical Modules ({pkg.items?.length || 5} Instruments):
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {(pkg.items || []).slice(0, 4).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-teal-500 shrink-0" />
                            <span className="truncate">{typeof item === 'string' ? item : item.name}</span>
                          </li>
                        ))}
                      </ul>

                      {pkg.items && pkg.items.length > 4 && (
                        <button
                          type="button"
                          onClick={() => handleOpenInspect(pkg)}
                          className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline pt-1 block cursor-pointer"
                        >
                          + View all {pkg.items.length} included items & metallurgy specs →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Cart Action */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block">Package Price:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                          <span className="text-xs font-bold mr-1">EGP</span>
                          {(pkg.price || pkg.packagePrice)?.toLocaleString()}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-xs line-through text-slate-400">
                            EGP {pkg.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenInspect(pkg)}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                        title="Inspect Kit Inventory"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(pkg)}
                        disabled={addingId === pkg.id}
                        className="flex-1 sm:flex-none py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>{addingId === pkg.id ? 'Adding Box...' : 'Order Semester Box'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 4. Student Flash Deals & Discounted Tools Section */}
        {discounted.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
                  <TagIcon className="w-4 h-4" />
                  <span>Limited Student Specials</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Discounted Clinical Instruments
                </h3>
              </div>
              <Link to="/products" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
                View All Tools →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {discounted.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 p-5 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold">
                        -{item.discountPct || 25}% OFF
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                        {item.tag || 'Special'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                      {item.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        <span className="text-xs font-bold text-teal-600 mr-0.5">EGP</span>
                        {item.price?.toLocaleString()}
                      </div>
                      {item.compareAtPrice && (
                        <span className="text-[10px] line-through text-slate-400">
                          EGP {item.compareAtPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Campus Cohort Group Buy Hub Card */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-500/30 p-8 text-white shadow-xl shadow-teal-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black uppercase tracking-wider">
              Student Union & Cohort Program
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ordering for your Entire Dental Section?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We provide custom faculty checklist bulk packing, class leader billing coordination, and direct university clinic drop-offs for groups of 10+ students.
            </p>
          </div>

          <Link
            to="/contact"
            className="shrink-0 py-3.5 px-8 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/25 transition-all"
          >
            Request Batch Order Coordinator
          </Link>
        </div>

      </div>

      {/* Package Breakdown Modal */}
      <PackageInspectModal
        pkg={inspectPkg}
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
      />

    </div>
  );
};

export default PackagesAndDiscountsPage;
