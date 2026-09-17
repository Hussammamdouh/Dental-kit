import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { getFirstImageUrl } from '../../utils/imageUtils';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  ScaleIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const ProductCompareTray = ({ compareItems, onRemoveItem, onClearAll }) => {
  const { addToCart } = useCart();
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [addingId, setAddingId] = useState(null);

  if (!compareItems || compareItems.length === 0) return null;

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product.id || product._id);
      await addToCart(product, 1);
      toast.success(`Added ${product.name} to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl animate-in slide-in-from-bottom-6 duration-300">
        <div className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 shadow-2xl shadow-teal-950/60 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Selected items count & thumbnails */}
          <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto py-1">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <ScaleIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-black text-white block">Compare Tray</span>
                <span className="text-teal-400 font-semibold">{compareItems.length} / 4 instruments</span>
              </div>
            </div>

            {/* Item Avatars */}
            <div className="flex items-center gap-2">
              {compareItems.map((item) => (
                <div
                  key={item.id || item._id}
                  className="relative group w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center shrink-0"
                >
                  <img
                    src={getFirstImageUrl(item.images)}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id || item._id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 shadow-sm"
                    title="Remove item"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsMatrixOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ScaleIcon className="w-4 h-4 text-slate-950" />
              <span>Compare Specs Matrix</span>
            </button>
          </div>

        </div>
      </div>

      {/* Side-by-Side Comparison Modal Matrix */}
      {isMatrixOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setIsMatrixOpen(false)}
          />

          <div
            className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-8 p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <ScaleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Clinical Metallurgy & Syllabus Comparison
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct side-by-side engineering specifications & academic compliance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMatrixOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-4 px-4 font-bold text-slate-400 uppercase tracking-wider w-44">
                      Specification
                    </th>
                    {compareItems.map((item) => (
                      <th key={item.id || item._id} className="py-4 px-4 min-w-[200px] text-center">
                        <div className="relative aspect-square w-24 h-24 mx-auto mb-2 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center">
                          <img
                            src={getFirstImageUrl(item.images)}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <div className="text-teal-600 dark:text-teal-400 font-black text-sm">
                          EGP {item.price?.toLocaleString()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {/* Steel Alloy */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">
                      Surgical Steel Alloy
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id || item._id} className="py-3 px-4 text-center font-medium">
                        {item.specs?.alloy || 'AISI 420 Martensitic Steel'}
                      </td>
                    ))}
                  </tr>

                  {/* Rockwell Hardness */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">
                      Rockwell Hardness (HRC)
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id || item._id} className="py-3 px-4 text-center font-semibold text-teal-600 dark:text-teal-400">
                        {item.specs?.hardness || '54 - 58 HRC'}
                      </td>
                    ))}
                  </tr>

                  {/* Autoclave Resistance */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">
                      Sterilization Standard
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id || item._id} className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          134°C Class B Autoclave Safe
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Syllabus / Year Standard */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">
                      Academic Target Stage
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id || item._id} className="py-3 px-4 text-center font-medium">
                        {item.targetStage || 'Year 2 - 4 BDS Exam Standard'}
                      </td>
                    ))}
                  </tr>

                  {/* Anti-Corrosion Guarantee */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">
                      Warranty
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id || item._id} className="py-3 px-4 text-center font-medium">
                        2 Years Anti-Rust Guarantee
                      </td>
                    ))}
                  </tr>

                  {/* Direct Add to Cart Action Row */}
                  <tr>
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-200">
                      Cart Action
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id || item._id} className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={addingId === (item.id || item._id)}
                          className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          <span>Add to Tray</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ProductCompareTray;
