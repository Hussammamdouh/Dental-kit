import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const universities = [
  { id: 'cairo', name: 'Cairo University (Kasr Al-Ainy)', short: 'Cairo Uni' },
  { id: 'ainshams', name: 'Ain Shams University', short: 'Ain Shams' },
  { id: 'mansoura', name: 'Mansoura University', short: 'Mansoura' },
  { id: 'alex', name: 'Alexandria University', short: 'Alexandria' },
  { id: 'suez', name: 'Suez Canal University', short: 'Suez Canal' },
  { id: 'must', name: 'MUST University', short: 'MUST' },
  { id: 'buc', name: 'Badr University (BUC)', short: 'BUC' },
  { id: 'fue', name: 'Future University (FUE)', short: 'FUE' }
];

const academicYears = [
  { id: 'y1', label: '1st Year BDS', stage: 'Dental Anatomy & Carving' },
  { id: 'y2', label: '2nd Year BDS', stage: 'Pre-Clinical Phantom Lab' },
  { id: 'y3', label: '3rd Year BDS', stage: 'Operative & Endo Intro' },
  { id: 'y4', label: '4th Year BDS', stage: 'Hospital Clinical Rotations' },
  { id: 'y5', label: '5th Year BDS', stage: 'Comprehensive Surgery & Clinics' }
];

const facultyKitsDatabase = {
  'cairo-y1': {
    title: 'Kasr Al-Ainy Year 1 Anatomy Starter Kit',
    price: '1,450',
    originalPrice: '1,950',
    discount: '25%',
    items: [
      '32-Tooth Carving Wax Blocks (Ivory Hard Spec)',
      'Lecron & Zahle Fine Carving Instruments Set',
      'Anatomical Boley Gauge & Millimeter Caliper',
      'Articulated Dental Study Cast with Root Anatomy'
    ]
  },
  'cairo-y2': {
    title: 'Kasr Al-Ainy Year 2 Phantom Head & Waxing Kit',
    price: '2,800',
    originalPrice: '3,600',
    discount: '22%',
    items: [
      'Nissin-Compatible Typodont with 32 Cavity Teeth',
      'PK Thomas Waxing Set #1-5 with Anodized Handles',
      'Dental Lab Bunsen Burner & Needle Valve Base',
      'Heavy Duty Metal Articulator Mounting Plate'
    ]
  },
  'cairo-y3': {
    title: 'Kasr Al-Ainy Year 3 Operative & Endo Comprehensive Box',
    price: '3,450',
    originalPrice: '4,500',
    discount: '23%',
    items: [
      'Ivory Rubber Dam Kit (Punch, Forceps, 8 Clamps)',
      '14-Piece German Stainless Steel Restorative Set',
      'K-Files 25mm ISO 15-40 (6-Pack Assorted)',
      'Tofflemire Matrix Bands & Retainer System'
    ]
  },
  'cairo-y4': {
    title: 'Kasr Al-Ainy Year 4 Clinical Exodontia & Surgery Set',
    price: '4,200',
    originalPrice: '5,500',
    discount: '24%',
    items: [
      'Complete Extraction Forceps Kit (#150, #151, #23, #18)',
      'Straight & Cryer Elevators (Stainless Steel)',
      'Periodontal Gracey Curettes #1-14 (Set of 7)',
      'Autoclavable Surgical Cassette Organizer'
    ]
  },
  'cairo-y5': {
    title: 'Kasr Al-Ainy Year 5 Senior Clinical Master Box',
    price: '5,100',
    originalPrice: '6,800',
    discount: '25%',
    items: [
      'Full Surgical & Prosthodontic Impression Tray Kit',
      'Composite Aesthetic TiN Sculpting Master Set',
      'Endo Motor Rotary Files & GP Gauges Set',
      'Heavy-Duty Mobile Doctor Instrument Briefcase'
    ]
  }
};

const FacultyKitMatcher = () => {
  const { t } = useTranslation('ecommerce');
  const { isRTL } = useLanguage();
  const [selectedUniversity, setSelectedUniversity] = useState('cairo');
  const [selectedYear, setSelectedYear] = useState('y3');

  const selectedKey = `${selectedUniversity}-${selectedYear}`;
  const matchedKit = facultyKitsDatabase[selectedKey] || facultyKitsDatabase['cairo-y3'];
  const universityObj = universities.find((u) => u.id === selectedUniversity) || universities[0];
  const yearObj = academicYears.find((y) => y.id === selectedYear) || academicYears[2];

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* Decorative Grid and Background Light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold mb-3 shadow-inner">
            <BuildingLibraryIcon className="w-4 h-4 text-teal-400" />
            <span>{t('home.matcher.badge') || 'Clinical Department Syllabus Matcher'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            {t('home.matcher.title') || "Match Your University's Required Kit"}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('home.matcher.subtitle') || 'Select your dental faculty and academic year to instantly load verified syllabus requirements and tool checklists.'}
          </p>
        </div>

        {/* Matcher Interactive Console */}
        <div className="max-w-5xl mx-auto rounded-[32px] bg-slate-900/80 border border-slate-700/80 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Selectors (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* University Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-teal-400 font-bold mb-2.5">
                  1. {t('home.matcher.selectUniversity') || 'Select Dental Faculty:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {universities.map((uni) => {
                    const isSelected = uni.id === selectedUniversity;
                    return (
                      <button
                        key={uni.id}
                        type="button"
                        onClick={() => setSelectedUniversity(uni.id)}
                        className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                          isSelected
                            ? 'bg-teal-500/20 border-teal-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="block font-bold">{uni.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Year Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-teal-400 font-bold mb-2.5">
                  2. {t('home.matcher.selectYear') || 'Select Academic Year:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {academicYears.map((year) => {
                    const isSelected = year.id === selectedYear;
                    return (
                      <button
                        key={year.id}
                        type="button"
                        onClick={() => setSelectedYear(year.id)}
                        className={`p-3 rounded-xl text-xs text-left transition-all border ${
                          isSelected
                            ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <p className="font-bold text-slate-100">{year.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{year.stage}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Matched Result Card (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl bg-slate-950 border border-teal-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                    <CheckBadgeIcon className="w-4 h-4" />
                    <span>{t('home.matcher.verifiedFaculty') || '100% Professor Verified'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {universityObj.short} • {yearObj.label}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    {t('home.matcher.bundleMatched') || 'Matched Syllabus Kit'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {matchedKit.title}
                  </h3>
                </div>

                {/* Checklist */}
                <div>
                  <p className="text-xs font-bold text-slate-300 mb-2">
                    {t('home.matcher.includedTools') || 'Required Instruments Checklist:'}
                  </p>
                  <ul className="space-y-2">
                    {matchedKit.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price block */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-400 font-semibold block">
                      {t('home.matcher.saveWithBatch') || 'Includes 25% Academic Subsidy'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">EGP {matchedKit.price}</span>
                      <span className="text-xs line-through text-slate-500">EGP {matchedKit.originalPrice}</span>
                    </div>
                  </div>

                  <Link
                    to="/packages"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{t('home.matcher.orderFacultyKit') || 'Order Verified Bundle'}</span>
                    <ArrowRightIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FacultyKitMatcher;
