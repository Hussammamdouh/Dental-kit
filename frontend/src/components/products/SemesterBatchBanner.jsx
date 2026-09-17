import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import {
  SparklesIcon,
  AcademicCapIcon,
  TagIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const SemesterBatchBanner = () => {
  const { cartItems } = useCart();
  const [copied, setCopied] = useState(false);

  const itemCount = Array.isArray(cartItems)
    ? cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)
    : 0;

  const targetCount = 3;
  const progressPct = Math.min(100, Math.round((itemCount / targetCount) * 100));

  const handleCopyCode = () => {
    navigator.clipboard.writeText('CAMPUS15');
    setCopied(true);
    toast.success('Coupon code CAMPUS15 copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-500/30 p-5 sm:p-6 mb-8 text-white shadow-xl shadow-teal-950/40">
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00b1db_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Info & Ticker */}
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-black uppercase tracking-wider">
            <BoltIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>Semester Cohort Discount Ticker</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white">
            Unlock 15% Off Your University Exam Kit
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Add 3 or more surgical instruments or restorative sets to your student tray to automatically activate university batch pricing.
          </p>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Student Tray Progress:</span>
              <span className="text-teal-400 font-bold">
                {itemCount >= targetCount
                  ? '🎉 15% Campus Discount Unlocked!'
                  : `${itemCount} of ${targetCount} items in cart`}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 border border-slate-700/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Coupon Box */}
        <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Faculty Promo Code:
          </span>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-dashed border-teal-500/50 text-teal-300 font-mono font-black text-sm tracking-wider">
              CAMPUS15
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all hover:scale-105"
              title="Copy Coupon"
            >
              {copied ? <CheckIcon className="w-4 h-4 text-white" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
            </button>
          </div>
          <span className="text-[10px] text-slate-400">Valid for Kasr Al-Ainy, Ain Shams, Mansoura & all BDS students</span>
        </div>

      </div>
    </div>
  );
};

export default SemesterBatchBanner;
