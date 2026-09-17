import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon,
  BuildingLibraryIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const PackageInspectModal = ({ pkg, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !pkg) return null;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
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
      onClose();
    } catch (err) {
      toast.error('Failed to add package to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const items = pkg.items || [
    { name: '14-Piece German Restorative Instrument Set', spec: 'AISI 420 Martensitic Steel', qty: 1 },
    { name: 'Complete Rubber Dam Kit with Ivory Clamps', spec: 'Stainless Steel + Punch & Forceps', qty: 1 },
    { name: 'Diagnostic Examination Set (Mirror, Probe, Tweezers)', spec: 'Rhodium Front Surface #5', qty: 1 },
    { name: 'Heavy-Duty Autoclavable Medical Organizer Box', spec: '134°C Autoclavable Polymer', qty: 1 }
  ];

  const discount = pkg.originalPrice && pkg.price
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : pkg.discountPercentage || 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 my-8 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                {pkg.stageBadge || 'BDS Academic Package'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white shadow-sm">
                Save {discount}%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {pkg.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {pkg.description || 'Full curriculum-aligned tool box including heavy-duty autoclavable storage cassette.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Included Items Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <SparklesIcon className="w-4 h-4 text-teal-500" />
              <span>Package Tool Inventory ({items.length} Modules Included)</span>
            </h4>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              100% Professor Checklist Approved
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {typeof item === 'string' ? item : item.name}
                    </span>
                    {item.spec && (
                      <span className="text-[10px] text-slate-400 block">
                        {item.spec}
                      </span>
                    )}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  Qty: {item.qty || 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Guarantee Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 text-center">
            <ShieldCheckIcon className="w-5 h-5 text-teal-500 mx-auto mb-1" />
            <span className="text-xs font-bold text-slate-900 dark:text-white block">AISI 420 Steel</span>
            <span className="text-[10px] text-slate-400">German Metallurgy Standard</span>
          </div>

          <div className="p-3 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 text-center">
            <BeakerIcon className="w-5 h-5 text-teal-500 mx-auto mb-1" />
            <span className="text-xs font-bold text-slate-900 dark:text-white block">134°C Autoclavable</span>
            <span className="text-[10px] text-slate-400">Hospital Class B Safe</span>
          </div>

          <div className="p-3 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 text-center">
            <BuildingLibraryIcon className="w-5 h-5 text-teal-500 mx-auto mb-1" />
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Faculty Verified</span>
            <span className="text-[10px] text-slate-400">Kasr Al-Ainy & Ain Shams</span>
          </div>
        </div>

        {/* Footer Pricing & Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 block">Complete Package Price:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                <span className="text-sm font-bold mr-1">EGP</span>
                {(pkg.price || pkg.packagePrice)?.toLocaleString()}
              </span>
              {pkg.originalPrice && (
                <span className="text-sm line-through text-slate-400">
                  EGP {pkg.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{isAdding ? 'Adding Package...' : 'Add Complete Box to Student Tray'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PackageInspectModal;
