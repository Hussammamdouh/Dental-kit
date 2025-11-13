import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api, { endpoints } from '../services/api';
import { toast } from 'react-hot-toast';
import Seo from '../components/seo/Seo';

const PaymentMethodsPage = () => {
  const { t } = useTranslation('ecommerce');
  const navigate = useNavigate();
  
  // State
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });

  // Fetch payment profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.paymentProfiles.list);
      setProfiles(response.data.profiles || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch payment profiles');
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  // Load profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  // Detect card type from number
  const getCardType = (cardNumber) => {
    if (!cardNumber) return null;
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    return 'unknown';
  };

  // Get card icon
  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number');
      return false;
    }
    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      toast.error('Please enter cardholder name');
      return false;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      toast.error('Please enter card expiry date');
      return false;
    }
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (parseInt(formData.expiryYear) < currentYear || 
        (parseInt(formData.expiryYear) === currentYear && parseInt(formData.expiryMonth) < currentMonth)) {
      toast.error('Card has expired');
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      const cardType = getCardType(cardNumber);
      
      const profileData = {
        type: 'card',
        cardNumber: cardNumber,
        cardholderName: formData.cardholderName,
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        cardType: cardType,
        isDefault: formData.isDefault || profiles.length === 0
      };

      if (editingProfile) {
        await api.put(endpoints.paymentProfiles.update(editingProfile.id), profileData);
        toast.success('Payment method updated successfully');
      } else {
        await api.post(endpoints.paymentProfiles.create, profileData);
        toast.success('Payment method added successfully');
      }

      // Reset form
      setFormData({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
      setShowAddForm(false);
      setEditingProfile(null);
      
      // Refresh profiles
      await fetchProfiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      await api.delete(endpoints.paymentProfiles.delete(profileId));
      toast.success('Payment method deleted successfully');
      await fetchProfiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete payment method');
    }
  };

  // Handle set as default
  const handleSetDefault = async (profileId) => {
    try {
      await api.patch(endpoints.paymentProfiles.setDefault(profileId));
      toast.success('Default payment method updated');
      await fetchProfiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update default payment method');
    }
  };

  // Handle edit
  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      cardNumber: profile.cardNumber || '',
      cardholderName: profile.cardholderName || '',
      expiryMonth: profile.expiryMonth?.toString().padStart(2, '0') || '',
      expiryYear: profile.expiryYear?.toString() || '',
      cvv: '',
      isDefault: profile.isDefault || false
    });
    setShowAddForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProfile(null);
    setFormData({
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    });
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  // Generate year options (next 20 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Seo
        title="Payment Methods"
        description="Manage your saved payment methods"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center text-white/90 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Payment Methods
              </h1>
              <p className="text-lg sm:text-xl opacity-95">
                Manage your saved payment cards and methods
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Security Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/30">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Secure Payment Storage
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your payment information is encrypted and securely stored. We never store your CVV code.
                  Card numbers are masked and only the last 4 digits are visible.
                </p>
              </div>
            </div>
          </div>

          {/* Add Payment Method Button */}
          {!showAddForm && (
            <div className="flex justify-end">
              <Button
                onClick={() => setShowAddForm(true)}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Payment Method</span>
              </Button>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingProfile ? 'Edit Payment Method' : 'Add Payment Method'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <Input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                    className="text-lg"
                  />
                  {formData.cardNumber && (
                    <p className="mt-1 text-xs text-gray-500">
                      Card Type: {getCardType(formData.cardNumber) || 'Unknown'}
                    </p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <Input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Month
                    </label>
                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Month</option>
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Year
                    </label>
                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Year</option>
                      {yearOptions.map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Set as default payment method
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      editingProfile ? 'Update Payment Method' : 'Add Payment Method'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Profiles List */}
          {profiles.length === 0 && !showAddForm && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20 dark:border-gray-700/20">
              <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Payment Methods
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't saved any payment methods yet. Add one to make checkout faster!
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="primary"
              >
                Add Payment Method
              </Button>
            </div>
          )}

          {/* Payment Profiles Grid */}
          {profiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((profile) => {
                const cardType = profile.cardType || 'unknown';
                const cardIcon = getCardIcon(cardType);
                
                return (
                  <div
                    key={profile.id}
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 transition-all ${
                      profile.isDefault
                        ? 'border-teal-500 dark:border-teal-400'
                        : 'border-white/20 dark:border-gray-700/20'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{cardIcon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {profile.cardType ? profile.cardType.toUpperCase() : 'Card'}
                          </h3>
                          {profile.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 mt-1">
                              <CheckCircleIconSolid className="w-3 h-3 mr-1" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="p-2 text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Card Number</p>
                        <p className="text-lg font-mono text-gray-900 dark:text-white">
                          {profile.cardNumber || `**** **** **** ${profile.last4 || '****'}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cardholder Name</p>
                        <p className="text-gray-900 dark:text-white">{profile.cardholderName || 'N/A'}</p>
                      </div>
                      {(profile.expiryMonth || profile.expiryYear) && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expires</p>
                          <p className="text-gray-900 dark:text-white">
                            {profile.expiryMonth?.toString().padStart(2, '0')}/{profile.expiryYear}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Set as Default Button */}
                    {!profile.isDefault && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          onClick={() => handleSetDefault(profile.id)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Set as Default
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;

