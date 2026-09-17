import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-hot-toast';
import Logo from '../common/Logo';
import {
  AcademicCapIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation('ecommerce');
  const { isRTL } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success(t('footer.subscribeSuccess') || 'Thank you for subscribing!');
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const perks = [
    {
      icon: AcademicCapIcon,
      title: t('footer.perks.student') || 'Student Pricing',
      desc: t('footer.perks.studentDesc') || 'Exclusive student kit savings',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    },
    {
      icon: TruckIcon,
      title: t('footer.perks.shipping') || 'Campus Delivery',
      desc: t('footer.perks.shippingDesc') || 'Fast & safe direct shipping',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      icon: ShieldCheckIcon,
      title: t('footer.perks.quality') || 'Medical Precision',
      desc: t('footer.perks.qualityDesc') || 'High-grade stainless steel',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: ArrowPathIcon,
      title: t('footer.perks.warranty') || 'Warranty Backed',
      desc: t('footer.perks.warrantyDesc') || 'Hassle-free replacement',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
      {/* Top subtle glow accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-60" />

      {/* 1. Value Perks & Guarantee Bar */}
      <div className="border-b border-slate-800/60 bg-slate-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-teal-500/30 transition-all duration-200"
                >
                  <div className={`p-3 rounded-xl ${perk.color} border shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{perk.title}</h4>
                    <p className="text-xs text-slate-400 leading-snug">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        
        {/* 2. Newsletter / Student Discount Banner */}
        <div className="relative rounded-3xl p-6 sm:p-10 mb-14 sm:mb-16 overflow-hidden bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/20 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20 mb-3">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Student Community</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                {t('footer.newsletterTitle') || 'Stay Ahead in Dental School'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('footer.newsletterSubtitle') || 'Subscribe for student bundle drops, academic discounts, and clinic checklist guides.'}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 min-w-0 sm:min-w-[360px]">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('footer.newsletterPlaceholder') || 'Enter your university email...'}
                  className="w-full px-5 py-3.5 text-sm rounded-2xl bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-sm font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                <span>{t('footer.subscribe') || 'Subscribe'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* 3. Main 4-Column Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 mb-14">
          
          {/* Column 1: Brand Info & Accreditation (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.brandDescription') || 'Providing dental students and clinicians with premium surgical, restorative, and pre-clinical kits. Engineered for precision and university approved.'}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-teal-400">
                <CheckBadgeIcon className="w-3.5 h-3.5" />
                {t('footer.badgeUniversity') || 'University Partner'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-cyan-400" />
                {t('footer.badgeCertified') || 'ISO 13485 Certified'}
              </span>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              {[
                { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-400 hover:border-blue-500/40' },
                { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-400 hover:border-pink-500/40' },
                { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-400 hover:border-sky-500/40' },
                { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-cyan-400 hover:border-cyan-500/40' },
                { icon: FaWhatsapp, href: 'https://wa.me/201111194483', label: 'WhatsApp', color: 'hover:text-emerald-400 hover:border-emerald-500/40' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className={`w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-200 hover:scale-110 ${item.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Dental Kits & Categories (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 pb-2 border-b border-slate-800/80 inline-block">
              {t('footer.columns.kits') || 'Dental Student Kits'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/products?category=pre-clinical" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>{t('footer.links.preclinical') || 'Pre-Clinical Kits'}</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=clinical" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>{t('footer.links.clinical') || 'Clinical Instruments'}</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=endodontics" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>{t('footer.links.endoResto') || 'Endo & Restorative'}</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=surgery" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>{t('footer.links.surgery') || 'Surgical Sets'}</span>
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>{t('footer.links.packages') || 'Student Packages'}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-500/20 text-teal-400 font-semibold">Bundles</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student Hub & Support (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 pb-2 border-b border-slate-800/80 inline-block">
              {t('footer.columns.support') || 'Student Support'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/orders" className="text-slate-400 hover:text-teal-400 transition-colors">
                  {t('footer.links.trackOrder') || 'Track Order'}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-slate-400 hover:text-teal-400 transition-colors">
                  {t('footer.links.shippingPolicy') || 'Campus Shipping'}
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-slate-400 hover:text-teal-400 transition-colors">
                  {t('footer.links.returnsWarranty') || 'Warranty & Returns'}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-slate-400 hover:text-teal-400 transition-colors">
                  {t('footer.links.faq') || 'Help Center'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-teal-400 transition-colors">
                  {t('footer.links.aboutUs') || 'About Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Reps (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 pb-2 border-b border-slate-800/80 inline-block">
              {t('footer.columns.contact') || 'Contact & Reps'}
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 text-teal-400 mt-0.5">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Main Branch</p>
                  <p className="text-slate-400">{t('footer.contact.address') || 'Medical District Plaza, Suez, Egypt'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 text-teal-400 mt-0.5">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Student Helpline</p>
                  <a href="tel:+201111194483" className="text-slate-400 hover:text-teal-400 transition-colors">
                    +20 111 119 4483
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 text-teal-400 mt-0.5">
                  <EnvelopeIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href="mailto:support@dentalkit.com" className="text-slate-400 hover:text-teal-400 transition-colors">
                    support@dentalkit.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 text-teal-400 mt-0.5">
                  <ClockIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Working Hours</p>
                  <p className="text-slate-400">{t('footer.contact.hours') || 'Sun - Thu: 9:00 AM - 6:00 PM'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Bottom Copyright, Policies & Back to top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {t('footer.copyright') || 'DentalKit - Student & Clinic Dental Supply Co. All rights reserved.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              {t('footer.links.termsOfService') || 'Terms of Service'}
            </Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              {t('footer.links.privacyPolicy') || 'Privacy Policy'}
            </Link>
            <Link to="/warranty" className="hover:text-slate-300 transition-colors">
              {t('footer.links.returnsWarranty') || 'Instrument Warranty'}
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-teal-400 hover:border-teal-500/40 transition-all flex items-center gap-1 ml-2"
              aria-label="Back to top"
              title="Back to top"
            >
              <ChevronUpIcon className="w-4 h-4" />
              <span className="text-[11px] font-medium hidden sm:inline">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
