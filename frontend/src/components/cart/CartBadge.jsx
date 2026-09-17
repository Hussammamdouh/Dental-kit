import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const CartBadge = ({ className = '' }) => {
  const { t } = useTranslation('ecommerce');
  const { items } = useCart();

  const itemCount = Array.isArray(items) 
    ? items.reduce((total, item) => total + (item.quantity || 0), 0) 
    : 0;

  return (
    <Link
      to="/cart"
      aria-label="Shopping Cart"
      className={`relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 group ${className}`}
    >
      <ShoppingBagIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-1 text-[10px] font-extrabold text-white shadow-md shadow-teal-500/30 ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50 duration-200">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;