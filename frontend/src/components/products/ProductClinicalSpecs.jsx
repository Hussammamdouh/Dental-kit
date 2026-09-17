import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const ProductClinicalSpecs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('metallurgy');

  const metallurgy = product?.metallurgy || {
    alloy: product?.specs?.alloy || 'AISI 420 Martensitic Surgical Stainless Steel',
    hardness: product?.specs?.hardness || '54 - 58 HRC (Rockwell C Scale)',
    passivation: 'ASTM A967 Standard Chemical Passivation (Oxide Barrier)',
    coating: product?.specs?.coating || 'TiN Nano-Ceramic Non-Stick Coating (Optional)',
    weight: '24.5 grams (Lightweight hollow handle design)',
    handleDiameter: '9.5mm Diamond Knurled Tactile Grip',
    autoclaveCycles: '2,500+ Tested 134°C Class B Sterilization Cycles',
    warranty: '2 Years Anti-Rust & Corrosion Replacement'
  };

  const tabs = [
    { id: 'metallurgy', label: 'Metallurgy & Alloy Specs', icon: WrenchScrewdriverIcon },
    { id: 'autoclave', label: 'Hospital Sterilization Protocol', icon: BeakerIcon },
    { id: 'ergonomics', label: 'Clinical Ergonomics & Grip', icon: SparklesIcon }
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
            Clinical Engineering Matrix
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Instrument Technical Specifications
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4" />
            ISO 13485 & CE Medical Standard
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'metallurgy' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Steel Alloy
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                {metallurgy.alloy}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Rockwell Hardness
              </span>
              <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400 block">
                {metallurgy.hardness}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Surface Passivation
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                {metallurgy.passivation}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Anti-Rust Warranty
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                {metallurgy.warranty}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-300">
              <BoltIcon className="w-4 h-4 text-teal-500" />
              <span>Edge Retention & Hardness Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Drop-forged from medical martensitic stainless steel with elevated carbon and chromium content, ensuring razor-sharp carving bevels and cutting edges through hundreds of clinical cavity preparations and exodontia procedures.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'autoclave' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Steam Sterilization
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                134°C (273°F) / 2.2 Bar
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Autoclave Class
              </span>
              <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400 block">
                Class B Fractional Vacuum Safe
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ultrasonic Cleaning
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                Compatible with Enzymatic Baths
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">
              University Hospital Protocol:
            </span>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Rinse thoroughly with demineralized water immediately after patient treatment.</li>
              <li>Immerse in pH-neutral enzymatic ultrasonic cleaner for 10-15 minutes.</li>
              <li>Dry completely before pouch packaging to maintain oxide passivation barrier.</li>
              <li>Sterilize at 134°C for 5-18 minutes in dental hospital autoclaves.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'ergonomics' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                9.5mm Diamond Knurled Grip
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Machined cross-hatch knurling provides non-slip tactile feedback even when working with wet surgical latex or nitrile examination gloves.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Ultralight Weight Distribution
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hollow handle core reduces overall weight by 35%, drastically minimizing finger fatigue and carpal strain during multi-hour practical clinical exams.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductClinicalSpecs;
