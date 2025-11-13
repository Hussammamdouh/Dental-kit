const PaymentProfileService = require('../services/paymentProfileService');
const paymentProfileService = new PaymentProfileService();

/**
 * Get all payment profiles for the authenticated user
 */
exports.getPaymentProfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const profiles = await paymentProfileService.getUserPaymentProfiles(userId);
    
    res.json({
      success: true,
      profiles
    });
  } catch (error) {
    console.error('Get payment profiles error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching payment profiles'
    });
  }
};

/**
 * Create a new payment profile
 */
exports.createPaymentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = {
      ...req.body,
      userId
    };

    // Detect card type if card number is provided
    if (profileData.cardNumber) {
      profileData.cardType = paymentProfileService.detectCardType(profileData.cardNumber);
    }

    const profile = await paymentProfileService.createPaymentProfile(profileData);
    
    res.status(201).json({
      success: true,
      profile,
      message: 'Payment profile created successfully'
    });
  } catch (error) {
    console.error('Create payment profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment profile'
    });
  }
};

/**
 * Update a payment profile
 */
exports.updatePaymentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.params;
    const updateData = req.body;

    // Verify profile belongs to user
    const profile = await paymentProfileService.getById(profileId);
    if (!profile || profile.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Detect card type if card number is being updated
    if (updateData.cardNumber) {
      updateData.cardType = paymentProfileService.detectCardType(updateData.cardNumber);
    }

    const updatedProfile = await paymentProfileService.updatePaymentProfile(profileId, updateData);
    
    res.json({
      success: true,
      profile: updatedProfile,
      message: 'Payment profile updated successfully'
    });
  } catch (error) {
    console.error('Update payment profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating payment profile'
    });
  }
};

/**
 * Delete a payment profile
 */
exports.deletePaymentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.params;

    // Verify profile belongs to user
    const profile = await paymentProfileService.getById(profileId);
    if (!profile || profile.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await paymentProfileService.deletePaymentProfile(profileId);
    
    res.json({
      success: true,
      message: 'Payment profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting payment profile'
    });
  }
};

/**
 * Set a payment profile as default
 */
exports.setDefaultPaymentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.params;

    // Verify profile belongs to user
    const profile = await paymentProfileService.getById(profileId);
    if (!profile || profile.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedProfile = await paymentProfileService.setAsDefault(profileId);
    
    res.json({
      success: true,
      profile: updatedProfile,
      message: 'Default payment profile updated successfully'
    });
  } catch (error) {
    console.error('Set default payment profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error setting default payment profile'
    });
  }
};




