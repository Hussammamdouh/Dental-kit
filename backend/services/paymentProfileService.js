const FirebaseService = require('./firebaseService');

class PaymentProfileService extends FirebaseService {
  constructor() {
    super('paymentProfiles');
  }

  /**
   * Get all payment profiles for a user
   * @param {String} userId - User ID
   * @returns {Promise<Array>} Array of payment profiles
   */
  async getUserPaymentProfiles(userId) {
    try {
      if (!this.collectionRef) {
        throw new Error('Firebase not initialized');
      }

      const snapshot = await this.collectionRef
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .get();

      const profiles = [];
      snapshot.forEach(doc => {
        profiles.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort by isDefault first, then by createdAt
      return profiles.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } catch (error) {
      console.error('Error fetching user payment profiles:', error);
      throw error;
    }
  }

  /**
   * Create a new payment profile
   * @param {Object} profileData - Payment profile data
   * @returns {Promise<Object>} Created payment profile
   */
  async createPaymentProfile(profileData) {
    try {
      const { userId, isDefault } = profileData;

      // If this is set as default, unset other defaults
      if (isDefault) {
        await this.unsetOtherDefaults(userId);
      }

      const profile = {
        userId,
        type: profileData.type || 'card', // 'card', 'bank_account', etc.
        cardNumber: profileData.cardNumber ? this.maskCardNumber(profileData.cardNumber) : null,
        last4: profileData.cardNumber ? profileData.cardNumber.slice(-4) : null,
        cardholderName: profileData.cardholderName || '',
        expiryMonth: profileData.expiryMonth || null,
        expiryYear: profileData.expiryYear || null,
        cardType: profileData.cardType || null, // 'visa', 'mastercard', 'amex', etc.
        billingAddress: profileData.billingAddress || null,
        isDefault: isDefault || false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.create(profile);
    } catch (error) {
      console.error('Error creating payment profile:', error);
      throw error;
    }
  }

  /**
   * Update a payment profile
   * @param {String} profileId - Profile ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated payment profile
   */
  async updatePaymentProfile(profileId, updateData) {
    try {
      const profile = await this.getById(profileId);
      if (!profile) {
        throw new Error('Payment profile not found');
      }

      // If setting as default, unset other defaults
      if (updateData.isDefault && !profile.isDefault) {
        await this.unsetOtherDefaults(profile.userId);
      }

      // Update card number mask if card number is being updated
      if (updateData.cardNumber) {
        updateData.cardNumber = this.maskCardNumber(updateData.cardNumber);
        updateData.last4 = updateData.cardNumber.slice(-4);
      }

      updateData.updatedAt = new Date();

      return await this.update(profileId, updateData);
    } catch (error) {
      console.error('Error updating payment profile:', error);
      throw error;
    }
  }

  /**
   * Delete a payment profile (soft delete)
   * @param {String} profileId - Profile ID
   * @returns {Promise<void>}
   */
  async deletePaymentProfile(profileId) {
    try {
      return await this.update(profileId, {
        isActive: false,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error deleting payment profile:', error);
      throw error;
    }
  }

  /**
   * Set a payment profile as default
   * @param {String} profileId - Profile ID
   * @returns {Promise<Object>} Updated payment profile
   */
  async setAsDefault(profileId) {
    try {
      const profile = await this.getById(profileId);
      if (!profile) {
        throw new Error('Payment profile not found');
      }

      // Unset other defaults
      await this.unsetOtherDefaults(profile.userId);

      // Set this as default
      return await this.update(profileId, {
        isDefault: true,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error setting default payment profile:', error);
      throw error;
    }
  }

  /**
   * Unset default status for all other profiles of a user
   * @param {String} userId - User ID
   * @returns {Promise<void>}
   */
  async unsetOtherDefaults(userId) {
    try {
      if (!this.collectionRef) {
        throw new Error('Firebase not initialized');
      }

      const snapshot = await this.collectionRef
        .where('userId', '==', userId)
        .where('isDefault', '==', true)
        .get();

      const batch = this.collectionRef.firestore.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, {
          isDefault: false,
          updatedAt: new Date()
        });
      });

      if (snapshot.size > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error('Error unsetting other defaults:', error);
      throw error;
    }
  }

  /**
   * Mask card number (show only last 4 digits)
   * @param {String} cardNumber - Full card number
   * @returns {String} Masked card number
   */
  maskCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length < 4) {
      return cardNumber;
    }
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
  }

  /**
   * Detect card type from card number
   * @param {String} cardNumber - Card number
   * @returns {String} Card type
   */
  detectCardType(cardNumber) {
    if (!cardNumber) return null;
    
    const number = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    
    return 'unknown';
  }
}

module.exports = PaymentProfileService;




