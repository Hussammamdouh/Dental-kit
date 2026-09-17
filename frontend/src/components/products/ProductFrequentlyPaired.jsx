import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { getFirstImageUrl } from '../../utils/imageUtils';
import {
  PlusIcon,
  ShoppingCartIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const ProductFrequentlyPaired = ({ mainProduct }) => {
  const { addToCart } = useCart();
  const [selectedCompanionIds, setSelectedCompanionIds] = useState(new Set([1, 2]));
  const [isAdding, setIsAdding] = useState(false);

  // Mock companion instruments tailored for dental students
  const companionProducts = [
    {
      id: 1,
      name: 'DG-16 Endodontic Canal Explorer (German Steel)',
      price: 280,
      originalPrice: 350,
      image: '/images/products/dg16-explorer.png',
      spec: 'AISI 420 Steel'
    },
    {
      id: 2,
      name: 'Front Surface Rhodium Examination Mirror #5',
      price: 190,
      originalPrice: 240,
      image: '/images/products/rhodium-mirror.png',
      spec: 'Distortion-Free Rhodium'
    },
    {
      id: 3,
      name: 'Autoclavable Surgical Stainless Tray Rack (5-Tool)',
      price: 450,
      originalPrice: 580,
      image: '/images/products/tray-cassette.png',
      spec: '134°C Autoclave Safe'
    }
  ];

  const toggleCompanion = (id) => {
    setSelectedCompanionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCompanions = companionProducts.filter((p) => selectedCompanionIds.has(p.id));
  const mainPrice = mainProduct?.price || 0;
  const companionPrice = selectedCompanions.reduce((acc, p) => acc + p.price, 0);
  const totalPrice = mainPrice + companionPrice;
  const bundleDiscount = Math.round(totalPrice * 0.15); // 15% bundle discount
  const finalPrice = totalPrice - bundleDiscount;

  const handleAddBundleToCart = async () => {
    try {
      setIsAdding(true);
      // Add main product
      await addToCart(mainProduct, 1);
      // Add selected companions
      for (const comp of selectedCompanions) {
        await addToCart(
          {
            _id: `comp-${comp.id}`,
            id: `comp-${comp.id}`,
            name: comp.name,
            price: comp.price,
            images: [comp.image]
          },
          1
        );
      }
      toast.success('Complete clinical tray bundle added to cart!');
    } catch (err) {
      toast.error('Failed to add bundle to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
            Clinical Exam Kit Builder
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Frequently Paired in University Trays
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-black">
          Save 15% on Tray Bundle
        </span>
      </div>

      {/* Products Row with + Icons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Product Items (8 cols) */}
        <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-4 flex-wrap">
          
          {/* Main Product Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 w-full sm:w-56 shrink-0">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center shrink-0">
              <img
                src={getFirstImageUrl(mainProduct?.images)}
                alt={mainProduct?.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase block">
                Selected Item
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {mainProduct?.name}
              </h4>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                EGP {mainProduct?.price?.toLocaleString()}
              </span>
            </div>
          </div>

          <PlusIcon className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />

          {/* Companion Items */}
          {companionProducts.map((comp) => {
            const isSelected = selectedCompanionIds.has(comp.id);
            return (
              <div
                key={comp.id}
                onClick={() => toggleCompanion(comp.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer w-full sm:w-56 shrink-0 ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-800/80 border-teal-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {comp.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs mt-0.5">
                    <span className="font-black text-teal-600 dark:text-teal-400">
                      EGP {comp.price}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      EGP {comp.originalPrice}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Right: Pricing & 1-Click Action (4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Bundle Total ({1 + selectedCompanions.length} items):
            </span>
            <div className="text-right">
              <div className="text-xl font-black text-slate-900 dark:text-white">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 mr-1">EGP</span>
                {finalPrice.toLocaleString()}
              </div>
              <span className="text-xs line-through text-slate-400">
                EGP {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            disabled={isAdding}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>{isAdding ? 'Adding Bundle...' : 'Add Complete Clinical Tray'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductFrequentlyPaired;
