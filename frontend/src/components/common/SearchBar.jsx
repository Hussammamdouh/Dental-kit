import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { MagnifyingGlassIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ onSearch, onClose, placeholder, showQuickTags = true, className = '' }) => {
  const { t } = useTranslation('ecommerce');
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const quickTags = [
    'Typodont',
    'Rubber Dam Kit',
    'K-Files 25mm',
    'Restorative Kit',
    'Extraction Forceps',
    'Wax Carver'
  ];

  const executeSearch = (searchTerm) => {
    const term = searchTerm || query;
    if (!term.trim()) return;
    
    if (onSearch) {
      onSearch(term.trim());
    } else {
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    executeSearch(tag);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-teal-600 dark:text-teal-400`}>
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || t('nav.searchPlaceholder') || 'Search dental kits, instruments, typodonts...'}
            autoFocus
            className={`block w-full ${isRTL ? 'pr-12 pl-24' : 'pl-12 pr-24'} py-3.5 text-sm md:text-base rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-white/10 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200`}
          />

          <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1`}>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              {t('nav.search') || 'Search'}
            </button>
          </div>
        </div>
      </form>

      {showQuickTags && (
        <div className="mt-3 flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <SparklesIcon className="w-3.5 h-3.5 text-teal-500" />
            {t('nav.quickSearch') || 'Popular:'}
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-500/10 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200/60 dark:border-white/5 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;