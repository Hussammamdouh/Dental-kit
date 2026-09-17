import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  WrenchScrewdriverIcon,
  BeakerIcon,
  ScissorsIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  EyeIcon,
  FireIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const traySetups = [
  {
    id: 'operative',
    nameKey: 'home.trayExplorer.tabOperative',
    defaultName: 'Operative & Restorative Tray',
    department: 'Department of Conservative Dentistry',
    badge: 'Clinical Rotation',
    icon: WrenchScrewdriverIcon,
    color: 'from-teal-500 to-cyan-500',
    accentColor: 'teal',
    trayImage: '/hero-tools.png',
    packagePrice: '1,850',
    originalPrice: '2,400',
    discount: '23%',
    packageLink: '/packages',
    instruments: [
      {
        id: 1,
        name: 'TiN Composite Sculpting Carvers (Gold Set)',
        spec: 'Titanium Nitride coated non-stick tips • 0.3mm ultra-fine margin blade',
        alloy: 'AISI 420 Martensitic Steel',
        sterilization: 'Autoclave 134°C / 273°F'
      },
      {
        id: 2,
        name: 'Hollenback Carver #3S & Ward Carver',
        spec: 'Hand-honed razor bevel for occlusal anatomy carving & amalgam carving',
        alloy: 'German Stainless Steel (HRC 56)',
        sterilization: 'Ultrasonic & Chemclave Safe'
      },
      {
        id: 3,
        name: 'Ball & Acorn Burnisher Set',
        spec: 'Mirror-polished smooth spherical head for anatomical groove burnishing',
        alloy: 'Passivated Surgical Steel',
        sterilization: '1,000+ Cycles Certified'
      },
      {
        id: 4,
        name: 'Tofflemire Matrix Band Retainer (Universal)',
        spec: 'Smooth micro-screw tension adjuster for Class II contact point adaptation',
        alloy: 'Austenitic Stainless Steel',
        sterilization: 'Corrosion-Free Lifetime'
      }
    ]
  },
  {
    id: 'endo',
    nameKey: 'home.trayExplorer.tabEndo',
    defaultName: 'Endodontic Access & Prep Set',
    department: 'Department of Endodontics',
    badge: 'Pre-Clinical & Clinical',
    icon: BeakerIcon,
    color: 'from-blue-500 to-indigo-500',
    accentColor: 'blue',
    trayImage: '/hero-tools.png',
    packagePrice: '2,100',
    originalPrice: '2,800',
    discount: '25%',
    packageLink: '/packages',
    instruments: [
      {
        id: 1,
        name: 'Endodontic Explorer DG-16 (Double Ended)',
        spec: 'Extremely sharp 0.2mm tactile probe for canal orifice localization',
        alloy: 'High-Tensile Martensitic Steel',
        sterilization: 'Autoclave 134°C'
      },
      {
        id: 2,
        name: 'Ivory Rubber Dam Clamps Set (8 Assorted)',
        spec: 'Pre-tempered spring steel with anatomical tooth-neck grip wings',
        alloy: 'Spring Stainless Steel (HRC 58)',
        sterilization: 'Autoclave 134°C'
      },
      {
        id: 3,
        name: 'Finger Pluggers & Spreaders #1-3 (ISO Color Coded)',
        spec: 'Calibrated depth markings at 18, 20, 22mm for lateral condensation',
        alloy: 'Nickel-Titanium & Stainless Steel',
        sterilization: 'Steam & Dry Heat Safe'
      },
      {
        id: 4,
        name: 'Endodontic Precision Millimeter Ruler Block',
        spec: 'Laser-etched 0.5mm step increments for exact working length prep',
        alloy: 'Anodized Aircraft Aluminum',
        sterilization: 'Autoclave Compatible'
      }
    ]
  },
  {
    id: 'surgery',
    nameKey: 'home.trayExplorer.tabSurgery',
    defaultName: 'Exodontia & Oral Surgery Set',
    department: 'Department of Oral & Maxillofacial Surgery',
    badge: 'Hospital Clinic Tier',
    icon: ScissorsIcon,
    color: 'from-purple-500 to-pink-500',
    accentColor: 'purple',
    trayImage: '/hero-tools.png',
    packagePrice: '3,200',
    originalPrice: '4,100',
    discount: '22%',
    packageLink: '/packages',
    instruments: [
      {
        id: 1,
        name: 'Universal Upper Extraction Forceps #150',
        spec: 'Micro-serrated inner beaks with anatomical beak curvature for premolars & incisors',
        alloy: 'Forged German Martensitic 420A',
        sterilization: 'Autoclave 134°C'
      },
      {
        id: 2,
        name: 'Universal Lower Extraction Forceps #151',
        spec: 'Ergonomic cross-hatched handle for secure surgical grip under gloved conditions',
        alloy: 'Drop-Forged Surgical Steel',
        sterilization: 'Autoclave 134°C'
      },
      {
        id: 3,
        name: 'Straight & Cryer Elevators (Left & Right)',
        spec: 'Thickened reinforced shank to transmit controlled fulcrum leverage force',
        alloy: 'Rockwell HRC 56 Hardened',
        sterilization: '1,000+ Cycles'
      },
      {
        id: 4,
        name: 'Minnesota Cheek Retractor & Dean Scissors',
        spec: 'Smooth satin finish to eliminate reflection under clinical surgical overhead lights',
        alloy: 'Anti-Glare Passivated Steel',
        sterilization: 'Hospital Standard'
      }
    ]
  },
  {
    id: 'preclinical',
    nameKey: 'home.trayExplorer.tabPreclinical',
    defaultName: 'Pre-Clinical Phantom Station',
    department: 'Department of Dental Anatomy & Pre-Clinical',
    badge: '1st & 2nd Year Mandatory',
    icon: AcademicCapIcon,
    color: 'from-amber-500 to-orange-500',
    accentColor: 'amber',
    trayImage: '/hero-tools.png',
    packagePrice: '2,600',
    originalPrice: '3,400',
    discount: '24%',
    packageLink: '/packages',
    instruments: [
      {
        id: 1,
        name: 'Articulated Typodont Jaw (32 Screw-in Teeth)',
        spec: 'Nissin/Frasaco compatible with anatomical occlusal morphology & gingival gingiva',
        alloy: 'Melamine Polymer & Metal Articulator',
        sterilization: 'Disinfectant Wipe Safe'
      },
      {
        id: 2,
        name: 'PK Thomas Waxing Instruments #1 - #5 (Full Set)',
        spec: 'Color-coded anodized aluminum handles with precision curved spoon droppers & carvers',
        alloy: 'Stainless Steel Tips + Anodized Body',
        sterilization: 'Dry Heat & Wipe Safe'
      },
      {
        id: 3,
        name: 'Lecron & Zahle Wax Carvers',
        spec: 'Sharpened lanceolate blades for intricate line-angle carving on ivory wax blocks',
        alloy: 'High Carbon Stainless Steel',
        sterilization: 'Autoclave 134°C'
      },
      {
        id: 4,
        name: 'Dental Bunsen Burner & Base Stand',
        spec: 'Controlled needle flame regulator with brass nozzle for uniform wax heating',
        alloy: 'Solid Brass & Weighted Iron Base',
        sterilization: 'Laboratory Grade'
      }
    ]
  }
];

const InteractiveTrayExplorer = () => {
  const { t } = useTranslation('ecommerce');
  const { isRTL } = useLanguage();
  const [activeTrayId, setActiveTrayId] = useState('operative');
  const [activeInstrumentIndex, setActiveInstrumentIndex] = useState(0);

  const activeTray = traySetups.find((tray) => tray.id === activeTrayId) || traySetups[0];
  const activeInstrument = activeTray.instruments[activeInstrumentIndex] || activeTray.instruments[0];

  return (
    <section className="py-20 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Tech Millimeter Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3 shadow-inner">
            <CubeIcon className="w-4 h-4 text-teal-400" />
            <span>{t('home.trayExplorer.badge') || 'Clinical Tray Setup Simulator'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            {t('home.trayExplorer.title') || 'Interactive Department Tray Explorer'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('home.trayExplorer.subtitle') || 'Explore standard clinical tray configurations required for university practical exams and hospital patient clinics.'}
          </p>
        </div>

        {/* 1. Department Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
          {traySetups.map((tray) => {
            const Icon = tray.icon;
            const isSelected = tray.id === activeTrayId;
            return (
              <button
                key={tray.id}
                type="button"
                onClick={() => {
                  setActiveTrayId(tray.id);
                  setActiveInstrumentIndex(0);
                }}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500 text-white shadow-lg shadow-teal-500/20 scale-105'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{t(tray.nameKey) || tray.defaultName}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Interactive Tray Viewport & Metallurgy Spec Split */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Tray Visual & Hotspot List (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-800/60 border border-slate-700/60 p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 block mb-1">
                    {activeTray.department}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {t(activeTray.nameKey) || activeTray.defaultName}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 shrink-0">
                  {activeTray.badge}
                </span>
              </div>

              {/* Instrument Hotspot Selector List */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-teal-400" />
                  <span>{t('home.trayExplorer.hotspotsTitle') || 'Select Instrument to Inspect:'}</span>
                </p>

                {activeTray.instruments.map((instrument, idx) => {
                  const isCurrent = idx === activeInstrumentIndex;
                  return (
                    <button
                      key={instrument.id}
                      type="button"
                      onClick={() => setActiveInstrumentIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-teal-500/15 border-teal-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold">{instrument.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{instrument.spec}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                        isCurrent ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        Inspect
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tray Bundle Action */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block">Complete Setup Bundle:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">EGP {activeTray.packagePrice}</span>
                  <span className="text-xs line-through text-slate-500">EGP {activeTray.originalPrice}</span>
                  <span className="text-xs font-bold text-teal-400">Save {activeTray.discount}</span>
                </div>
              </div>

              <Link
                to={activeTray.packageLink}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>{t('home.trayExplorer.orderEntireTray') || 'Bundle This Complete Tray'}</span>
                <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>

          </div>

          {/* Right: Detailed Metallurgy & CAD Spec Inspector (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-950 border border-teal-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Tech Corner Crosshairs */}
            <div className="absolute top-3 left-3 text-teal-500/40 font-mono text-[10px] select-none">+ CAD_SPEC_V2</div>
            <div className="absolute top-3 right-3 text-teal-500/40 font-mono text-[10px] select-none">[REV_2026]</div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-widest">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>{t('home.trayExplorer.specTitle') || 'Surgical Grade Metallurgy'}</span>
              </div>

              {/* Active Instrument Big Name */}
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  Item #{activeInstrumentIndex + 1} of {activeTray.instruments.length}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                  {activeInstrument.name}
                </h4>
              </div>

              {/* Spec Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Clinical Function & Bevel</span>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {activeInstrument.spec}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Alloy Metallurgy</span>
                  <p className="text-xs sm:text-sm text-teal-400 font-bold">
                    {activeInstrument.alloy}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Sterilization & Autoclave Rating</span>
                  <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                    {activeInstrument.sterilization}
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Seal */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-teal-400" />
                <span>100% University Spec Approved</span>
              </span>
              <span className="font-mono text-teal-400 font-bold">DIN EN ISO 13485</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractiveTrayExplorer;
